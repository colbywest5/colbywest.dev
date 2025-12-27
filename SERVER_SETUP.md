# Server Setup Guide (Ubuntu)

Follow these steps to set up your fresh Ubuntu server and deploy the application.

## 1. Install Docker & Git
We'll use the official Docker convenience script for a quick and secure install.

```bash
# Update and install git
sudo apt-get update && sudo apt-get install -y git

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Configure Permissions (Critical)
# This allows you to run Docker commands without sudo (required for the deploy script).
sudo usermod -aG docker $USER
# You MUST log out and log back in for this to take effect!
```

## 2. Clone the Repository

```bash
git clone https://github.com/colbywest5/colbywest.dev.git
cd colbywest.dev
```

## 3. Launch the Application
We've set up `docker-compose` to handle the build and ensure the app runs forever (`restart: always`).

```bash
# Make the deploy script executable
chmod +x deploy.sh

# Run it!
./deploy.sh
```

The application will now be running on port **3000**.
If you need to access it on port 80 (HTTP), you can either:
1.  Update `docker-compose.yml` ports to `"80:3000"` **OR**
2.  Use a reverse proxy like Nginx or Caddy (Recommended).

## 4. Updates
To deploy updates in the future, just run:
```bash
./deploy.sh
```
This script handles pulling the code, rebuilding the image, and restarting the container efficiently.
