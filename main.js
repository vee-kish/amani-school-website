/**
 * Amani International Academy - Main JavaScript
 * Handles: Mobile navigation, smooth scroll, active states, forms, tuition calculator
 */

function initNavigation() {
  // ============================================================================
  // Mobile Navigation (Hamburger Menu)
  // ============================================================================
  var mobileMenuBtn = document.getElementById('mobile-menu-btn');
  var mobileMenuClose = document.getElementById('mobile-menu-close');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  function openMobileMenu() {
    mobileMenu.classList.remove('opacity-0', 'invisible', '-translate-y-4');
    mobileMenu.classList.add('opacity-100', 'visible', 'translate-y-0');
    mobileMenuOverlay.classList.remove('opacity-0', 'invisible');
    mobileMenuOverlay.classList.add('opacity-100', 'visible');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('opacity-0', 'invisible', '-translate-y-4');
    mobileMenu.classList.remove('opacity-100', 'visible', 'translate-y-0');
    mobileMenuOverlay.classList.add('opacity-0', 'invisible');
    mobileMenuOverlay.classList.remove('opacity-100', 'visible');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuBtn?.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);
  mobileMenuOverlay?.addEventListener('click', closeMobileMenu);

  // Close mobile menu when clicking a link
  mobileMenu?.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

function initActiveNav() {
  // ============================================================================
  // Active Navigation State
  // ============================================================================
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var desktopNav = document.getElementById('desktop-nav');
  var mobileMenu = document.getElementById('mobile-menu');

  function setActiveLink(nav) {
    if (!nav) return;
    var links = nav.querySelectorAll('a[href]');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === currentPath || (currentPath === 'index.html' && href === 'index.html#about')) {
        link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-secondary', 'pb-1');
        link.classList.remove('text-on-surface-variant', 'font-medium');
      } else if (href.includes(currentPath.replace('.html', ''))) {
        link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-secondary', 'pb-1');
        link.classList.remove('text-on-surface-variant', 'font-medium');
      }
    });
  }

  // Mark the calendar icon active on the Academic Calendar page
  if (currentPath === 'school_calendar.html') {
    var calendarLink = document.getElementById('calendar-link');
    if (calendarLink) {
      calendarLink.classList.add('text-secondary', 'bg-surface-container');
      calendarLink.classList.remove('text-on-surface-variant');
    }
  }

  setActiveLink(desktopNav);
  setActiveLink(mobileMenu);
}

// ============================================================================
// Smooth Scroll for Anchor Links
// ============================================================================
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80; // Account for sticky header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL without scrolling
        history.pushState(null, '', targetId);
      }
    });
  });
})();

// ============================================================================
// Scroll Spy for Active Section Highlighting
// ============================================================================
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#desktop-nav a[href^="#"], #mobile-menu a[href^="#"]');

  function updateActiveSection() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-secondary', 'pb-1');
          link.classList.add('text-on-surface-variant', 'font-medium');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-secondary', 'pb-1');
            link.classList.remove('text-on-surface-variant', 'font-medium');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection(); // Initial check
})();

// ============================================================================
// Smooth Scroll for Anchor Links
// ============================================================================
(function() {
  // Tuition data
  const tuitionData = {
    early_years: { day: 340000, weekly: null, full: null, name: 'Early Years Centre' },
    junior_primary: { day: 520000, weekly: 700000, full: 880000, name: 'Junior Primary Academy' },
    secondary: { day: 690000, weekly: 920000, full: 1140000, name: 'Middle & Senior Secondary' },
    sixth_form: { day: 790000, weekly: 1040000, full: 1290000, name: 'The Karen Sixth Form College' }
  };

  const addonPrices = {
    transport: 45000,
    music: 28000,
    equestrian: 35000,
    dining: 22000
  };

  let currentCurrency = 'KES';
  const kesToUsd = 130; // Approximate conversion

  // DOM Elements
  const divisionOptions = document.querySelectorAll('#calc-divisions .calc-division-option');
  const boardingOptions = document.querySelectorAll('#calc-boarding-options .calc-boarding-btn');
  const scheduleOptions = document.querySelectorAll('#calc-schedule-options .calc-schedule-btn');
  const addonCheckboxes = document.querySelectorAll('.calc-addon');
  const currencyBtns = document.querySelectorAll('.calc-currency-btn');

  // Summary Elements
  const summaryDivisionTitle = document.getElementById('summary-division-title');
  const summaryBadgeStatus = document.getElementById('summary-badge-status');
  const calcValBase = document.getElementById('calc-val-base');
  const rowBoarding = document.getElementById('row-boarding');
  const calcValBoarding = document.getElementById('calc-val-boarding');
  const calcValAddons = document.getElementById('calc-val-addons');
  const rowDiscount = document.getElementById('row-discount');
  const calcValDiscount = document.getElementById('calc-val-discount');
  const calcGrandTotal = document.getElementById('calc-grand-total');
  const calcGrandEquivalent = document.getElementById('calc-grand-equivalent');
  const summaryPeriodNote = document.getElementById('summary-period-note');
  const addonDiningContainer = document.getElementById('container-addon-dining');
  const addonDiningSub = document.getElementById('addon-dining-sub');
  const boardingStatusNote = document.getElementById('boarding-status-note');

  let selectedDivision = 'junior_primary';
  let selectedBoarding = 'day';
  let selectedSchedule = 'term';

  function formatCurrency(amount) {
    if (currentCurrency === 'USD') {
      return `$${(amount / kesToUsd).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `KES ${amount.toLocaleString('en-KE')}`;
  }

  function updateSummary() {
    const data = tuitionData[selectedDivision];
    const isAnnual = selectedSchedule === 'annual';
    let base = data[selectedBoarding] || data.day;
    let boardingCost = 0;
    let addonTotal = 0;

    // Calculate base tuition
    if (selectedBoarding !== 'day') {
      boardingCost = base - data.day;
      base = data.day;
    }

    // Calculate addons
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonTotal += parseInt(cb.dataset.kes) || 0;
      }
    });

    // Hide dining addon for boarders
    if (selectedBoarding !== 'day') {
      addonDiningContainer?.classList.add('hidden');
      document.getElementById('addon-dining').checked = false;
    } else {
      addonDiningContainer?.classList.remove('hidden');
    }

    // Update boarding note
    if (boardingStatusNote) {
      boardingStatusNote.textContent = selectedBoarding === 'day' ? 'Boarding commences from Year 1' : '';
    }

    // Calculate discount
    const subtotal = base + boardingCost + addonTotal;
    let discount = 0;
    if (isAnnual) {
      discount = Math.round(subtotal * 0.05);
    }

    const total = subtotal - discount;

    // Update UI
    summaryDivisionTitle.textContent = data.name;
    summaryBadgeStatus.textContent = selectedBoarding.charAt(0).toUpperCase() + selectedBoarding.slice(0).replace('full', 'Full Residential') + (isAnnual ? ' · Annual' : ' · Termly');
    calcValBase.textContent = formatCurrency(base);

    if (boardingCost > 0) {
      rowBoarding.classList.remove('hidden');
      calcValBoarding.textContent = `+${formatCurrency(boardingCost)}`;
    } else {
      rowBoarding.classList.add('hidden');
    }

    calcValAddons.textContent = formatCurrency(addonTotal);

    if (discount > 0) {
      rowDiscount.classList.remove('hidden');
      calcValDiscount.textContent = `-${formatCurrency(discount)}`;
    } else {
      rowDiscount.classList.add('hidden');
    }

    calcGrandTotal.textContent = formatCurrency(total);
    calcGrandEquivalent.textContent = currentCurrency === 'KES' ? `Approx. $${Math.round(total / kesToUsd).toLocaleString()} USD` : `Approx. KES ${(total * kesToUsd).toLocaleString()}`;
    summaryPeriodNote.textContent = isAnnual ? 'Annual Total (5% concession applied)' : 'Per Term (3 terms / year)';

    // Update addon prices display
    addonCheckboxes.forEach(cb => {
      const priceEl = document.getElementById(`price-addon-${cb.id.replace('addon-', '')}`);
      if (priceEl) {
        priceEl.textContent = `+${formatCurrency(parseInt(cb.dataset.kes))} / term`;
      }
    });
  }

  // Division selection
  divisionOptions.forEach(option => {
    option.addEventListener('click', () => {
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedDivision = radio.value;
        divisionOptions.forEach(o => o.classList.remove('border-primary', 'bg-surface-container-lowest', 'shadow-sm', 'ring-1', 'ring-primary/20'));
        option.classList.add('border-primary', 'bg-surface-container-lowest', 'shadow-sm', 'ring-1', 'ring-primary/20');
        updateSummary();
      }
    });
  });

  // Boarding selection
  boardingOptions.forEach(option => {
    option.addEventListener('click', () => {
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedBoarding = radio.value;
        boardingOptions.forEach(o => o.classList.remove('border-primary', 'bg-surface-container-lowest', 'ring-1', 'ring-primary/20'));
        option.classList.add('border-primary', 'bg-surface-container-lowest', 'ring-1', 'ring-primary/20');
        updateSummary();
      }
    });
  });

  // Schedule selection
  scheduleOptions.forEach(option => {
    option.addEventListener('click', () => {
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedSchedule = radio.value;
        scheduleOptions.forEach(o => o.classList.remove('border-primary', 'bg-surface-container-lowest', 'ring-1', 'ring-primary/20'));
        option.classList.add('border-primary', 'bg-surface-container-lowest', 'ring-1', 'ring-primary/20');
        updateSummary();
      }
    });
  });

  // Addon checkboxes
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const label = cb.closest('label');
      if (cb.checked) {
        label.classList.add('border-primary', 'bg-primary-container', 'text-surface');
        label.classList.remove('border-outline-variant/60', 'bg-surface', 'text-on-surface');
      } else {
        label.classList.remove('border-primary', 'bg-primary-container', 'text-surface');
        label.classList.add('border-outline-variant/60', 'bg-surface', 'text-on-surface');
      }
      updateSummary();
    });
  });

  // Currency toggle
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCurrency = btn.dataset.currency;
      currencyBtns.forEach(b => {
        b.classList.remove('bg-secondary', 'text-surface');
        b.classList.add('text-surface/75');
      });
      btn.classList.add('bg-secondary', 'text-surface');
      btn.classList.remove('text-surface/75');
      updateSummary();
    });
  });

  // Initialize
  updateSummary();
})();

// ============================================================================
// Campus Map Zone Tabs (campus.html)
// ============================================================================
(function() {
  const zoneTabs = document.querySelectorAll('.zone-tab-btn');
  const zonePins = ['pin-north', 'pin-science', 'pin-sports', 'pin-forest', 'pin-boarding'];

  const zoneData = {
    'north-commons': {
      tag: 'Sector 01',
      title: 'North Academic Commons',
      desc: 'The intellectual heart of the senior secondary school, housing the humanities faculty, the Grand Atrium, student government council chambers, and formal administrative offices.',
      highlights: [
        'Central Socratic Lecture Theater (300 seats)',
        'College Counseling & University Guidance Suite'
      ],
      activePin: 'pin-north'
    },
    'science-quad': {
      tag: 'Sector 02',
      title: 'Science & Biotech Quad',
      desc: 'Home to 14 fully equipped wet and dry laboratories, an advanced clean water analytical center, and specialized computing nodes for secondary bioinformatics research.',
      highlights: [
        '4 Senior Biology & Molecular Genetics Labs',
        'Robotics and Automated Fabrications Workshop'
      ],
      activePin: 'pin-science'
    },
    'sports-arena': {
      tag: 'Sector 03',
      title: 'Olympic Sports Arena',
      desc: 'Dedicated to athletic development, physical conditioning, and inter-scholastic competition across East Africa, featuring covered pavilions and heated aquatics.',
      highlights: [
        '50m Heated Olympic Pool & Coaching Gallery',
        'FIFA-Certified Artificial Turf Stadium & Running Track'
      ],
      activePin: 'pin-sports'
    },
    'forest-trail': {
      tag: 'Sector 04',
      title: 'Karen Forest Trail & Farm',
      desc: 'Our 5-acre agroforestry research reserve providing living laboratories for permaculture, soil microbiology, botany classes, and self-guided ecological walking paths.',
      highlights: [
        '350kW Solar Canopy & Hydrological Retention Dam',
        'Botanical Greenhouse with 200+ Indigenous Species'
      ],
      activePin: 'pin-forest'
    },
    'boarding-village': {
      tag: 'Sector 05',
      title: 'Boarding Village',
      desc: 'Four residential houses grouped in an organic communal compound with pastoral live-in faculty, dining pavilion, study libraries, and communal garden terraces.',
      highlights: [
        'Double & Single Climate-Controlled Ensuite Rooms',
        'Integrated Wellness Clinic & Resident Nurse Station'
      ],
      activePin: 'pin-boarding'
    }
  };

  window.switchZone = function(zoneKey) {
    const data = zoneData[zoneKey];
    if (!data) return;

    // Update text
    document.getElementById('zone-tag').innerText = data.tag;
    document.getElementById('zone-title').innerText = data.title;
    document.getElementById('zone-desc').innerText = data.desc;

    // Update highlights
    const hlContainer = document.getElementById('zone-highlights');
    if (hlContainer) {
      hlContainer.innerHTML = data.highlights.map(h => `
        <div class="flex items-center gap-2 font-body-sm text-body-sm text-primary">
          <span class="material-symbols-outlined text-secondary text-base">check_circle</span>
          <span>${h}</span>
        </div>
      `).join('');
    }

    // Update tabs UI
    zoneTabs.forEach(btn => {
      btn.classList.remove('bg-primary', 'text-surface', 'border-primary');
      btn.classList.add('bg-surface-container-low', 'text-primary', 'border-outline-variant/60');
    });
    const activeBtn = document.querySelector(`[onclick="switchZone('${zoneKey}')"]`);
    if (activeBtn) {
      activeBtn.classList.remove('bg-surface-container-low', 'border-outline-variant/60');
      activeBtn.classList.add('bg-primary', 'text-surface', 'border-primary');
    }

    // Update Pin styling
    zonePins.forEach(pId => {
      const el = document.getElementById(pId);
      if (el) {
        if (pId === data.activePin) {
          el.className = 'p-3 bg-secondary text-primary rounded-full shadow-lg transform -translate-y-2 border-2 border-surface flex items-center gap-1.5 cursor-pointer transition-all duration-200';
        } else {
          el.className = 'p-2.5 bg-primary-container text-surface-bright rounded-full opacity-85 hover:opacity-100 transition-opacity border border-outline-variant flex items-center gap-1.5 cursor-pointer';
        }
      }
    });
  };

  // Add click handlers to pins
  zonePins.forEach(pId => {
    const el = document.getElementById(pId);
    if (el) {
      el.addEventListener('click', () => {
        const zoneKey = Object.keys(zoneData).find(k => zoneData[k].activePin === pId);
        if (zoneKey) switchZone(zoneKey);
      });
    }
  });
})();

// ============================================================================
// Tour Booking Engine (book_tour.html)
// ============================================================================
(function() {
  let selectedItinerary = 'General Campus & Academic Discovery';
  let selectedDate = 'Thu, 24 Oct 2025';
  let selectedTimeSlot = 'Morning Session (09:30 – 11:30 EAT)';
  let selectedDivision = 'Sixth Form IB Diploma';
  let selectedInterests = ['Biotech & Turing-Wangari STEAM', 'Boarding & Pastoral Life', 'Dean / Head of School Consultation'];

  const summaryElements = {
    itinerary: document.getElementById('summary-itinerary'),
    format: document.getElementById('summary-format'),
    date: document.getElementById('summary-date'),
    slot: document.getElementById('summary-slot'),
    division: document.getElementById('summary-division'),
    highlights: document.getElementById('summary-highlights'),
    parent: document.getElementById('summary-parent')
  };

  window.selectItinerary = function(name, el) {
    selectedItinerary = name;
    document.querySelectorAll('.itinerary-card').forEach(card => {
      card.classList.remove('border-primary', 'ring-2', 'ring-primary/10');
      card.classList.add('border-transparent');
      const checkIcon = card.querySelector('.material-symbols-outlined');
      if (checkIcon && checkIcon.textContent === 'check_circle') {
        checkIcon.textContent = 'radio_button_unchecked';
      }
    });
    el.classList.add('border-primary', 'ring-2', 'ring-primary/10');
    el.classList.remove('border-transparent');
    const checkIcon = el.querySelector('.material-symbols-outlined');
    if (checkIcon) checkIcon.textContent = 'check_circle';
    updateSummary();
  };

  window.selectDate = function(el, date) {
    selectedDate = date;
    document.querySelectorAll('.date-btn').forEach(btn => {
      btn.classList.remove('border-primary', 'bg-primary-container', 'text-surface');
      btn.classList.add('border-outline-variant/60', 'bg-surface');
    });
    el.classList.add('border-primary', 'bg-primary-container', 'text-surface');
    el.classList.remove('border-outline-variant/60', 'bg-surface');
    updateSummary();
  };

  window.selectDivision = function(el, division) {
    selectedDivision = division;
    document.querySelectorAll('.div-btn').forEach(btn => {
      btn.classList.remove('border-primary', 'bg-primary-container', 'text-surface');
      btn.classList.add('border-outline-variant/60', 'bg-surface', 'text-on-surface');
    });
    el.classList.add('border-primary', 'bg-primary-container', 'text-surface');
    el.classList.remove('border-outline-variant/60', 'bg-surface', 'text-on-surface');
    updateSummary();
  };

  window.updateSummary = function() {
    if (!summaryElements.itinerary) return;

    summaryElements.itinerary.textContent = selectedItinerary;
    summaryElements.format.textContent = document.querySelector('input[name="tour_format"]:checked')?.value || 'In-Person Private Tour';
    summaryElements.date.textContent = selectedDate;
    summaryElements.slot.textContent = document.querySelector('input[name="time_slot"]:checked')?.value || 'Morning Session (09:30 – 11:30 EAT)';
    summaryElements.division.textContent = selectedDivision;

    if (summaryElements.highlights) {
      summaryElements.highlights.innerHTML = selectedInterests.map(i => `
        <span class="text-[11px] bg-surface/10 px-2 py-0.5 rounded text-surface-variant">${i}</span>
      `).join('');
    }

    const parentName = document.getElementById('parent-name')?.value;
    const studentName = document.getElementById('student-name')?.value;
    if (parentName || studentName) {
      summaryElements.parent.textContent = `${parentName || 'Parent'} · ${studentName || 'Student'}`;
    }
  };

  // Interest pills
  document.querySelectorAll('#interest-pills input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const label = cb.closest('label');
      const value = cb.value;
      if (cb.checked) {
        selectedInterests.push(value);
        label.classList.add('border-primary', 'bg-primary-container', 'text-surface');
        label.classList.remove('border-outline-variant/60', 'bg-surface', 'text-on-surface');
      } else {
        selectedInterests = selectedInterests.filter(i => i !== value);
        label.classList.remove('border-primary', 'bg-primary-container', 'text-surface');
        label.classList.add('border-outline-variant/60', 'bg-surface', 'text-on-surface');
      }
      updateSummary();
    });
  });

  // Form inputs
  ['parent-name', 'student-name'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateSummary);
  });

  window.confirmBookingModal = function() {
    alert('Booking Confirmed!\n\nYour campus visit delegation has been scheduled.\n\nA confirmation email with diplomatic clearance badge and detailed itinerary will be sent within 15 minutes.\n\nWe look forward to welcoming you to the Karen Campus.');
  };
})();

// ============================================================================
// News Filter Buttons (news.html)
// ============================================================================
(function() {
  const filterButtons = document.querySelectorAll('.filter-btn, button[data-filter]');
  const storyCards = document.querySelectorAll('article[class*="bg-surface-container-lowest"]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || btn.textContent.trim().toLowerCase();

      filterButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-surface-bright');
        b.classList.add('bg-surface-container-highest/80', 'text-primary');
      });
      btn.classList.add('bg-primary', 'text-surface-bright');
      btn.classList.remove('bg-surface-container-highest/80', 'text-primary');

      storyCards.forEach(card => {
        const category = card.querySelector('[class*="uppercase"]')?.textContent?.toLowerCase() || '';
        if (filter === 'all dispatches' || category.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ============================================================================
// Newsletter Form (news.html)
// ============================================================================
(function() {
  const newsletterForm = document.querySelector('form[onsubmit]');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]')?.value;
      if (email) {
        alert(`Thank you for subscribing to The Karen Gazette!\n\n${email} has been added to our distribution list.\n\nYou will receive the next fortnightly dispatch.`);
        newsletterForm.reset();
      }
    });
  }
})();

// ============================================================================
// Intersection Observer for Scroll Animations
// ============================================================================
(function() {
  const animatedElements = document.querySelectorAll('.academic-card-hover, article[class*="group"], .itinerary-card, .calc-division-option, .calc-boarding-btn, .calc-schedule-btn');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();

// ============================================================================
// Image Lazy Loading Enhancement
// ============================================================================
(function() {
  const images = document.querySelectorAll('img[data-alt]');
  images.forEach(img => {
    img.loading = 'lazy';
    if (!img.alt && img.dataset.alt) {
      img.alt = img.dataset.alt;
    }
  });
})();

// ============================================================================
// Form Validation Enhancement
// ============================================================================
(function() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('border-error', 'focus:border-error');
          valid = false;
        } else {
          field.classList.remove('border-error', 'focus:border-error');
        }
      });

      if (!valid) {
        e.preventDefault();
        const firstInvalid = form.querySelector('[required]:invalid, [required][value=""]');
        firstInvalid?.focus();
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
})();

// ============================================================================
// Print Styles Enhancement
// ============================================================================
(function() {
  // Add print button functionality if needed
  window.printPage = function() {
    window.print();
  };
})();

// ============================================================================
// Performance: Defer non-critical scripts
// ============================================================================
(function() {
  // Add loading="lazy" to iframes
  document.querySelectorAll('iframe').forEach(iframe => {
    iframe.loading = 'lazy';
  });
})();

// ============================================================================
// Page Initialization: Wait for shared nav to load via fetch
// ============================================================================
(function() {
  var initCalled = false;

  function runInit() {
    if (initCalled) return;
    // Ensure nav elements exist (nav.html loaded via fetch)
    if (!document.getElementById('mobile-menu-btn')) return;
    initCalled = true;
    initNavigation();
    initActiveNav();
  }

  // Listen for custom event dispatched after nav.html fetch completes
  window.addEventListener('amaniNavLoaded', runInit);

  // Fallback: try on DOMContentLoaded in case nav was already loaded
  document.addEventListener('DOMContentLoaded', runInit);

  // Fallback: poll briefly in case neither fires
  var poll = setInterval(function() {
    if (document.getElementById('mobile-menu-btn')) {
      clearInterval(poll);
      runInit();
    }
  }, 100);
})();

console.log('Amani International Academy - Main JS loaded successfully');