// 1. นำเข้า SCSS ของโปรเจกต์
import './scss/styles.scss';

// 2. นำเข้า Bootstrap JavaScript ทั้งหมด
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. Bootstrap Tooltips & Popovers
       ========================================================== */
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));

    /* ==========================================================
       2. 🎉 Canvas Confetti Particle Engine (ระบบยิงพลุกระดาษ)
       ========================================================== */
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas?.getContext('2d');
    let confettiParticles = [];
    let animationFrameId = null;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class ConfettiParticle {
        constructor(x, y) {
            this.x = x || canvas.width / 2;
            this.y = y || canvas.height / 2;
            const colors = ['#4361ee', '#2ec4b6', '#ff9f1c', '#e71d36', '#4cc9f0', '#7209b7', '#ffd166'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.radius = Math.random() * 6 + 4;
            this.vx = (Math.random() - 0.5) * 16;
            this.vy = Math.random() * -14 - 4;
            this.gravity = 0.35;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.opacity = 1;
            this.decay = Math.random() * 0.015 + 0.008;
            this.isCircle = Math.random() > 0.5;
        }

        update() {
            this.x += this.vx;
            this.vy += this.gravity;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.opacity -= this.decay;
        }

        draw() {
            if (!ctx) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;

            if (this.isCircle) {
                ctx.beginPath();
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 1.4);
            }
            ctx.restore();
        }
    }

    function fireConfetti(x, y, count = 120) {
        if (!canvas || !ctx) return;
        resizeCanvas();
        for (let i = 0; i < count; i++) {
            confettiParticles.push(new ConfettiParticle(x, y));
        }

        if (!animationFrameId) {
            animateConfetti();
        }
    }

    function animateConfetti() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < canvas.height + 20);

        confettiParticles.forEach(p => {
            p.update();
            p.draw();
        });

        if (confettiParticles.length > 0) {
            animationFrameId = requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animationFrameId = null;
        }
    }

    // จุดพลุเมื่อกดปุ่ม
    document.getElementById('celebrateBtn')?.addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        fireConfetti(rect.left + rect.width / 2, rect.top, 100);
        showToast('🎉 ไชโย! ฉลองความสำเร็จบน Docker Desktop!', 'text-bg-warning text-dark', 'bi-stars');
    });

    document.getElementById('heroConfettiBtn')?.addEventListener('click', (e) => {
        fireConfetti(window.innerWidth / 2, window.innerHeight / 3, 140);
    });

    /* ==========================================================
       3. ⌨️ Typewriter Effect (ตัวหนังสือพิมพ์เองแบบเรียลไทม์)
       ========================================================== */
    const typewriterEl = document.getElementById('typewriterText');
    const words = [
        'Docker Desktop 🐳',
        'Vite Hot Reload ⚡',
        'Bootstrap 5.3 🚀',
        'Interactive JS ✨',
        'Containerized Alpine 📦'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typewriterEl) return;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            charIndex--;
            typingSpeed = 50;
        } else {
            charIndex++;
            typingSpeed = 100;
        }

        typewriterEl.textContent = currentWord.substring(0, charIndex);

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // หยุดรออ่าน 1.5 วินาที
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400; // หยุดก่อนเริ่มพิมพ์คำใหม่
        }

        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();

    /* ==========================================================
       4. ✨ 3D Tilt Effect on Glass Cards (การ์ดเอียง 3 มิติตามเมาส์)
       ========================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    /* ==========================================================
       5. 💧 Button Click Ripple Effect (เอฟเฟกต์คลื่นน้ำกระจายเมื่อกด)
       ========================================================== */
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = button.getBoundingClientRect();
            const circle = document.createElement('span');
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple-circle');

            const existingRipple = button.querySelector('.ripple-circle');
            if (existingRipple) existingRipple.remove();

            button.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    });

    /* ==========================================================
       6. 🧮 Animated Counter Numbers (ตัวเลขนับขึ้นแบบ Smooth)
       ========================================================== */
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1400; // 1.4 วินาที
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic function
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);

            counter.textContent = currentVal;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(updateCounter);
    });

    /* ==========================================================
       7. 🌟 Mouse Spotlight Glow on Hero Section
       ========================================================== */
    const heroSection = document.getElementById('heroSection');
    heroSection?.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        heroSection.style.setProperty('--mouse-x', `${x}px`);
        heroSection.style.setProperty('--mouse-y', `${y}px`);
    });

    /* ==========================================================
       8. ระบบสลับ Dark / Light Mode
       ========================================================== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('app-theme') || 'light';
    applyTheme(savedTheme);

    themeToggleBtn?.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem('app-theme', nextTheme);
        showToast(
            `สลับเป็น ${nextTheme === 'dark' ? 'โหมดมืด (Dark Mode)' : 'โหมดสว่าง (Light Mode)'} เรียบร้อย`,
            'text-bg-secondary',
            nextTheme === 'dark' ? 'bi-moon-stars-fill' : 'bi-sun-fill'
        );
    });

    function applyTheme(theme) {
        htmlElement.setAttribute('data-bs-theme', theme);
        if (theme === 'dark') {
            if (themeIcon) themeIcon.className = 'bi bi-sun-fill text-warning';
            if (themeText) themeText.textContent = 'โหมดสว่าง';
        } else {
            if (themeIcon) themeIcon.className = 'bi bi-moon-stars-fill text-primary';
        }
    }

    // รองรับปุ่มสลับธีมแบบ Dropdown ในหน้า article.html
    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute('data-bs-theme-value');
            if (theme === 'auto') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(isDark ? 'dark' : 'light');
            } else {
                applyTheme(theme);
            }
            localStorage.setItem('app-theme', theme);
            document.querySelectorAll('[data-bs-theme-value]').forEach(el => el.classList.remove('active'));
            toggle.classList.add('active');
        });
    });

    /* ==========================================================
       9. Toast Center
       ========================================================== */
    const toastElement = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');
    const liveToastInstance = toastElement ? new bootstrap.Toast(toastElement, { delay: 4000 }) : null;

    function showToast(message, bgClass = 'text-bg-primary', iconClass = 'bi-check-circle-fill') {
        if (!toastElement || !toastMessage || !liveToastInstance) return;
        toastElement.className = `toast align-items-center ${bgClass} border-0 shadow-lg`;
        toastMessage.innerHTML = `<i class="bi ${iconClass} fs-5"></i> <span>${message}</span>`;
        liveToastInstance.show();
    }

    document.getElementById('triggerToastBtn')?.addEventListener('click', () => {
        showToast('การแจ้งเตือนแบบเรียลไทม์ผ่าน Bootstrap Toast สำเร็จ!', 'text-bg-primary', 'bi-bell-fill');
    });

    document.getElementById('toastSuccessBtn')?.addEventListener('click', () => {
        showToast('บันทึกการตั้งค่าเรียบร้อยแล้ว (Success)', 'text-bg-success', 'bi-check-circle-fill');
    });

    document.getElementById('toastWarningBtn')?.addEventListener('click', () => {
        showToast('คำเตือน: โปรดระวังการใช้หน่วยความจำเกิน (Warning)', 'text-bg-warning text-dark', 'bi-exclamation-triangle-fill');
    });

    document.getElementById('toastInfoBtn')?.addEventListener('click', () => {
        showToast('Docker Container กำลังรัน Node.js 20 บนพอร์ต 5173', 'text-bg-info text-dark', 'bi-info-circle-fill');
    });

    /* ==========================================================
       10. Task Simulator พร้อม Confetti ตอนเสร็จ
       ========================================================== */
    const startProgressBtn = document.getElementById('startProgressBtn');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const progressStep = document.getElementById('progressStep');
    const taskStatusBadge = document.getElementById('taskStatusBadge');

    const steps = [
        { percent: 20, text: 'กำลังเตรียม Container และ Volume...', badge: 'กำลังเตรียม' },
        { percent: 50, text: 'ติดตั้ง Node modules และ Dependencies...', badge: 'กำลังติดตั้ง' },
        { percent: 80, text: 'คอมไพล์ Sass SCSS และประมวลผล Vite...', badge: 'กำลังคอมไพล์' },
        { percent: 100, text: 'สำเร็จ! พร้อมเปิดใช้งานบนพอร์ต 5173', badge: 'เสร็จสมบูรณ์' }
    ];

    startProgressBtn?.addEventListener('click', () => {
        startProgressBtn.disabled = true;
        let currentStepIndex = 0;

        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';
        progressStep.textContent = 'เริ่มต้นกระบวนการ...';
        taskStatusBadge.className = 'badge bg-warning-subtle text-warning border border-warning-subtle';
        taskStatusBadge.textContent = 'กำลังประมวลผล';

        const interval = setInterval(() => {
            if (currentStepIndex < steps.length) {
                const step = steps[currentStepIndex];
                progressBar.style.width = `${step.percent}%`;
                progressPercent.textContent = `${step.percent}%`;
                progressStep.textContent = step.text;
                taskStatusBadge.textContent = step.badge;
                currentStepIndex++;
            } else {
                clearInterval(interval);
                startProgressBtn.disabled = false;
                taskStatusBadge.className = 'badge bg-success-subtle text-success border border-success-subtle';
                taskStatusBadge.textContent = 'ออนไลน์ 100%';
                
                // ยิง Confetti พลุกระดาษฉลอง
                fireConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);
                showToast('จำลองกระบวนการรัน Docker Build เรียบร้อยแล้ว! 🚀', 'text-bg-success', 'bi-rocket-takeoff-fill');
            }
        }, 750);
    });

    /* ==========================================================
       11. Color Accent Switcher
       ========================================================== */
    const colorDots = document.querySelectorAll('.color-dot');
    const activeColorLabel = document.getElementById('activeColorLabel');

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            const selectedColor = dot.getAttribute('data-color');
            const colorTitle = dot.getAttribute('title');

            document.documentElement.style.setProperty('--bs-primary', selectedColor);
            
            const hex = selectedColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            document.documentElement.style.setProperty('--bs-primary-rgb', `${r}, ${g}, ${b}`);

            if (activeColorLabel) {
                activeColorLabel.textContent = `โทนสีปัจจุบัน: ${colorTitle}`;
            }

            showToast(`เปลี่ยนโทนสีเป็น ${colorTitle} เรียบร้อย!`, 'text-bg-primary', 'bi-palette-fill');
        });
    });

    /* ==========================================================
       12. Interactive Modal
       ========================================================== */
    const feedbackInput = document.getElementById('feedbackInput');
    const emojiBadges = document.querySelectorAll('.emoji-badge');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');
    const interactiveModalEl = document.getElementById('interactiveModal');
    const modalInstance = interactiveModalEl ? bootstrap.Modal.getInstance(interactiveModalEl) || new bootstrap.Modal(interactiveModalEl) : null;

    emojiBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            const emojiText = badge.getAttribute('data-emoji');
            if (feedbackInput) {
                feedbackInput.value = emojiText;
                feedbackInput.focus();
            }
        });
    });

    modalSubmitBtn?.addEventListener('click', () => {
        const val = feedbackInput?.value.trim() || 'ข้อความทดสอบ';
        if (modalInstance) {
            modalInstance.hide();
        }
        fireConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
        showToast(`ได้รับข้อความ: "${val}" ขอบคุณครับ!`, 'text-bg-success', 'bi-send-check-fill');
        if (feedbackInput) feedbackInput.value = '';
    });
});
