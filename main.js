import menuData from './menu_data.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    document.getElementById('year').textContent = new Date().getFullYear();

    initNavbar();
    initParticles();
    initMenu();
    initAnimations();
    initModals();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', closeMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    function closeMobileMenu() {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.5 + 0.1;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.y -= this.speedY;
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function initMenu() {
    const tabsContainer = document.getElementById('menu-tabs');
    const contentContainer = document.getElementById('menu-content');
    const extrasContainer = document.getElementById('menu-extras');
    
    const categories = Object.keys(menuData);
    
    categories.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn px-6 py-2 rounded-full border border-white/20 text-sm font-medium tracking-wide
                         ${index === 0 ? 'active' : 'text-gray-400 hover:border-gold/50 hover:text-white'}`;
        btn.textContent = cat;
        btn.dataset.category = cat;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.classList.add('text-gray-400', 'hover:border-gold/50', 'hover:text-white');
            });
            btn.classList.add('active');
            btn.classList.remove('text-gray-400', 'hover:border-gold/50', 'hover:text-white');
            
            renderMenuItems(cat);
        });
        
        tabsContainer.appendChild(btn);
    });

    renderMenuItems(categories[0]);

    function renderMenuItems(category) {
        contentContainer.style.opacity = '0';
        
        setTimeout(() => {
            contentContainer.innerHTML = '';
            const items = menuData[category];
            
            items.forEach(item => {
                const el = document.createElement('div');
                el.className = 'menu-item-card flex justify-between items-end border-b border-white/10 pb-4 group cursor-default';
                el.innerHTML = `
                    <div class="pr-4">
                        <h4 class="text-xl font-playfair text-white group-hover:text-gold transition-colors duration-300">
                            ${item.name}
                        </h4>
                    </div>
                    <span class="text-gold font-medium whitespace-nowrap">${item.price}</span>
                `;
                contentContainer.appendChild(el);
            });

            if (category === 'Kids') {
                extrasContainer.innerHTML = '(All served with fries, drink, and ice cream scoop)';
                extrasContainer.classList.remove('hidden');
            } else {
                extrasContainer.classList.add('hidden');
            }

            contentContainer.style.opacity = '1';
            
            gsap.from(contentContainer.children, {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: "power2.out"
            });
            
        }, 150);
    }
}

function initAnimations() {
    gsap.to('#hero-img', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    const revealElements = document.querySelectorAll('.gs-reveal');
    revealElements.forEach(el => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

function initModals() {
    const modal = document.getElementById('booking-modal');
    const openBtns = [document.getElementById('nav-book-btn'), document.getElementById('mobile-book-btn')];
    const closeBtn = document.getElementById('close-modal');
    const submitBtn = document.getElementById('submit-booking');

    openBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                modal.classList.remove('opacity-0', 'pointer-events-none');
                document.body.style.overflow = 'hidden';
            });
        }
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    submitBtn.addEventListener('click', () => {
        submitBtn.textContent = 'Confirmed!';
        submitBtn.classList.remove('bg-gold');
        submitBtn.classList.add('bg-green-500', 'text-white');
        
        setTimeout(() => {
            closeModal();
            setTimeout(() => {
                submitBtn.textContent = 'Confirm Reservation';
                submitBtn.classList.add('bg-gold');
                submitBtn.classList.remove('bg-green-500', 'text-white');
                document.getElementById('booking-form').reset();
            }, 300);
        }, 1500);
    });

    function closeModal() {
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }
}
