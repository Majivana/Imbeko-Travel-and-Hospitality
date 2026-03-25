/**
 * IMBEKO TRAVEL & HOSPITALITY
 * Complete JavaScript with 3D Animations
 * Updated 2026 - FIXED VERSION
 */

// ============================================
// MOBILE MENU - FIXED
// ============================================

class MobileMenu {
  constructor() {
    this.menuBtn = document.querySelector('.mobile-menu-btn');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.closeBtn = document.querySelector('.mobile-menu-close');
    this.menuLinks = document.querySelectorAll('.mobile-menu a');
    this.body = document.body;
    
    // Create overlay if it doesn't exist
    this.overlay = document.querySelector('.mobile-menu-overlay');
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'mobile-menu-overlay';
      document.body.appendChild(this.overlay);
    }
    
    this.init();
  }

  init() {
    if (!this.menuBtn || !this.mobileMenu) return;

    // Open menu
    this.menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.open();
    });
    
    // Close menu - close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      });
    }

    // Close menu - overlay click
    this.overlay.addEventListener('click', () => {
      this.close();
    });

    // Close menu - link clicks
    this.menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
        this.close();
      }
    });
    
    // Prevent menu content clicks from closing
    this.mobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  open() {
    if (this.mobileMenu) {
      this.mobileMenu.classList.add('active');
      this.overlay.classList.add('active');
      this.body.style.overflow = 'hidden';
    }
  }

  close() {
    if (this.mobileMenu) {
      this.mobileMenu.classList.remove('active');
      this.overlay.classList.remove('active');
      this.body.style.overflow = '';
    }
  }
}

// ============================================
// 3D ANIMATION ENGINE
// ============================================

class Animation3D {
  constructor() {
    this.elements = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;
    this.init();
  }

  init() {
    this.setupMouseTracking();
    this.setupScrollAnimations();
    this.setup3DCards();
    this.setupParticles();
    this.setupParallax();
  }

  // Mouse tracking for 3D tilt effects
  setupMouseTracking() {
    if (this.isTouch) return;

    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Update CSS variables for tilt effects
      document.documentElement.style.setProperty('--rotate-x', `${this.mouseY * -5}deg`);
      document.documentElement.style.setProperty('--rotate-y', `${this.mouseX * 5}deg`);
    });
  }

  // 3D Card tilt effects
  setup3DCards() {
    const cards = document.querySelectorAll('.card-3d, .service-card, .testimonial-card, .insight-card');
    
    cards.forEach(card => {
      if (this.isTouch) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  // Particle system
  setupParticles() {
    const containers = document.querySelectorAll('.particles-container');
    
    containers.forEach(container => {
      const particleCount = 25;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${10 + Math.random() * 10}s`;
        container.appendChild(particle);
      }
    });
  }

  // Parallax scrolling effect
  setupParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }

  // Scroll reveal animations
  setupScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // Animate counters if present
          const counters = entry.target.querySelectorAll('.stat-number[data-count]');
          counters.forEach(counter => this.animateCounter(counter));
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Counter animation
  animateCounter(element) {
    if (element.classList.contains('counted')) return;
    element.classList.add('counted');
    
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  }
}

// ============================================
// HERO SLIDER
// ============================================

class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.dots = document.querySelectorAll('.slider-dot');
    this.prevBtn = document.querySelector('.slider-btn.prev');
    this.nextBtn = document.querySelector('.slider-btn.next');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    this.isAnimating = false;
    
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;
    
    this.showSlide(0);
    this.startAutoPlay();
    this.bindEvents();
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetAutoPlay();
      });
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
        this.resetAutoPlay();
      });
    });

    // Pause on hover
    const slider = document.querySelector('.hero-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => this.stopAutoPlay());
      slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }

  showSlide(index) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Hide all slides
    this.slides.forEach(slide => {
      slide.classList.remove('active');
      slide.style.opacity = '0';
    });

    // Update dots
    this.dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide with animation
    setTimeout(() => {
      this.slides[index].classList.add('active');
      this.slides[index].style.opacity = '1';
      if (this.dots[index]) {
        this.dots[index].classList.add('active');
      }
      this.currentSlide = index;
      this.isAnimating = false;
    }, 100);
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(next);
  }

  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prev);
  }

  goToSlide(index) {
    if (index === this.currentSlide) return;
    this.showSlide(index);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// ============================================
// FORM VALIDATION
// ============================================

class FormValidator {
  constructor(form) {
    this.form = form;
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
      this.showSuccess();
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    } else {
      this.clearError(field);
    }

    return isValid;
  }

  showError(field, message) {
    this.clearError(field);
    
    field.classList.add('error');
    field.style.borderColor = '#c41e3a';
    
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = `
      color: #c41e3a;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    `;
    
    field.parentNode.appendChild(errorEl);
  }

  clearError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    const errorEl = field.parentNode.querySelector('.error-message');
    if (errorEl) {
      errorEl.remove();
    }
  }

  showSuccess() {
    const successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.textContent = 'Thank you! Your message has been sent successfully.';
    successEl.style.cssText = `
      background: #25d366;
      color: white;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      text-align: center;
    `;
    
    this.form.prepend(successEl);
    this.form.reset();

    setTimeout(() => {
      successEl.remove();
    }, 5000);
  }
}

// ============================================
// NEWSLETTER FORM
// ============================================

class NewsletterForm {
  constructor() {
    this.forms = document.querySelectorAll('.newsletter-form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });
  }

  handleSubmit(e, form) {
    e.preventDefault();
    
    const input = form.querySelector('input');
    const email = input.value.trim();
    
    if (!email) {
      this.showMessage(form, 'Please enter your email address', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showMessage(form, 'Please enter a valid email address', 'error');
      return;
    }

    // Simulate subscription
    this.showMessage(form, 'Thank you for subscribing!', 'success');
    input.value = '';
  }

  showMessage(form, message, type) {
    const existingMessage = form.querySelector('.newsletter-message');
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement('p');
    messageEl.className = 'newsletter-message';
    messageEl.textContent = message;
    messageEl.style.cssText = `
      font-size: 13px;
      margin-top: 10px;
      color: ${type === 'success' ? '#25d366' : '#c41e3a'};
    `;
    
    form.appendChild(messageEl);

    setTimeout(() => {
      messageEl.remove();
    }, 3000);
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================

class HeaderScroll {
  constructor() {
    this.header = document.querySelector('.main-header');
    this.topBar = document.querySelector('.top-bar');
    this.lastScroll = 0;
    
    this.init();
  }

  init() {
    if (!this.header) return;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add shadow on scroll
      if (currentScroll > 50) {
        this.header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
      } else {
        this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
      }

      // Hide/show top bar
      if (this.topBar) {
        if (currentScroll > 100) {
          this.topBar.style.transform = 'translateY(-100%)';
          this.header.style.top = '0';
        } else {
          this.topBar.style.transform = 'translateY(0)';
          this.header.style.top = '36px';
        }
      }

      this.lastScroll = currentScroll;
    }, { passive: true });
  }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px'
      });

      this.images.forEach(img => observer.observe(img));
    } else {
      // Fallback for older browsers
      this.images.forEach(img => this.loadImage(img));
    }
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Mobile Menu (FIXED)
  new MobileMenu();
  
  // Initialize 3D Animation Engine
  new Animation3D();
  
  // Initialize Hero Slider
  new HeroSlider();
  
  // Initialize Form Validators
  document.querySelectorAll('form').forEach(form => {
    new FormValidator(form);
  });
  
  // Initialize Newsletter Forms
  new NewsletterForm();
  
  // Initialize Smooth Scroll
  new SmoothScroll();
  
  // Initialize Header Scroll Effect
  new HeaderScroll();
  
  // Initialize Lazy Loader
  new LazyLoader();

  // ============================================
  // PARTNER SLIDER - MOVED INSIDE DOMContentLoaded WITH NULL CHECK
  // ============================================
  const sliderTrack = document.querySelector('.slider-track');
  
  // Only attach events if slider exists on this page
  if (sliderTrack) {
    // Pause on hover (CSS handles this, but JS adds extra control)
    sliderTrack.addEventListener('mouseenter', () => {
      sliderTrack.style.animationPlayState = 'paused';
      sliderTrack.style.animationDuration = '40s';
    });

    sliderTrack.addEventListener('mouseleave', () => {
      sliderTrack.style.animationPlayState = 'running';
    });
  }

  // Add loaded class to body for initial animations
  document.body.classList.add('loaded');
  
  console.log('Imbeko Travel & Hospitality - All systems initialized');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Export modules for potential external use
window.Imbeko = {
  MobileMenu,
  Animation3D,
  HeroSlider,
  FormValidator,
  NewsletterForm,
  SmoothScroll,
  HeaderScroll,
  LazyLoader,
  debounce,
  throttle,
  isInViewport
};