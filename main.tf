provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}

# VCN
resource "oci_core_virtual_network" "vcn" {
  compartment_id = var.compartment_ocid
  display_name   = "tf-vcn"
  cidr_block     = "10.0.0.0/16"
}

# Internet Gateway
resource "oci_core_internet_gateway" "igw" {
  compartment_id     = var.compartment_ocid
  display_name       = "tf-igw"
  virtual_network_id = oci_core_virtual_network.vcn.id
}

# Route Table
resource "oci_core_route_table" "rt" {
  compartment_id     = var.compartment_ocid
  display_name       = "tf-rt"
  virtual_network_id = oci_core_virtual_network.vcn.id

  route_rules {
    destination       = "0.0.0.0/0"
    network_entity_id = oci_core_internet_gateway.igw.id
  }
}

# Public Subnet
resource "oci_core_subnet" "public_subnet" {
  compartment_id     = var.compartment_ocid
  virtual_network_id = oci_core_virtual_network.vcn.id
  cidr_block         = "10.0.0.0/24"
  display_name       = "tf-public-subnet"
  route_table_id     = oci_core_route_table.rt.id
  prohibit_public_ip_on_vnic = false
}

# Security List (allow SSH)
resource "oci_core_security_list" "sl" {
  compartment_id     = var.compartment_ocid
  virtual_network_id = oci_core_virtual_network.vcn.id
  display_name       = "tf-sl"

  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"
    tcp_options {
      min = 22
      max = 22
    }
  }

  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
  }
}

# Compute Instance
resource "oci_core_instance" "vm" {
  compartment_id       = var.compartment_ocid
  availability_domain  = var.ad
  display_name         = "tf-vm"
  shape                = "VM.Standard.E2.1.Micro"

  create_vnic_details {
    subnet_id        = oci_core_subnet.public_subnet.id
    assign_public_ip = true
    display_name     = "tf-vnic"
  }

  source_details {
    source_type = "image"
    image_id    = var.ubuntu_image_id
  }

  metadata = {
    ssh_authorized_keys = file(var.public_ssh_key_path)
  }
}

# Output the public IP
output "OCI_HOST" {
  value = oci_core_instance.vm.public_ip
  description = "Public IP of the VM for SSH"
}

# Helper for SSH private key path
output "OCI_SSH_KEY" {
  value = var.private_ssh_key_path
  description = "Path to your local private SSH key"
}
