/**
 * Navigation Module
 * Apple-style mega-menus, mobile drawer, keyboard nav, focus trapping
 *
 * Defers initialization until #navbar exists in the DOM (handles async partial injection).
 */
(function () {
  'use strict';

  console.log('[NAV] Script loaded');

  // ── DOM References (populated after init) ───────────────────────────────────
  let navbar, navBar, desktop, toggle, drawer, overlay, closeBtn;

  // ── State ───────────────────────────────────────────────────────────────────
  let activeMega = null;          // currently open desktop mega-menu id
  let drawerOpen = false;
  let lastFocused = null;        // element that had focus before drawer opened
  let initialized = false;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /** Close whichever mega-menu is currently open */
  function closeMegaMenu() {
    if (!activeMega) return;
    const panel = document.getElementById(activeMega);
    if (panel) panel.classList.add('hidden');

    const trigger = navbar.querySelector(`[aria-controls="${activeMega}"]`);
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      const chevron = trigger.querySelector('svg');
      if (chevron) chevron.classList.remove('rotate-180');
    }
    activeMega = null;
  }

  /** Open a specific mega-menu by its panel id */
  function openMegaMenu(panelId) {
    console.log('[NAV] openMegaMenu called:', panelId);
    if (activeMega === panelId) {
      console.log('[NAV] Same panel already open, closing');
      closeMegaMenu();
      return;
    }
    closeMegaMenu();
    const panel = document.getElementById(panelId);
    console.log('[NAV] Panel element found:', !!panel);
    if (!panel) return;

    panel.classList.remove('hidden');
    console.log('[NAV] Removed hidden class from panel, classes now:', panel.className);

    const trigger = navbar.querySelector(`[aria-controls="${panelId}"]`);
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'true');
      const chevron = trigger.querySelector('svg');
      if (chevron) chevron.classList.add('rotate-180');
    }
    activeMega = panelId;
  }

  // ── Desktop mega-menu: event delegation on the nav ─────────────────────────
  function bindDesktopEvents() {
    console.log('[NAV] bindDesktopEvents called');
    navbar.addEventListener('click', (e) => {
      console.log('[NAV] Click detected on navbar, target:', e.target.tagName, e.target.textContent.trim().substring(0, 30));
      const trigger = e.target.closest('[data-mega]');
      console.log('[NAV] Trigger found:', !!trigger, trigger ? 'data-mega=' + trigger.getAttribute('data-mega') : '');
      if (trigger) {
        e.preventDefault();
        const panelId = 'mega-' + trigger.getAttribute('data-mega');
        openMegaMenu(panelId);
        return;
      }

      // Click on a mega-card inside an open panel → close after navigation
      if (e.target.closest('.mega-card')) {
        closeMegaMenu();
      }
    });

    // Close mega-menu on outside click
    document.addEventListener('click', (e) => {
      if (activeMega && !navbar.contains(e.target)) {
        closeMegaMenu();
      }
    });

    // Close mega-menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeMega) {
        closeMegaMenu();
      }
    });

    // ── Desktop mega-menu: hover intent ─────────────────────────────────────
    if (desktop) {
      desktop.addEventListener('mouseenter', (e) => {
        const li = e.target.closest('li[data-mega]');
        if (li) {
          const panelId = 'mega-' + li.getAttribute('data-mega');
          if (activeMega && activeMega !== panelId) {
            closeMegaMenu();
          }
          openMegaMenu(panelId);
        }
      }, true);

      // Use mouseleave on the ul to close when cursor leaves all nav items
      desktop.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (!navbar.querySelector(':hover')) {
            closeMegaMenu();
          }
        }, 150);
      }, true);

      // Keep mega open when cursor moves into the panel
      navbar.querySelectorAll('[id^="mega-"]').forEach((panel) => {
        panel.addEventListener('mouseenter', () => {
          // Do nothing — keep open
        });
        panel.addEventListener('mouseleave', () => {
          setTimeout(() => {
            if (!navbar.querySelector(':hover')) {
              closeMegaMenu();
            }
          }, 150);
        });
      });
    }
  }

  // ── Mobile drawer ───────────────────────────────────────────────────────────

  function openDrawer() {
    lastFocused = document.activeElement;
    drawerOpen = true;

    // Show overlay
    overlay.classList.remove('hidden');
    void overlay.offsetHeight;          // force reflow
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');

    // Slide in drawer
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');

    // Update ARIA
    toggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside drawer
    requestAnimationFrame(() => {
      const first = drawer.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
      if (first) first.focus();
    });
  }

  function closeDrawer() {
    drawerOpen = false;

    // Slide out drawer
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');

    // Hide overlay
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);

    // Update ARIA
    toggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus
    if (lastFocused) lastFocused.focus();
  }

  function bindDrawerEvents() {
    // Toggle button
    toggle.addEventListener('click', () => {
      drawerOpen ? closeDrawer() : openDrawer();
    });

    // Close button inside drawer
    closeBtn.addEventListener('click', closeDrawer);

    // Overlay click closes drawer
    overlay.addEventListener('click', closeDrawer);

    // Escape closes drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawerOpen) {
        closeDrawer();
      }
    });

    // ── Focus trap inside mobile drawer ─────────────────────────────────────
    drawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !drawerOpen) return;

      const focusables = drawer.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // ── Mobile accordion toggles (event delegation on drawer) ───────────────
    // Uses a single click listener on the drawer container so triggers
    // bound after async partial injection still work.
    drawer.addEventListener('click', (e) => {
      // Accordion toggle
      const trigger = e.target.closest('.mobile-mega-trigger');
      if (trigger) {
        const targetId = trigger.getAttribute('aria-controls');
        const target = document.getElementById(targetId);
        if (!target) return;

        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          target.classList.add('hidden');
          trigger.setAttribute('aria-expanded', 'false');
          const chevron = trigger.querySelector('svg');
          if (chevron) chevron.classList.remove('rotate-180');
        } else {
          target.classList.remove('hidden');
          trigger.setAttribute('aria-expanded', 'true');
          const chevron = trigger.querySelector('svg');
          if (chevron) chevron.classList.add('rotate-180');
        }
        return;
      }

      // Close drawer when any link inside is clicked
      if (e.target.closest('a')) {
        if (drawerOpen) closeDrawer();
      }
    });
  }

  // ── Navbar scroll effect ────────────────────────────────────────────────────
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          navBar.style.background = 'rgba(11,12,10,0.9)';
          navBar.style.backdropFilter = 'blur(14px)';
          navBar.style.webkitBackdropFilter = 'blur(14px)';
          navBar.style.borderBottom = '1px solid rgba(240,240,240,0.1)';
        } else {
          navBar.style.background = 'transparent';
          navBar.style.backdropFilter = 'none';
          navBar.style.webkitBackdropFilter = 'none';
          navBar.style.borderBottom = 'none';
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  // ── Close mega on resize past lg breakpoint ─────────────────────────────────
  const lgBreakpoint = window.matchMedia('(min-width: 1024px)');

  function onBreakpointChange(e) {
    if (e.matches && drawerOpen) {
      closeDrawer();
    }
    if (!e.matches) {
      closeMegaMenu();
    }
  }

  // ── Initialization ──────────────────────────────────────────────────────────

  function init() {
    console.log('[NAV] init() called, initialized:', initialized);
    if (initialized) return;

    navbar   = document.getElementById('navbar');
    navBar   = document.getElementById('nav-bar');
    desktop  = document.getElementById('nav-desktop');
    toggle   = document.getElementById('nav-toggle');
    drawer   = document.getElementById('nav-mobile-drawer');
    overlay  = document.getElementById('nav-overlay');
    closeBtn = document.getElementById('nav-close');

    console.log('[NAV] DOM elements found:', {
      navbar: !!navbar, navBar: !!navBar, desktop: !!desktop,
      toggle: !!toggle, drawer: !!drawer, overlay: !!overlay, closeBtn: !!closeBtn
    });

    // Only require navbar and navBar for desktop mega-menus to work
    if (!navbar || !navBar) {
      console.log('[NAV] BAILING - core navbar elements missing');
      return;
    }

    initialized = true;
    console.log('[NAV] Initialized successfully, binding desktop events');

    bindDesktopEvents();
    // Only bind drawer events if mobile elements exist
    if (toggle && drawer && overlay && closeBtn) {
      console.log('[NAV] Mobile drawer elements found, binding drawer events');
      bindDrawerEvents();
    } else {
      console.log('[NAV] Mobile drawer elements not yet available, skipping drawer binding');
      // Try to bind drawer events later when elements appear
      const mobileRetry = setInterval(() => {
        toggle   = document.getElementById('nav-toggle');
        drawer   = document.getElementById('nav-mobile-drawer');
        overlay  = document.getElementById('nav-overlay');
        closeBtn = document.getElementById('nav-close');
        if (toggle && drawer && overlay && closeBtn) {
          console.log('[NAV] Mobile drawer elements now available, binding events');
          clearInterval(mobileRetry);
          bindDrawerEvents();
        }
      }, 200);
      // Stop retrying after 5 seconds
      setTimeout(() => clearInterval(mobileRetry), 5000);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    lgBreakpoint.addEventListener('change', onBreakpointChange);
  }

  // Try immediately (works if partial is already in DOM)
  console.log('[NAV] Attempting immediate init');
  init();

  // If not yet initialized, wait for the partial to appear via MutationObserver
  if (!initialized) {
    console.log('[NAV] Not initialized yet, setting up MutationObserver');
    const observer = new MutationObserver((mutations) => {
      console.log('[NAV] MutationObserver fired, mutations:', mutations.length);
      // Log what was added
      mutations.forEach(m => {
        console.log('[NAV] Mutation type:', m.type, 'addedNodes:', m.addedNodes.length);
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) console.log('[NAV] Added element:', n.tagName, n.id || '(no id)');
        });
      });
      if (document.getElementById('navbar')) {
        console.log('[NAV] #navbar found in DOM, disconnecting observer');
        observer.disconnect();
        init();
      } else {
        console.log('[NAV] #navbar still not found after mutation');
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[NAV] MutationObserver started on document.body');

    // Fallback: poll for #navbar in case MutationObserver misses the injection
    let pollCount = 0;
    const pollInterval = setInterval(() => {
      pollCount++;
      console.log('[NAV] Poll attempt', pollCount);
      if (document.getElementById('navbar')) {
        console.log('[NAV] #navbar found via polling');
        clearInterval(pollInterval);
        observer.disconnect();
        init();
      } else if (pollCount >= 50) {
        console.log('[NAV] Polling gave up after 50 attempts');
        clearInterval(pollInterval);
        observer.disconnect();
      }
    }, 100);

    // Safety timeout: stop observing after 10s to avoid memory leak
    setTimeout(() => {
      console.log('[NAV] Safety timeout - stopping observer');
      observer.disconnect();
      clearInterval(pollInterval);
    }, 10000);
  }

})();
