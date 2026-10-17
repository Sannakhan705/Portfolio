/**
 * SANNA KHAN - CLOUD & DEVOPS ENGINEER PORTFOLIO
 * Main Interactive Application Logic
 */

(function () {
  'use strict';

  // State Management
  const state = {
    theme: localStorage.getItem('sanna_theme') || 'dark',
    soundEnabled: localStorage.getItem('sanna_sound') === 'true',
    audioCtx: null,
    cliHistory: [],
    cliHistoryIndex: -1,
    pipelineRunning: false,
  };

  // =========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (Sci-Fi Micro-Sounds)
  // =========================================================================
  function initAudio() {
    if (!state.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioCtx();
    }
  }

  function playTone(freq = 600, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      const osc = state.audioCtx.createOscillator();
      const gainNode = state.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
      gainNode.gain.setValueAtTime(gainVal, state.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(state.audioCtx.destination);

      osc.start();
      osc.stop(state.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio feedback suppressed:', e);
    }
  }

  function playSuccessChord() {
    if (!state.soundEnabled) return;
    setTimeout(() => playTone(523.25, 'sine', 0.1, 0.04), 0);
    setTimeout(() => playTone(659.25, 'sine', 0.1, 0.04), 60);
    setTimeout(() => playTone(783.99, 'sine', 0.15, 0.05), 120);
  }

  // =========================================================================
  // 2. CLOUD NETWORK CANVAS SIMULATION (VPC Interconnect Nodes)
  // =========================================================================
  function initCloudCanvas() {
    const canvas = document.getElementById('cloud-network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 75;
    const maxDistance = 140;
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254,' : 'rgba(255, 153, 0,';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse avoidance / pull
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 0.8;
            this.y -= Math.sin(angle) * 0.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect adjacent nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // =========================================================================
  // 3. TYPEWRITER EFFECT
  // =========================================================================
  function initTypewriter() {
    const textElement = document.getElementById('typingText');
    if (!textElement) return;

    const phrases = [
      'Cloud & DevOps Engineer',
      'Amazon Cloud & DevOps Intern',
      'Architecting Scalable AWS Infrastructure',
      'Automating with Terraform (IaC) & Docker',
      'Linux Server Administration & Hardening',
      'Continuous Integration & Delivery (CI/CD)',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function tick() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 70;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2200; // Pause at end of phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Pause before typing new phrase
      }

      setTimeout(tick, typingSpeed);
    }

    tick();
  }

  // =========================================================================
  // 4. 3D TILT EFFECT FOR HERO CARD
  // =========================================================================
  function initHeroTilt() {
    const cardWrapper = document.getElementById('heroTiltCard');
    if (!cardWrapper) return;
    const card = cardWrapper.querySelector('.visual-card');

    cardWrapper.addEventListener('mousemove', (e) => {
      const rect = cardWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    cardWrapper.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // =========================================================================
  // 5. THEME & SOUND TOGGLE
  // =========================================================================
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sanna_theme', theme);

    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    if (sunIcon && moonIcon) {
      if (theme === 'light') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      }
    }
  }

  function initThemeAndSound() {
    applyTheme(state.theme);

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        playTone(700, 'sine', 0.05);
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        showToast(`Theme switched to ${newTheme.toUpperCase()}`);
      });
    }

    const soundBtn = document.getElementById('soundToggle');
    const soundOnIcon = document.querySelector('.sound-on-icon');
    const soundOffIcon = document.querySelector('.sound-off-icon');

    function updateSoundIcons() {
      if (soundOnIcon && soundOffIcon) {
        if (state.soundEnabled) {
          soundOnIcon.classList.remove('hidden');
          soundOffIcon.classList.add('hidden');
        } else {
          soundOnIcon.classList.add('hidden');
          soundOffIcon.classList.remove('hidden');
        }
      }
    }
    updateSoundIcons();

    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        localStorage.setItem('sanna_sound', state.soundEnabled);
        updateSoundIcons();
        if (state.soundEnabled) {
          initAudio();
          playTone(880, 'sine', 0.1);
          showToast('Synthesizer audio feedback enabled 🔊');
        } else {
          showToast('Audio feedback muted 🔇');
        }
      });
    }
  }

  // =========================================================================
  // 6. NAVBAR SCROLL & MOBILE MENU
  // =========================================================================
  function initNav() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Active Section Spy
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });

    if (hamburger && navMenu) {
      const overlay = document.getElementById('navOverlay');

      function openMenu() {
        navMenu.classList.add('mobile-open');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scroll behind menu
      }

      function closeMenu() {
        navMenu.classList.remove('mobile-open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      hamburger.addEventListener('click', () => {
        playTone(480, 'triangle', 0.05);
        const isOpen = navMenu.classList.contains('mobile-open');
        isOpen ? closeMenu() : openMenu();
      });

      // Close on overlay click
      if (overlay) {
        overlay.addEventListener('click', closeMenu);
      }

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
          closeMenu();
        }
      });

      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeMenu();
        });
      });
    }

    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        playTone(720, 'sine', 0.08);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // =========================================================================
  // 7. INTERACTIVE ARCHITECTURE LAB (AWS, CI/CD, LINUX)
  // =========================================================================
  const nodeDatabase = {
    client: {
      category: 'Public Ingress',
      title: 'Global Web Users',
      desc: 'External end-users sending HTTP/HTTPS requests worldwide via browser or mobile endpoints.',
      specs: [
        { key: 'Protocols', val: 'HTTPS (TLS 1.3), HTTP/2' },
        { key: 'Latency Targets', val: '< 60ms globally' },
        { key: 'Ingress Rate', val: 'Up to 25,000 req/sec' },
      ],
    },
    route53: {
      category: 'AWS Networking & DNS',
      title: 'Amazon Route 53',
      desc: 'Highly available, low-latency authoritative Domain Name System (DNS) web service.',
      specs: [
        { key: 'Routing Policy', val: 'Latency-based + Failover' },
        { key: 'Health Check', val: 'Interval: 10s, Failure: 3' },
        { key: 'Record Sets', val: 'A / CNAME / ALIAS to ALB' },
        { key: 'SLA', val: '100% Availability Commitment' },
      ],
    },
    alb: {
      category: 'Load Balancing',
      title: 'Application Load Balancer (ALB)',
      desc: 'Distributes incoming traffic across EC2 container targets across multiple Availability Zones.',
      specs: [
        { key: 'Scheme', val: 'Internet-facing Dualstack' },
        { key: 'Listeners', val: 'Port 443 (HTTPS), Port 80 (Redirect)' },
        { key: 'SSL Certificate', val: 'AWS Certificate Manager (ACM)' },
        { key: 'Target Groups', val: 'TG-Production-Web (HTTP:8080)' },
      ],
    },
    'ec2-a': {
      category: 'Compute Tier (AZ-A)',
      title: 'EC2 Instance • ap-south-1a',
      desc: 'Dockerized microservice node managed by an Auto Scaling Group in Availability Zone A.',
      specs: [
        { key: 'AMI', val: 'Amazon Linux 2023 (Hardened)' },
        { key: 'Instance Type', val: 't3.medium (2 vCPU, 4GB RAM)' },
        { key: 'Security Group', val: 'sg-app-inbound (ALB port only)' },
        { key: 'Runtime', val: 'Docker Daemon + Nginx Reverse Proxy' },
      ],
    },
    'ec2-b': {
      category: 'Compute Tier (AZ-B)',
      title: 'EC2 Instance • ap-south-1b',
      desc: 'High-availability paired node in secondary Availability Zone B, ensuring zero downtime.',
      specs: [
        { key: 'AMI', val: 'Amazon Linux 2023 (Hardened)' },
        { key: 'Instance Type', val: 't3.medium (2 vCPU, 4GB RAM)' },
        { key: 'Auto Scaling', val: 'Min: 2 | Desired: 2 | Max: 8' },
        { key: 'Health Check', val: 'EC2 + ELB Status Checked' },
      ],
    },
    s3: {
      category: 'Storage Tier',
      title: 'Amazon Simple Storage Service (S3)',
      desc: 'Scalable object store for static assets, build artifacts, server backups, and CloudWatch logs.',
      specs: [
        { key: 'Encryption', val: 'SSE-KMS (AWS Managed Key)' },
        { key: 'Versioning', val: 'Enabled + Lifecycle Rule (Glacier @ 90d)' },
        { key: 'Access Control', val: 'Block Public Access + IAM Policy' },
        { key: 'Durability', val: '99.999999999% (11 9s)' },
      ],
    },
    rds: {
      category: 'Database Tier',
      title: 'Amazon RDS Multi-AZ PostgreSQL',
      desc: 'Fully managed relational database with synchronous standby replication in secondary AZ.',
      specs: [
        { key: 'Engine', val: 'PostgreSQL 16.2 Multi-AZ' },
        { key: 'Storage', val: '100GB gp3 (Provisioned IOPS 3000)' },
        { key: 'Subnet Group', val: 'Private Isolated DB Subnets' },
        { key: 'Backup Window', val: 'Automated 7-day retention + Snapshots' },
      ],
    },
  };

  function initArchitectureLab() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.lab-tab-btn');
    const tabPanels = document.querySelectorAll('.lab-tab-content');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        playTone(550, 'sine', 0.05);
        const target = btn.getAttribute('data-tab');

        tabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const activePanel = document.getElementById(`tab-${target}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });

    // Architecture Node Inspector
    const archNodes = document.querySelectorAll('.arch-node');
    const categoryEl = document.getElementById('inspectorCategory');
    const titleEl = document.getElementById('inspectorTitle');
    const bodyEl = document.getElementById('inspectorBody');

    archNodes.forEach((node) => {
      node.addEventListener('click', () => {
        playTone(620, 'sine', 0.06);
        const nodeKey = node.getAttribute('data-node');
        const data = nodeDatabase[nodeKey];

        archNodes.forEach((n) => n.classList.remove('active-node'));
        node.classList.add('active-node');

        if (data && categoryEl && titleEl && bodyEl) {
          categoryEl.textContent = data.category;
          titleEl.textContent = data.title;

          let specsHtml = data.specs
            .map((s) => `<div class="spec-row"><span class="spec-key">${s.key}:</span><span class="spec-val">${s.val}</span></div>`)
            .join('');

          bodyEl.innerHTML = `
            <p style="margin-bottom: 1rem; color: var(--text-secondary);">${data.desc}</p>
            <div style="background: rgba(0,0,0,0.3); padding: 0.85rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
              ${specsHtml}
            </div>
            <p style="margin-top: 0.85rem; font-size: 0.78rem; color: var(--accent-cyan); font-family: var(--font-mono);">
              Configured via Terraform IaC & monitored by Amazon CloudWatch
            </p>
          `;
        }
      });
    });

    // Simulate Traffic Surge
    const surgeBtn = document.getElementById('simulateTrafficBtn');
    const resetBtn = document.getElementById('resetArchBtn');
    if (surgeBtn) {
      surgeBtn.addEventListener('click', () => {
        playTone(850, 'sawtooth', 0.1, 0.03);
        const packets = document.querySelectorAll('.arrow-packet');
        packets.forEach((p) => {
          p.style.animationDuration = '0.7s';
        });
        showToast('Traffic surge triggered: Auto Scaling group scaling EC2 targets ⚡');
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        playTone(400, 'sine', 0.06);
        const packets = document.querySelectorAll('.arrow-packet');
        packets.forEach((p) => {
          p.style.animationDuration = '2s';
        });
        archNodes.forEach((n) => n.classList.remove('active-node'));
        if (categoryEl && titleEl && bodyEl) {
          categoryEl.textContent = 'AWS Service';
          titleEl.textContent = 'Select a component';
          bodyEl.innerHTML = '<p class="placeholder-tip">Click on Route 53, ALB, EC2, S3, or RDS in the diagram to inspect its configuration parameters, security settings, and how Sanna configures it.</p>';
        }
        showToast('Architecture nodes reset to baseline');
      });
    }

    // CI/CD Simulation Pipeline
    initPipelineRunner();

    // Linux Dashboard dynamic jitter
    initLinuxMonitor();
  }

  // CI/CD Runner
  function initPipelineRunner() {
    const runBtn = document.getElementById('runPipelineBtn');
    const logEl = document.getElementById('pipelineLog');
    if (!runBtn || !logEl) return;

    const steps = [
      { id: 'git', name: 'Git Commit', log: 'git commit -m "feat(vpc): harden security groups & ALB listeners"' },
      { id: 'test', name: 'Lint & Test', log: 'Running flake8, tfsec security scan & pytest suite: 42 passed in 1.4s' },
      { id: 'docker', name: 'Docker Build', log: 'docker build -t 123456789.dkr.ecr.ap-south-1.amazonaws.com/app:v2.6 . [BUILD SUCCESS]' },
      { id: 'terraform', name: 'Terraform IaC', log: 'terraform apply -auto-approve: 2 added, 1 changed, 0 destroyed' },
      { id: 'deploy', name: 'Live on AWS', log: 'ALB target health check: HTTP 200 OK. Deployment complete zero-downtime!' },
    ];

    runBtn.addEventListener('click', () => {
      if (state.pipelineRunning) return;
      state.pipelineRunning = true;
      runBtn.disabled = true;
      runBtn.style.opacity = '0.6';
      logEl.innerHTML = '';

      function appendLog(text, type = 'info') {
        const p = document.createElement('p');
        p.className = `log-line log-${type}`;
        p.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        logEl.appendChild(p);
        logEl.scrollTop = logEl.scrollHeight;
      }

      appendLog('Pipeline initiated by Sanna Khan on branch main...', 'info');
      playTone(500, 'sine', 0.08);

      let currentStep = 0;

      function executeNextStep() {
        if (currentStep >= steps.length) {
          appendLog('🎉 ALL PIPELINE STAGES COMPLETED SUCCESSFULLY (Zero-Downtime Live)', 'success');
          playSuccessChord();
          showToast('Deployment finished successfully on AWS infrastructure!');
          state.pipelineRunning = false;
          runBtn.disabled = false;
          runBtn.style.opacity = '1';
          return;
        }

        const stepObj = steps[currentStep];
        const stepEl = document.getElementById(`step-${stepObj.id}`);
        const statusEl = document.getElementById(`status-${stepObj.id}`);
        const connector = document.getElementById(`line-${currentStep}`);

        if (stepEl) {
          stepEl.classList.add('active');
          if (statusEl) statusEl.textContent = 'Running...';
        }
        if (connector) {
          connector.style.width = '100%';
        }

        appendLog(stepObj.log, 'info');
        playTone(600 + currentStep * 80, 'sine', 0.08);

        setTimeout(() => {
          if (stepEl) {
            stepEl.classList.remove('active');
            stepEl.classList.add('success');
            if (statusEl) statusEl.textContent = 'Passed ✓';
          }
          currentStep++;
          executeNextStep();
        }, 1100);
      }

      executeNextStep();
    });
  }

  // Linux Monitor Jitter
  function initLinuxMonitor() {
    const cpuVal = document.getElementById('cpuVal');
    const cpuFill = document.getElementById('cpuFill');
    const memVal = document.getElementById('memVal');
    const memFill = document.getElementById('memFill');

    setInterval(() => {
      if (!cpuVal || !cpuFill) return;
      const cpu = Math.floor(Math.random() * 15) + 12; // 12% - 27%
      cpuVal.textContent = `${cpu}%`;
      cpuFill.style.width = `${cpu}%`;

      const memGb = (2.2 + Math.random() * 0.35).toFixed(2);
      const memPct = ((memGb / 8) * 100).toFixed(1);
      if (memVal && memFill) {
        memVal.textContent = `${memGb} GB`;
        memFill.style.width = `${memPct}%`;
      }
    }, 3500);
  }

  // =========================================================================
  // 8. TECHNICAL SKILLS FILTERING
  // =========================================================================
  function initSkillsFilter() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const skillCards = document.querySelectorAll('.skill-category-card');

    filterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        playTone(600, 'sine', 0.05);
        const filter = chip.getAttribute('data-filter');

        filterChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');

        skillCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // =========================================================================
  // 9. INTERACTIVE DEVELOPER CLI TERMINAL
  // =========================================================================
  function initTerminal() {
    const cliInput = document.getElementById('cliInput');
    const cliHistory = document.getElementById('cliHistory');
    const cliScreen = document.getElementById('cliScreen');
    if (!cliInput || !cliHistory) return;

    const commands = {
      help: () => `
Available Commands:
  • <span class="text-cyan">whoami</span>            - View Sanna's role and objective
  • <span class="text-cyan">experience</span>        - Amazon Internship details & contributions
  • <span class="text-cyan">projects</span>          - Featured Cloud & DevOps projects
  • <span class="text-cyan">aws services</span>      - List mastered AWS cloud infrastructure
  • <span class="text-cyan">terraform plan</span>    - Simulate declarative IaC configuration
  • <span class="text-cyan">docker ps</span>         - Inspect simulated container workloads
  • <span class="text-cyan">certifications</span>    - Jetking Diploma & Fluxti qualifications
  • <span class="text-cyan">education</span>         - BCA & academic qualifications
  • <span class="text-cyan">contact</span>           - Email, phone, location & connect links
  • <span class="text-cyan">cat resume.txt</span>    - Open full print-ready resume summary
  • <span class="text-cyan">clear</span>             - Clear the terminal console
      `,
      projects: () => `
<strong class="text-cyan">Featured Cloud & DevOps Projects:</strong>
1. <span class="text-amber">Automated Multi-AZ AWS Infrastructure with Terraform</span>
   Modular IaC provisioning VPC, ALB, Auto Scaling & Multi-AZ RDS.
2. <span class="text-cyan">Microservices Containerization & Nginx Blue/Green Deployments</span>
   Multi-stage Docker builds & zero-downtime reverse proxy switching.
3. <span class="text-purple">Enterprise Linux Hardening & Automated S3 Backup Suite</span>
   Systemd timers, GPG AES-256 encryption & S3 Glacier lifecycle sync.
4. <span class="text-green">CloudWatch Telemetry & SNS Incident Alerting Pipeline</span>
   Sub-minute SLA alert triggers with automated scaling integration.
Click 'Inspect Architecture & Code' on any card in the Projects section to view live code.
      `,
      whoami: () => `
<strong class="text-cyan">Sanna Khan</strong>
Role: Aspiring Cloud Engineer & DevOps Specialist
Background: BCA (2nd Year | 2025-2028), Amazon Cloud & DevOps Intern
Mission: Seeking an entry-level opportunity to design resilient cloud architectures, automate deployments, and optimize Linux enterprise systems.
      `,
      experience: () => `
<strong class="text-amber">Amazon (Jan 2026 – June 2026) • Cloud and DevOps Intern</strong>
✓ Provisioned, configured & managed AWS cloud components (EC2, S3, IAM, VPC, ALB, CloudWatch).
✓ Automated containerized microservice builds with Docker and CI/CD pipelines.
✓ Authored Terraform scripts for Infrastructure as Code (IaC) deployment.
✓ Performed routine Linux server administration, user permissions & system troubleshooting.
      `,
      'aws services': () => `
<strong class="text-cyan">AWS Cloud Services Mastered:</strong>
[Compute]      • EC2, Auto Scaling Groups, Launch Templates
[Storage]      • S3 (Bucket policies, Lifecycle), EBS Volumes & Snapshots
[Networking]   • VPC, Public/Private Subnets, Route Tables, IGW, NAT, ALB, Route 53
[Security]     • IAM Roles, Least-Privilege Policies, Security Groups, NACLs
[Database]     • Amazon RDS Multi-AZ, Automated Snapshots
[Monitoring]   • Amazon CloudWatch Metrics, Alarms, Logs
      `,
      'terraform plan': () => `
<span class="text-cyan">Terraform v1.7.5</span>
Refreshing state... [aws_vpc.prod, aws_alb.web, aws_autoscaling_group.app]

Terraform will perform the following actions:
  <span class="text-green">+ aws_instance.web_node</span>
      id:            (known after apply)
      ami:           "ami-0c55b159cbfafe1f0"
      instance_type: "t3.medium"
      vpc_security_group_ids: ["sg-0a8b9c1d2e3f"]

Plan: 1 to add, 0 to change, 0 to destroy.
<span class="text-green">Apply complete! Resources: 1 added, 0 changed, 0 destroyed.</span>
      `,
      'docker ps': () => `
CONTAINER ID   IMAGE                 COMMAND                  STATUS         PORTS
a1b2c3d4e5f6   nginx:alpine          "/docker-entrypoint.…"   Up 42 days     0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
b2c3d4e5f6a1   api-service:v2.6      "node server.js"         Up 14 hours    0.0.0.0:8080->8080/tcp
c3d4e5f6a1b2   amazon/cloudwatch     "/bin/amazon-cloudw…"    Up 42 days     0.0.0.0:8125->8125/udp
      `,
      certifications: () => `
<strong class="text-cyan">1. Jetking Diploma in Cloud Computing with AI (JK-CCCE)</strong> (2026)
   Issuer: Jetking, Noida New Learning Centre
<strong class="text-amber">2. Cloud & DevOps Professional Training</strong> (2026)
   Issuer: Fluxti Technologies (AWS, Linux, Terraform, DevOps Tools)
      `,
      education: () => `
• <strong class="text-cyan">2025–2028:</strong> Pursuing BCA (2nd Year) | Patna, Bihar
• <strong class="text-cyan">2025:</strong> Completed Class 12th from Bihar Board
• <strong class="text-cyan">2023:</strong> Completed Class 10th from Bihar Board
      `,
      contact: () => `
• Email:    <a href="mailto:sannak9411@gmail.com" class="text-cyan">sannak9411@gmail.com</a>
• Phone:    <a href="tel:+918509356031" class="text-green">+91 8509356031</a>
• Location: South Delhi East Jhori Farm Jamia Nagar, New Delhi 110025
• Hometown: Motihari East Champaran, Bihar 845417
      `,
      'cat resume.txt': () => {
        window.app.openResumeModal();
        return 'Opening Resume Modal view...';
      },
      clear: () => {
        cliHistory.innerHTML = '';
        return '';
      },
      sudo: () => '🔒 sudo: Access granted! "With great power comes high availability."',
    };

    function processCommand(rawInput) {
      const input = rawInput.trim().toLowerCase();
      if (!input) return;

      playTone(650, 'triangle', 0.04);

      // Print prompt echo
      const cmdLine = document.createElement('div');
      cmdLine.className = 'cli-line user-cmd';
      cmdLine.innerHTML = `<span class="cli-prompt-user">sanna@cloud-ops</span>:<span class="cli-prompt-path">~</span>$ <strong>${escapeHtml(rawInput)}</strong>`;
      cliHistory.appendChild(cmdLine);

      // Save to history
      state.cliHistory.push(rawInput);
      state.cliHistoryIndex = state.cliHistory.length;

      // Handle command execution
      let output = '';
      if (commands[input]) {
        output = commands[input]();
      } else if (input.startsWith('ping ')) {
        const target = input.replace('ping ', '').trim();
        output = `
PING ${target} (54.239.28.85): 56 data bytes
64 bytes from 54.239.28.85: icmp_seq=0 ttl=118 time=14.2 ms
64 bytes from 54.239.28.85: icmp_seq=1 ttl=118 time=13.8 ms
--- ${target} ping statistics ---
2 packets transmitted, 2 packets received, 0.0% packet loss
        `;
      } else {
        output = `<span class="text-amber">bash: command not found: ${escapeHtml(input)}</span>. Type <span class="text-cyan">'help'</span> for a list of available commands.`;
      }

      if (output) {
        const outLine = document.createElement('div');
        outLine.className = 'cli-line output';
        outLine.innerHTML = output;
        cliHistory.appendChild(outLine);
      }

      if (cliScreen) {
        cliScreen.scrollTop = cliScreen.scrollHeight;
      }
    }

    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        processCommand(cliInput.value);
        cliInput.value = '';
      } else if (e.key === 'ArrowUp') {
        if (state.cliHistoryIndex > 0) {
          state.cliHistoryIndex--;
          cliInput.value = state.cliHistory[state.cliHistoryIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (state.cliHistoryIndex < state.cliHistory.length - 1) {
          state.cliHistoryIndex++;
          cliInput.value = state.cliHistory[state.cliHistoryIndex] || '';
        } else {
          state.cliHistoryIndex = state.cliHistory.length;
          cliInput.value = '';
        }
      }
    });

    window.app = window.app || {};
    window.app.runCommandFromChip = (cmd) => {
      cliInput.value = cmd;
      processCommand(cmd);
      cliInput.value = '';
      cliInput.focus();
    };

    window.app.clearTerminal = () => {
      cliHistory.innerHTML = `
        <div class="cli-line text-cyan font-bold">
          Terminal cleared. Type 'help' for instructions.
        </div>
      `;
      playTone(400, 'sine', 0.05);
    };
  }

  // =========================================================================
  // 10B. PROJECT ARCHITECTURE & CODE MODAL
  // =========================================================================
  const projectDetails = {
    'proj-terraform': {
      title: 'Automated Multi-AZ AWS Infrastructure with Terraform',
      badge: 'Terraform IaC • AWS',
      overview: 'Modular declarative Infrastructure as Code enabling automated multi-region spin-up, zero manual configuration drift, and target-tracking auto-scaling across isolated public/private VPC subnets.',
      architecture: [
        'VPC (10.0.0.0/16) partitioned into 2 Public Subnets & 2 Private Isolated DB Subnets.',
        'Internet Gateway (IGW) + NAT Gateway with Elastic IP for secure outbound private subnet routing.',
        'Application Load Balancer (ALB) with SSL certificate via ACM, forwarding to EC2 Auto Scaling Target Group.',
        'Amazon RDS PostgreSQL Multi-AZ deployment with automated standby replication and encrypted EBS volumes.',
      ],
      codeLang: 'Terraform (main.tf)',
      code: `# Multi-AZ VPC & Auto Scaling Infrastructure Module
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "sanna-terraform-state-prod"
    key            = "prod/vpc/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = "Production"
      ManagedBy   = "Terraform"
      Owner       = "Sanna Khan"
    }
  }
}

# Auto Scaling Group with Target Tracking Policy
resource "aws_autoscaling_group" "app_asg" {
  name_prefix         = "asg-prod-web-"
  vpc_zone_identifier = module.vpc.private_subnets
  min_size            = 2
  max_size            = 8
  desired_capacity    = 2
  target_group_arns   = [aws_lb_target_group.app_tg.arn]

  launch_template {
    id      = aws_launch_template.app_template.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "prod-web-worker"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_policy" "cpu_policy" {
  name                   = "cpu-target-tracking"
  autoscaling_group_name = aws_autoscaling_group.app_asg.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 65.0
  }
}`
    },
    'proj-docker': {
      title: 'Microservices Containerization & Blue/Green Nginx Deployments',
      badge: 'Docker • Nginx • Blue/Green',
      overview: 'Production Dockerization pipeline utilizing multi-stage builds to produce stripped-down, secure container images running under non-root users, reverse proxied by an optimized Nginx gateway with zero-downtime blue/green switches.',
      architecture: [
        'Multi-stage build reducing image footprints from 850MB to under 85MB.',
        'Nginx upstream routing configuration with health check failovers.',
        'Automated blue/green deployment bash controller executing smooth connection draining.',
      ],
      codeLang: 'Dockerfile & nginx.conf',
      code: `# Multi-Stage Production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Hardened Runtime Container
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

USER nodejs
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \\
  CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["node", "dist/server.js"]

# -----------------------------------------------------------------
# Nginx Upstream Blue/Green Configuration (nginx.conf)
# -----------------------------------------------------------------
upstream backend_cluster {
    # Active Deployment Slot (switched dynamically via reload)
    server app_blue:8080 max_fails=3 fail_timeout=10s;
    # server app_green:8080 backup;
}

server {
    listen 80;
    server_name sanna-cloud.internal;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sanna-cloud.internal;

    ssl_certificate /etc/ssl/certs/cloud.crt;
    ssl_certificate_key /etc/ssl/private/cloud.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://backend_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }
}`
    },
    'proj-linux': {
      title: 'Enterprise Linux Server Hardening & Automated S3 Backup Suite',
      badge: 'Linux SysAdmin • Bash • AWS S3',
      overview: 'Comprehensive Linux server administration automation suite delivering cryptographic offsite data preservation, automated user audit checks, and kernel sysctl hardening.',
      architecture: [
        'Systemd timer scheduled daily backup execution independent of traditional cron limitations.',
        'Encrypted archives streamed directly to Amazon S3 with SSE-KMS and lifecycle rules.',
        'Automated log rotation, permission audits (chmod 600 /etc/shadow), and fail2ban rules.',
      ],
      codeLang: 'Bash Automation (backup_to_s3.sh)',
      code: `#!/usr/bin/env bash
# =================================================================
# Automated Linux Database Backup & GPG Encrypted S3 Sync Suite
# Author: Sanna Khan (Cloud & DevOps Engineer)
# =================================================================
set -euo pipefail

BACKUP_DIR="/var/backups/databases"
DATE=$(date +'%Y-%m-%d_%H%M%S')
S3_BUCKET="s3://sanna-enterprise-backups-secure/production"
GPG_RECIPIENT="ops-sanna@cloud.org"
LOG_FILE="/var/log/backup_suite.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] \$1" | tee -a "$LOG_FILE"
}

mkdir -p "$BACKUP_DIR"
log "Starting automated backup workflow for host: $(hostname)..."

# 1. Dump database snapshot
ARCHIVE_NAME="prod_db_\${DATE}.sql.gz"
pg_dump -U postgres -h localhost -d prod_app | gzip -9 > "\${BACKUP_DIR}/\${ARCHIVE_NAME}"
log "Database dump created: \${ARCHIVE_NAME} (\$(du -h "\${BACKUP_DIR}/\${ARCHIVE_NAME}" | cut -f1))"

# 2. Encrypt archive with GPG (AES-256)
ENCRYPTED_FILE="\${ARCHIVE_NAME}.gpg"
gpg --batch --yes --trust-model always --encrypt --recipient "$GPG_RECIPIENT" \\
  --output "\${BACKUP_DIR}/\${ENCRYPTED_FILE}" "\${BACKUP_DIR}/\${ARCHIVE_NAME}"
rm -f "\${BACKUP_DIR}/\${ARCHIVE_NAME}"
log "Payload encrypted successfully with GPG (AES-256)."

# 3. Synchronize to AWS S3 with KMS encryption
log "Uploading payload to \${S3_BUCKET}..."
aws s3 cp "\${BACKUP_DIR}/\${ENCRYPTED_FILE}" "\${S3_BUCKET}/\${ENCRYPTED_FILE}" \\
  --sse aws:kms --storage-class STANDARD_IA

# 4. Prune local archives older than 7 days
find "$BACKUP_DIR" -type f -name "*.gpg" -mtime +7 -delete
log "Local backup rotation complete. Backup successfully synchronized to AWS S3."`
    },
    'proj-monitor': {
      title: 'Centralized AWS CloudWatch Monitoring & Incident Alerting Pipeline',
      badge: 'CloudWatch • SNS • Alerting',
      overview: 'Telemetry aggregation architecture collecting sub-minute operating system metrics (disk I/O, packet errors, swap usage) routed through CloudWatch composite alarms and AWS SNS for rapid incident remediation.',
      architecture: [
        'Amazon CloudWatch Agent daemon running across all EC2 Linux compute nodes.',
        'Composite Alarms combining High CPU (>80% for 3 periods) AND ALB HTTP 5xx errors.',
        'Multi-endpoint SNS dispatch sending immediate email/SMS notifications and triggering Auto Scaling scale-out.',
      ],
      codeLang: 'amazon-cloudwatch-agent.json',
      code: `{
  "agent": {
    "metrics_collection_interval": 30,
    "run_as_user": "cwagent"
  },
  "metrics": {
    "namespace": "Production/LinuxServers",
    "metrics_collected": {
      "cpu": {
        "measurement": ["cpu_usage_idle", "cpu_usage_iowait", "cpu_usage_system", "cpu_usage_user"],
        "metrics_collection_interval": 30,
        "totalcpu": true
      },
      "disk": {
        "measurement": ["used_percent", "inodes_free"],
        "metrics_collection_interval": 60,
        "resources": ["/"]
      },
      "mem": {
        "measurement": ["mem_used_percent", "mem_available", "swap_used_percent"],
        "metrics_collection_interval": 30
      },
      "netstat": {
        "measurement": ["tcp_established", "tcp_time_wait"],
        "metrics_collection_interval": 30
      }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/nginx/access.log",
            "log_group_name": "/aws/ec2/prod/nginx/access",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 30
          },
          {
            "file_path": "/var/log/nginx/error.log",
            "log_group_name": "/aws/ec2/prod/nginx/error",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 60
          }
        ]
      }
    }
  }
}`
    }
  };

  function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('closeProjModalBtn');
    const titleEl = document.getElementById('projModalTitle');
    const badgeEl = document.getElementById('projModalBadge');
    const contentEl = document.getElementById('projModalContent');

    function openProjectModal(projId) {
      const data = projectDetails[projId];
      if (!data) return;

      playTone(650, 'sine', 0.06);

      if (titleEl) titleEl.textContent = data.title;
      if (badgeEl) badgeEl.textContent = data.badge;

      if (contentEl) {
        const archListHtml = data.architecture
          .map((item) => `<li><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>${escapeHtml(item)}</span></li>`)
          .join('');

        contentEl.innerHTML = `
          <p style="font-size: 0.98rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.25rem;">
            ${escapeHtml(data.overview)}
          </p>

          <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-main);">
            Key Architecture & Implementation Highlights:
          </h4>
          <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.5rem;">
            ${archListHtml}
          </ul>

          <div class="code-box-container">
            <div class="code-box-header">
              <span>Code Artifact: ${escapeHtml(data.codeLang)}</span>
              <button class="btn btn-tiny" onclick="navigator.clipboard.writeText(document.getElementById('codeBlockArea').textContent); window.app.showToast('Code snippet copied to clipboard! 📋');">Copy Code</button>
            </div>
            <pre class="code-pre" id="codeBlockArea">${escapeHtml(data.code)}</pre>
          </div>
        `;
      }

      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeProjectModal() {
      playTone(450, 'sine', 0.05);
      if (modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProjectModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeProjectModal();
      }
    });

    window.app = window.app || {};
    window.app.openProjectModal = openProjectModal;
  }

  // =========================================================================
  // 10. RESUME MODAL & CONTACT FORM
  // =========================================================================
  function initResumeModal() {
    const modal = document.getElementById('resumeModal');
    const openBtn = document.getElementById('openResumeBtn');
    const heroCvBtn = document.getElementById('downloadCvBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    function openModal() {
      playTone(650, 'sine', 0.06);
      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      playTone(450, 'sine', 0.05);
      if (modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (heroCvBtn) heroCvBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeModal();
      }
    });

    window.app = window.app || {};
    window.app.openResumeModal = openModal;
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      playTone(750, 'sine', 0.08);

      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const subject = document.getElementById('senderSubject').value;
      const message = document.getElementById('senderMessage').value;

      showToast(`Thank you, ${name}! Generating mail client link...`);
      playSuccessChord();

      // Formulate mailto fallback link
      const mailtoUrl = `mailto:sannak9411@gmail.com?subject=${encodeURIComponent(
        `[Portfolio] ${subject}`
      )}&body=${encodeURIComponent(`Hi Sanna,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      form.reset();
    });
  }

  // =========================================================================
  // 11. TOAST NOTIFICATION HELPER
  // =========================================================================
  function showToast(message, duration = 3200) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Public Global Helpers for HTML OnClick
  window.app = window.app || {};
  window.app.showToast = showToast;
  window.app.copyEmail = () => {
    navigator.clipboard.writeText('sannak9411@gmail.com').then(() => {
      playTone(800, 'sine', 0.08);
      showToast('Copied sannak9411@gmail.com to clipboard! 📋');
    });
  };

  window.app.restartService = (service) => {
    playTone(600, 'sawtooth', 0.07);
    showToast(`systemctl restart ${service}.service completed (Active)`);
  };

  // =========================================================================
  // 12. INITIALIZATION ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initCloudCanvas();
    initTypewriter();
    initHeroTilt();
    initThemeAndSound();
    initNav();
    initArchitectureLab();
    initProjectModal();
    initSkillsFilter();
    initTerminal();
    initResumeModal();
    initContactForm();

    console.log(
      '%c SANNA KHAN %c Cloud & DevOps Portfolio Initialized 🚀',
      'background: #00f2fe; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
      'background: #ff9900; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0;'
    );
  });
})();
