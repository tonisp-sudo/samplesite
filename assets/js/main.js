

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();


// This block creates a 0.2 second delay for navbar items loading
// 1. Listen for the page to be ready
document.addEventListener('DOMContentLoaded', () => {

  // 2. Define a variable that holds all navbar items separately so they can be looped through
  const navItems = document.querySelectorAll('.navmenu ul li');

  // 3. Loop through and apply the styles
  navItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.3}s`;
    item.classList.add('visible');
  });

});

// Building the ripple effect for service-cards

const vs = `
    precision mediump float;
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    varying vec2 vTextureCoord;
    void main() {
        vTextureCoord = aTextureCoord;
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
`;

const fs = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform float uTime;
    uniform float uHover; // 👈 This is our on/off switch

    void main() {
        vec2 uv = vTextureCoord;
        
        // If uHover is 0, distortion becomes 0.
        // If uHover is 1, the wave activates.
        float distortion = sin(uv.y * 8.0 + uTime * 0.05) * (uHover * 0.03);
        uv.x += distortion;

        // Your CSS Colors mapped to RGB (0.0 to 1.0)
        vec3 surfaceColor = vec3(0.10, 0.14, 0.22); // #1A2538
        vec3 accentColor = vec3(0.0, 0.64, 1.0);    // #00A3FF

        // Mix the colors based on the moving distortion
        vec3 finalColor = mix(surfaceColor, accentColor, distortion * 2.0);
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// This tells JS to wait until the full page (images, fonts, etc.) is ready
window.addEventListener("load", () => {
    // 1. Initialize the curtains instance
    const curtains = new Curtains({ container: "canvas" });

    // 2. Select all your service cards
    const planeElements = document.querySelectorAll(".service-card");

    planeElements.forEach((el) => {
        // We will create a new Plane for every card found
        const plane = new Plane(curtains, el, {
            vertexShader: vs,
            fragmentShader: fs,
            widthSegments: 20,
            heightSegments: 20,
            uniforms: {
                uTime: { name: "uTime", type: "1f", value: 0 },
                uHover: { name: "uHover", type: "1f", value: 0 },
            },
        });
        // Detect when the mouse moves over the card
el.addEventListener("mouseenter", () => {
    // We access the 'uHover' uniform we created earlier
    // and set its value to 1.0 (on)
    plane.uniforms.uHover.value = 1.0;
});

// Detect when the mouse moves away
el.addEventListener("mouseleave", () => {
    // Set it back to 0.0 (off)
    plane.uniforms.uHover.value = 0.0;
});

        // 3. The Render Loop: This runs every frame
        plane.onRender(() => {
            plane.uniforms.uTime.value += 0.01; // Updates the time uniform
        });
    });
});