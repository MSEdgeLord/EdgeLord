#!/usr/bin/env bash

# Check for required dependencies
check_dependencies() {
  for cmd in "$@"; do
    if ! command -v "$cmd" &> /dev/null; then
      echo "Installing missing dependency: $cmd"
      sudo apt-get install -yq "$cmd"
    fi
  done
}

# Check and install any missing dependencies
check_dependencies curl gpg

# Add Microsoft's GPG key
curl -s https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg

# Move the GPG key to the trusted keyring
sudo install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/

# Add the Microsoft Edge stable repository
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge-stable.list'

# Clean up the downloaded GPG key
rm -f microsoft.gpg

# Update package list
sudo apt-get update -q

# Install Microsoft Edge stable in a non-interactive manner
sudo DEBIAN_FRONTEND=noninteractive apt-get install -yq microsoft-edge-stable

echo "Microsoft Edge Stable has been installed successfully!"

