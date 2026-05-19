/* ============================================================
   ALLEGIANCE EDUCARE â€” MAIN SCRIPT
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     NAVBAR â€” SCROLL BEHAVIOUR & HAMBURGER
     ============================================================ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  const counters = document.querySelectorAll('.stat-number[data-target]');

  if (counters.length) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target   = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2200;
      let startTime  = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed  = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current  = Math.round(easeOut(progress) * target);
        el.textContent = current.toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /* ============================================================
     TESTIMONIALS SLIDER
     ============================================================ */
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');

  if (track && prevBtn && nextBtn) {
    const cards      = Array.from(track.querySelectorAll('.testimonial-card'));
    const total      = cards.length;
    let current      = 0;
    let autoInterval = null;

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('.slider-dot'));

    const update = () => {
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const goTo = (index) => {
      current = (index + total) % total;
      update();
    };

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    const startAuto = () => {
      autoInterval = setInterval(() => goTo(current + 1), 6000);
    };

    const resetAuto = () => {
      clearInterval(autoInterval);
      startAuto();
    };

    // Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) {
        delta < 0 ? goTo(current + 1) : goTo(current - 1);
        resetAuto();
      }
    }, { passive: true });

    startAuto();
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer   = btn.nextElementSibling;
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-question').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherAnswer = other.nextElementSibling;
          if (otherAnswer) otherAnswer.classList.remove('open');
        }
      });

      // Toggle this
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (answer) answer.classList.toggle('open', !isOpen);
    });
  });

  /* ============================================================
     CONTACT FORM
     ============================================================ */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = form.fullName.value.trim();
      const phone    = form.phone.value.trim();
      const email    = form.email.value.trim();

      if (!fullName || !phone || !email) {
        showFormMessage('Please fill in your name, phone, and email.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled  = true;
      submitBtn.textContent = 'Submittingâ€¦';

      setTimeout(() => {
        submitBtn.disabled  = false;
        submitBtn.textContent = 'Book Free Session â†’';
        showFormMessage('ðŸŽ‰ Thank you! A counsellor will contact you within 24 hours.', 'success');
        form.reset();
      }, 1500);
    });

    function showFormMessage(msg, type) {
      let el = document.getElementById('formMessage');
      if (!el) {
        el = document.createElement('p');
        el.id = 'formMessage';
        el.style.cssText = `
          padding: 0.9rem 1.25rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-top: 1rem;
          text-align: center;
        `;
        form.appendChild(el);
      }

      el.textContent = msg;

      if (type === 'success') {
        el.style.background = '#d1fae5';
        el.style.color       = '#065f46';
        el.style.border      = '1px solid #6ee7b7';
      } else {
        el.style.background = '#fee2e2';
        el.style.color       = '#991b1b';
        el.style.border      = '1px solid #fca5a5';
      }

      setTimeout(() => { if (el.parentNode) el.remove(); }, 5000);
    }
  }

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     LAZY LOADING IMAGES (native + IntersectionObserver fallback)
     ============================================================ */
  if ('IntersectionObserver' in window) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Images already have src set; just mark as observed
          img.style.opacity = '0';
          img.onload = () => {
            img.style.transition = 'opacity 0.5s ease';
            img.style.opacity = '1';
          };
          if (img.complete) img.style.opacity = '1';
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyImgs.forEach(img => imgObserver.observe(img));
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLL (offset for fixed navbar)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     SERVICE CARD ANIMATION (stagger on scroll)
     ============================================================ */
  if ('IntersectionObserver' in window) {
    const animItems = document.querySelectorAll(
      '.service-card, .step-card, .blog-card, .city-card, .stat-card'
    );

    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity    = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animItems.forEach(item => {
      item.style.opacity    = '0';
      item.style.transform  = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      animObserver.observe(item);
    });
  }

  /* ============================================================
     BLOG: HIGHLIGHT ACTIVE SECTION IN SIDEBAR
     ============================================================ */
  const blogArticles = document.querySelectorAll('.blog-article[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

  if (blogArticles.length && sidebarLinks.length) {
    const articleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          sidebarLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.style.color      = isActive ? 'var(--orange-600)' : '';
            link.style.fontWeight = isActive ? '700' : '';
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

    blogArticles.forEach(a => articleObserver.observe(a));
  }

}); // end DOMContentLoaded
