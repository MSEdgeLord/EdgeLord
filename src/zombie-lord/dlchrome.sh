#!/usr/bin/env bash

# Determine the system architecture
amd64=$(dpkg --print-architecture || uname -m)

# Remove any existing downloaded files
rm microsoft-edge-stable_current_$amd64.deb || :

# Download the Microsoft Edge .deb package
wget https://packages.microsoft.com/repos/edge/pool/main/m/microsoft-edge-stable/microsoft-edge-stable_current_$amd64.deb

# Check if the file was downloaded successfully
if [[ -f microsoft-edge-stable_current_$amd64.deb ]]; then
  # Install the downloaded package
  sudo dpkg -i microsoft-edge-stable_current_$amd64.deb 

  # Fix any broken dependencies
  sudo apt --fix-broken -y install

  # Remove the downloaded package
  rm microsoft-edge-stable_current_$amd64.deb || :
else
  # Fallback to installing Chromium if the download fails
  sudo apt install -y chromium
fi

