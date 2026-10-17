# Sanna Khan — Cloud & DevOps Engineer Portfolio

A modern, highly animated, and responsive portfolio website designed for **Sanna Khan**, showcasing experience as an Amazon Cloud & DevOps Intern, BCA candidate, and certified AWS/DevOps practitioner.

---

## ✨ Features & Highlights

- **Visual Excellence & Cyber Cloud Aesthetic**:
  - Deep obsidian dark theme with futuristic neon cyan, electric blue, and AWS amber accents.
  - Interactive Light / Dark mode toggle with persistent state.
  - Dynamic HTML5 Canvas background simulating VPC node networks and packet transfers with mouse interaction.
  - Custom Web Audio API synthesizer for tactile sci-fi sound effects (toggleable).
  - 3D perspective tilt card with Sanna Khan's portrait avatar and floating technology badges (AWS, Terraform, Docker, Linux).

- **Spotlight on Amazon Experience**:
  - Detailed breakdown of responsibilities and achievements during the Cloud and DevOps internship at Amazon (Jan 2026 – June 2026).
  - Provisioning AWS services (EC2, S3, VPC, ALB, IAM, CloudWatch).
  - Automated CI/CD pipelines & Docker containerization.
  - Terraform Infrastructure as Code (IaC) scripting and Linux server administration.

- **Interactive Cloud & DevOps Architecture Lab**:
  - **AWS High-Availability VPC Visualizer**: Clickable interactive diagram covering Route 53, Application Load Balancer, EC2 Auto Scaling instances across Multi-AZ (ap-south-1a & 1b), S3, and RDS Multi-AZ. Clicking any node inspects real specs, security parameters, and configuration notes.
  - **Traffic Surge Simulator**: Dynamically tests Auto Scaling responsiveness.
  - **Automated CI/CD Pipeline Simulator**: Simulates Git push -> Lint/Test -> Docker build -> Terraform IaC -> Live AWS deployment with live streaming logs.
  - **Linux Server Health Dashboard**: Live-updating CPU/Memory load meters, system uptime, and managed service status (`nginx`, `docker`, `sshd`, `cloudwatch-agent`) with interactive restart buttons.

- **Developer & Cloud Bash CLI Terminal**:
  - Interactive web terminal (`sanna@cloud-ops:~$`).
  - Supports typing or clicking shortcut chips for `help`, `whoami`, `experience`, `aws services`, `terraform plan`, `docker ps`, `certifications`, `education`, `contact`, and `cat resume.txt`.
  - Realistic bash command parser with command history (up/down arrow keys).

- **Comprehensive Skills Matrix**:
  - Filterable by *Cloud Computing (AWS)*, *DevOps & Server*, *Linux Administration*, *Networking & OS*, and *Troubleshooting*.
  - Visual mastery percentage indicators and specific tools/protocols.

- **Credentials & Academics**:
  - Holographic cards for the **Jetking Diploma in Cloud Computing with AI (JK-CCCE)** and **Fluxti Technologies Cloud & DevOps Training**.
  - Academic qualification pathway for **BCA (2nd Year, 2025–2028)**, Class 12th, and Class 10th.

- **Formal Resume & Connect**:
  - Interactive "Preview Resume" modal with a clean, print-ready formal CV layout.
  - Print / Save as PDF support with `@media print` styling.
  - Direct email, phone, location links, one-click email copier with toast notification, and contact message form.

---

## 🚀 How to Run Locally

You can open `index.html` directly in any web browser, or run a local web server:

### Option 1: Python HTTP Server (Built-in)
```bash
python -m http.server 8080
```
Then visit: [http://localhost:8080](http://localhost:8080)

### Option 2: Live Server (VS Code Extension)
Right click `index.html` and select **"Open with Live Server"**.

---

## 🌐 Deploy to GitHub Pages / Vercel / Netlify

1. **GitHub Pages**:
   - Push this directory to a GitHub repository named `portfolio` or `<username>.github.io`.
   - Go to **Settings > Pages** and select the branch `main` with root `/`.
2. **Vercel / Netlify**:
   - Import the repository and deploy with zero configuration!

---

## 📁 File Structure

```
Portfolio/
├── index.html        # Main semantic HTML5 document
├── style.css         # Complete CSS3 styles, glassmorphism, animations & print layout
├── app.js            # Interactive logic, audio synth, CLI terminal, architecture lab
├── assets/
│   └── avatar.jpg    # Portrait avatar in server room aesthetic
└── README.md         # Documentation & guide
```
