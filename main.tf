terraform {
  required_version = ">= 1.3"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 5.0"
    }
  }
}

provider "oci" {
  region = var.region
}

# Variables
variable "compartment_ocid" {}
variable "region" {}
variable "ssh_public_key" {}

# Networking
resource "oci_core_vcn" "vcn" {
  compartment_id = var.compartment_ocid
  cidr_block     = "10.0.0.0/16"
  display_name   = "termsite-vcn"
}

resource "oci_core_internet_gateway" "igw" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id
  display_name   = "termsite-internet-gateway"
  enabled        = true
}

resource "oci_core_route_table" "rt" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id
  display_name   = "termsite-route-table"

  route_rules {
    description       = "Default route to internet gateway"
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.igw.id
  }
}

# Security List (backup/fallback - NSG attached to VNIC takes precedence)
resource "oci_core_security_list" "sl" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id
  display_name   = "termsite-security-list"

  ingress_security_rules {
    description = "Allow TCP 22 for application SSH server"
    protocol    = "6"
    source      = "0.0.0.0/0"
    tcp_options {
      min = 22
      max = 22
    }
  }

  ingress_security_rules {
    description = "Allow TCP 2200 for system SSH (moved from port 22 by cloud-init)"
    protocol    = "6"
    source      = "0.0.0.0/0"
    tcp_options {
      min = 2200
      max = 2200
    }
  }

  egress_security_rules {
    description = "Allow all outbound traffic"
    protocol    = "all"
    destination = "0.0.0.0/0"
  }
}

resource "oci_core_subnet" "subnet" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id
  cidr_block     = "10.0.1.0/24"
  display_name   = "termsite-subnet"
  route_table_id = oci_core_route_table.rt.id
  # Security list is kept for fallback, but NSG attached to VNIC takes precedence
  security_list_ids = [oci_core_security_list.sl.id]
  prohibit_public_ip_on_vnic = false
}

# Network Security Group (NSG attached to VNIC overrides Security Lists)
# NSGs provide more granular, stateful firewall rules
resource "oci_core_network_security_group" "nsg" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id
  display_name   = "termsite-nsg"
}

# Ingress Rules
resource "oci_core_network_security_group_security_rule" "ssh_22" {
  network_security_group_id = oci_core_network_security_group.nsg.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = "0.0.0.0/0"
  source_type               = "CIDR_BLOCK"
  description               = "Allow TCP 22 for application SSH server"

  tcp_options {
    destination_port_range {
      min = 22
      max = 22
    }
  }
}

resource "oci_core_network_security_group_security_rule" "ssh_2200" {
  network_security_group_id = oci_core_network_security_group.nsg.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = "0.0.0.0/0"
  source_type               = "CIDR_BLOCK"
  description               = "Allow TCP 2200 for system SSH (moved from port 22 by cloud-init)"

  tcp_options {
    destination_port_range {
      min = 2200
      max = 2200
    }
  }
}

# Egress Rules
resource "oci_core_network_security_group_security_rule" "egress_all" {
  network_security_group_id = oci_core_network_security_group.nsg.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
  description               = "Allow all outbound traffic"
}

# Compute

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_ocid
}


data "oci_core_images" "ubuntu" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = "VM.Standard.E2.1.Micro"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

resource "oci_core_instance" "vm" {
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  shape               = "VM.Standard.E2.1.Micro"

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ubuntu.images[0].id
  }

  create_vnic_details {
    subnet_id      = oci_core_subnet.subnet.id
    assign_public_ip = true
    nsg_ids        = [oci_core_network_security_group.nsg.id]
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(file("${path.module}/cloud-init.yaml"))
  }

  # Ensure NSG rules are created before instance
  depends_on = [
    oci_core_network_security_group_security_rule.ssh_22,
    oci_core_network_security_group_security_rule.ssh_2200,
    oci_core_network_security_group_security_rule.egress_all
  ]
}

# Outputs

output "public_ip" {
  value = oci_core_instance.vm.public_ip
}

output "instance_ocid" {
  value       = oci_core_instance.vm.id
  description = "Instance OCID for OCI CLI operations"
}

output "nsg_ocid" {
  value       = oci_core_network_security_group.nsg.id
  description = "NSG OCID for OCI CLI operations"
}

# Note: To get VNIC OCID, use: oci compute instance list-vnics --instance-id $(terraform output -raw instance_ocid) --query 'data[0].id' --raw-output
