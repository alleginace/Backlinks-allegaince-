/* ============================================
   ALLEGIANCE EDUCARE — SCRIPT.JS
   Interactivity: Navbar, Slider, Stats, FAQ
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR: SCROLL SHADOW + HAMBURGER ─── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
      } else {
        navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
      }
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─── STATS COUNTER ANIMATION ─── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = target >= 1000
        ? current.toLocaleString('en-IN') + '+'
        : target === 98
          ? current + '%'
          : current + (target === 15 || target === 20 || target === 200 ? '+' : '');
    }, 16);
  };

  if (statNums.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => observer.observe(el));
  }

  /* ─── TESTIMONIALS SLIDER ─── */
  const slider = document.getElementById('testimonialsSlider');
  const dotsContainer = document.getElementById('sliderDots');

  if (slider && dotsContainer) {
    const cards = slider.querySelectorAll('.testimonial-card');
    let currentIdx = 0;
    let autoSlide;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    const goTo = (idx) => {
      cards[currentIdx].classList.remove('active');
      dots[currentIdx].classList.remove('active');
      currentIdx = (idx + cards.length) % cards.length;
      cards[currentIdx].classList.add('active');
      dots[currentIdx].classList.add('active');
    };

    const next = () => goTo(currentIdx + 1);

    const startAuto = () => { autoSlide = setInterval(next, 5000); };
    const stopAuto = () => clearInterval(autoSlide);

    startAuto();
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
  }

  /* ─── FAQ ACCORDION ─── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = question.getAttribute('aria-expanded') === 'true';

        // Close all
        faqItems.forEach(other => {
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').classList.remove('open');
        });

        // Open clicked if it was closed
        if (!isOpen) {
          question.setAttribute('aria-expanded', 'true');
          answer.classList.add('open');
        }
      });
    }
  });

  /* ─── CONTACT FORM ─── */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();

      if (!name || !email) {
        alert('Please fill in your name and email address.');
        return;
      }

      // Simulate form submission
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Request Sent!';
        btn.style.background = '#22c55e';
        contactForm.reset();

        setTimeout(() => {
          btn.textContent = 'Book Free Consultation';
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 1500);
    });
  }

  /* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 70;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── LAZY LOAD IMAGES (fallback for older browsers) ─── */
  if ('IntersectionObserver' in window) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          imgObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });

    lazyImgs.forEach(img => imgObserver.observe(img));
  }

  /* ─── ACTIVE NAV LINK ON SCROLL (homepage only) ─── */
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNav = () => {
      const scrollPos = window.scrollY + 100;
      sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
          if (scrollPos >= top && scrollPos < bottom) {
            navAnchorLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
  }

});
