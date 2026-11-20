# Local Git Setup and Hostinger Deployment Guide

This guide explains how to push your local code to your remote Git repository (e.g. GitHub) and have changes automatically deploy to Hostinger.

---

### Step 1: Initialize Git and Push to Your Repository

Open PowerShell or your terminal and run:

```powershell
cd "C:\Users\Heema\.gemini\antigravity\scratch\ookhal-musal"

# 1. Initialize git if not already done
git init -b main

# 2. Add files and commit
git add .
git commit -m "Initial commit: Ookhal Musal website with automated deployment workflow"

# 3. Link to your remote GitHub repository (replace with your actual repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git

# 4. Push to GitHub
git push -u origin main
```

---

### Step 2: Choose Your Deployment Method to Hostinger

There are two primary ways to automate deployment to Hostinger:

#### Option A: Hostinger Git Deployment (Built-in Webhook) — *Easiest if supported on your hPanel plan*
1. Log in to **Hostinger hPanel**.
2. Select your hosting plan / domain and search for **Git** under the **Advanced** or **Website** section.
3. In the Git menu:
   - Paste your **Repository URL** (e.g., `https://github.com/username/repo.git`).
   - Select Branch: `main`.
   - Install Directory: `public_html` (or leave default).
   - Click **Create**.
4. Once created, Hostinger will provide a **Webhook URL**.
5. Copy this Webhook URL, go to your GitHub repository:
   - Go to **Settings** > **Webhooks** > **Add webhook**.
   - Paste the Webhook URL into **Payload URL**.
   - Content type: `application/json`.
   - Click **Add webhook**.
6. Every time you run `git push origin main`, Hostinger will automatically pull the changes!

---

#### Option B: GitHub Actions via FTP (Universal for all Hostinger Shared / Cloud Plans)
We have already created the workflow file:
[deploy.yml](file:///C:/Users/Heema/.gemini/antigravity/scratch/ookhal-musal/.github/workflows/deploy.yml)

To activate it:
1. In **Hostinger hPanel**, find your **FTP Accounts**:
   - Note your **FTP Host/IP** (e.g., `ftp.yourdomain.com` or an IP address).
   - Note your **FTP Username**.
   - Set or note your **FTP Password**.
2. Go to your GitHub repository:
   - Navigate to **Settings** > **Secrets and variables** > **Actions**.
   - Click **New repository secret** and add the following 3 secrets:
     - `FTP_SERVER`: Your Hostinger FTP Host (e.g. `ftp.yourdomain.com`).
     - `FTP_USERNAME`: Your FTP account username.
     - `FTP_PASSWORD`: Your FTP account password.
3. Once secrets are added, push any change to `main`.
4. Go to the **Actions** tab on GitHub — you will see your deployment run and sync the files directly to your `public_html/` folder in seconds.
