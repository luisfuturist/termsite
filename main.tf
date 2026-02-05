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
}

resource "oci_core_route_table" "rt" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id

  route_rules {
    destination       = "0.0.0.0/0"
    network_entity_id = oci_core_internet_gateway.igw.id
  }
}

resource "oci_core_security_list" "sl" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id

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
    protocol    = "all"
    destination = "0.0.0.0/0"
  }
}

resource "oci_core_subnet" "subnet" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id
  cidr_block     = "10.0.1.0/24"
  route_table_id = oci_core_route_table.rt.id
  security_list_ids = [oci_core_security_list.sl.id]
  prohibit_public_ip_on_vnic = false
}

# Network Security Group (if NSGs are attached to VNIC, they override Security Lists)
resource "oci_core_network_security_group" "nsg" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.vcn.id
  display_name   = "termsite-nsg"
}

resource "oci_core_network_security_group_security_rule" "ssh_22" {
  network_security_group_id = oci_core_network_security_group.nsg.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = "0.0.0.0/0"
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
  description               = "Allow TCP 2200 for system SSH (moved from port 22 by cloud-init)"

  tcp_options {
    destination_port_range {
      min = 2200
      max = 2200
    }
  }
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
}

# Outputs

output "public_ip" {
  value = oci_core_instance.vm.public_ip
}
