/**
 * WORSHIP TOGETHER CENTER — Signup Page Logic (complete.js)
 * - Footer year
 * - Password strength meter
 * - Bootstrap popovers
 * - Gender buttons -> hidden input
 * - Religion -> Denomination dependency
 * - Theme switching (light/dark/auto)
 * - DOB selects with dynamic days
 * - Live field validation
 * - Photo preview
 * - Submit to backend (FormData + birthDate ISO)
 */

document.addEventListener('DOMContentLoaded', function () {
  // ==========================
  // Set Footer Year
  // ==========================
  const yearSpan = document.getElementById('currentYear2');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ==========================
  // Initialize Password Meter
  // ==========================
  if (typeof window.pswMeter !== 'undefined' && document.getElementById('password')) {
    window.pswMeter.init({
      id: '#password',
      height: 6,
      borderRadius: 4,
      pswMinLength: 8,
      showPasswordToggle: true,
      box: '#pswmeter',
      messageBox: '#pswmeter-message'
    });
  }

  // ==========================
  // Activate Bootstrap Popover
  // ==========================
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // ==========================
  // Handle Gender Button Click
  // ==========================
  const genderButtons = document.querySelectorAll('.gender-button');
  const genderInput = document.getElementById('genderInput'); // <input type="hidden" name="gender" id="genderInput">
  genderButtons.forEach(button => {
    button.addEventListener('click', function () {
      genderButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      if (genderInput) genderInput.value = this.getAttribute('data-gender') || '';
    });
  });

  // ==========================
  // Handle Religion and Denomination
  // ==========================
  const religionSelect = document.getElementById('religionSelect');       // name="religion"
  const denominationDiv = document.getElementById('denominationDiv');     // wrapper div (for show/hide)
  const denominationSelect = document.getElementById('denominationSelect'); // name="denomination"

  const denominations = {
    "Christianity": ["Catholic", "Protestant", "Eastern Orthodox", "Oriental Orthodox", "Anglican"],
    "Islam": ["Sunni", "Shia", "Sufism"],
    "Hinduism": ["Vaishnavism", "Shaivism", "Shaktism", "Smartism"],
    "Buddhism": ["Theravāda", "Mahāyāna", "Vajrayāna"],
    "Sikhism": ["Khalsa", "Namdhari", "Nirankari"],
    "Judaism": ["Orthodox", "Conservative", "Reform", "Reconstructionist"],
    "Baháʼí Faith": ["None (Single denomination)"],
    "Jainism": ["Digambara", "Śvētāmbara"],
    "Shinto": ["Shrine Shinto", "Sect Shinto"],
    "Taoism": ["Religious Taoism", "Philosophical Taoism"]
  };

  if (religionSelect && denominationDiv && denominationSelect) {
    religionSelect.addEventListener('change', function () {
      const religion = religionSelect.value;
      denominationSelect.innerHTML = '<option selected disabled value="">Select Denomination</option>';
      if (denominations[religion]) {
        denominations[religion].forEach(denomination => {
          const option = document.createElement('option');
          option.value = denomination;
          option.textContent = denomination;
          denominationSelect.appendChild(option);
        });
        denominationDiv.style.display = 'block';
      } else {
        denominationDiv.style.display = 'none';
        denominationSelect.value = '';
      }
    });
  }

  // ==========================
  // Handle Theme Switching
  // ==========================
  const storedTheme = localStorage.getItem('theme');
  const getPreferredTheme = () => {
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const setTheme = (theme) => {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  };
  setTheme(getPreferredTheme());

  const themeIconEl = document.querySelector('.theme-icon-active');
  if (themeIconEl) {
    const showActiveTheme = theme => {
      const activeThemeIcon = document.querySelector('.theme-icon-active use');
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
      if (!activeThemeIcon || !btnToActive) return;
      const svgOfActiveBtn = btnToActive.querySelector('.mode-switch use')?.getAttribute('href');
      document.querySelectorAll('[data-bs-theme-value]').forEach(element => element.classList.remove('active'));
      btnToActive.classList.add('active');
      if (svgOfActiveBtn) activeThemeIcon.setAttribute('href', svgOfActiveBtn);
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme());
      }
    });

    showActiveTheme(getPreferredTheme());

    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value');
        localStorage.setItem('theme', theme);
        setTheme(theme);
        showActiveTheme(theme);
      });
    });
  }

  // ==========================
  // Populate Years (last 100 years)
  // ==========================
  const yearSelect = document.getElementById('yearSelect');   // id="yearSelect"
  if (yearSelect) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 100; year--) {
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = String(year);
      yearSelect.appendChild(option);
    }
  }

  // ==========================
  // Wire updateDays to changes
  // ==========================
  const monthSelect = document.getElementById('monthSelect'); // id="monthSelect"
  const daySelect   = document.getElementById('daySelect');   // id="daySelect"
  if (monthSelect) monthSelect.addEventListener('change', updateDays);
  if (yearSelect)  yearSelect.addEventListener('change', updateDays);
  updateDays(); // Initial render

  // ==========================
  // Live Validation Setup
  // ==========================
  const emailInput = document.getElementById('email');                 // name="email"
  const phoneInput = document.getElementById('phoneNumber');           // name="phoneNumber"
  const passwordInput = document.getElementById('password');           // name="password"
  const confirmPasswordInput = document.getElementById('confirmPassword'); // name="confirmPassword"

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailInput.classList.toggle('is-invalid', !emailRegex.test(emailInput.value));
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const phoneRegex = /^[0-9]{10,15}$/;
      phoneInput.classList.toggle('is-invalid', !phoneRegex.test(phoneInput.value));
    });
  }

  if (passwordInput && confirmPasswordInput) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;
    const validatePasswords = () => {
      passwordInput.classList.toggle('is-invalid', !strongPasswordRegex.test(passwordInput.value));
      confirmPasswordInput.classList.toggle(
        'is-invalid',
        passwordInput.value !== confirmPasswordInput.value || confirmPasswordInput.value === ''
      );
    };
    passwordInput.addEventListener('input', validatePasswords);
    confirmPasswordInput.addEventListener('input', validatePasswords);
  }

  // ==========================
  // Handle Photo Preview
  // ==========================
  const photoInput = document.getElementById('photoInput'); // name="photo"
  if (photoInput) {
    photoInput.addEventListener('change', function (e) {
      const file = e.target.files?.[0];
      const preview = document.getElementById('photoPreview');
      if (!preview) return;

      if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none';
        preview.src = '';
      }
    });
  }

  // ==========================
  // Form Submit Validation + Backend Submit
  // ==========================
  const form = document.getElementById('signupForm'); // <form id="signupForm" enctype="multipart/form-data">

  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      event.stopPropagation();

      // Update these if your HTML uses different names/ids
      const requiredByNameOrId = [
        'name',              // <input name="name" id="name">
        'lastName',          // <input name="lastName" id="lastName">
        'email',             // <input name="email" id="email">
        'password',          // <input name="password" id="password">
        'confirmPassword'    // <input name="confirmPassword" id="confirmPassword">
      ];

      let formIsValid = true;

      // Validate required inputs by name or id
      requiredByNameOrId.forEach(key => {
        const el = document.getElementsByName(key)[0] || document.getElementById(key);
        if (!el || !String(el.value || '').trim()) {
          if (el) el.classList.add('is-invalid');
          formIsValid = false;
        } else {
          el.classList.remove('is-invalid');
        }
      });

      // Validate DOB selects
      const monthOK = !!monthSelect?.value;
      const dayOK   = !!daySelect?.value;
      const yearOK  = !!yearSelect?.value;
      if (!monthOK || !dayOK || !yearOK) {
        [monthSelect, daySelect, yearSelect].forEach(el => el && el.classList.add('is-invalid'));
        formIsValid = false;
      } else {
        [monthSelect, daySelect, yearSelect].forEach(el => el && el.classList.remove('is-invalid'));
      }

      // Use live validators
      if (emailInput?.classList.contains('is-invalid') ||
          passwordInput?.classList.contains('is-invalid') ||
          confirmPasswordInput?.classList.contains('is-invalid')) {
        formIsValid = false;
      }

      if (!formIsValid) {
        console.warn('⚠️ Form validation failed.');
        return;
      }

      // Build ISO birthDate (YYYY-MM-DD)
      const yyyy = yearSelect.value;
      const mm   = String(monthSelect.value).padStart(2, '0');
      const dd   = String(daySelect.value).padStart(2, '0');
      const isoBirthDate = `${yyyy}-${mm}-${dd}`;

      // Prepare FormData (supports file upload)
      const formData = new FormData(form);

      // Normalize DOB field for backend (change key to 'dob' if your API expects that)
      formData.set('birthDate', isoBirthDate);

      // Ensure religion/denomination/gender have proper name attributes in HTML
      // (religionSelect name="religion"; denominationSelect name="denomination"; genderInput name="gender")
      const API_BASE = 'http://127.0.0.1:5500'; // your Node server

      console.log('📤 Submitting form to backend...');
      try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          credentials: 'include',      // important if backend sets cookies
          body: formData               // keep FormData if you plan file upload
        });
        

        const text = await res.text();
        let payload;
        try { payload = JSON.parse(text); } catch { payload = text; }

        if (!res.ok) {
          console.error('❌ Registration failed:', payload);
          const message = typeof payload === 'string'
            ? payload
            : (payload?.message || `Registration failed (HTTP ${res.status})`);
          alert(message);
          return;
        }

        console.log('✅ Registered:', payload);
        window.location.href = 'my-profile.html';
      } catch (error) {
        console.error('❌ Network error:', error);
        alert('Network error connecting to server. Make sure your backend is running and CORS allows this origin.');
      }
    });
  } else {
    console.error('❌ signupForm not found in DOM');
  }
});

/* ==========================
 * Update Days Based on Month and Year
 * ========================== */
function updateDays() {
  const monthEl = document.getElementById('monthSelect');
  const yearEl  = document.getElementById('yearSelect');
  const dayEl   = document.getElementById('daySelect');

  if (!dayEl) return;

  const month = parseInt(monthEl?.value);
  const year  = parseInt(yearEl?.value) || new Date().getFullYear();

  // Reset if month/year missing
  if (!month) {
    dayEl.innerHTML = '<option selected disabled value="">Day</option>';
    for (let d = 1; d <= 31; d++) {
      const opt = document.createElement('option');
      opt.value = String(d);
      opt.textContent = String(d);
      dayEl.appendChild(opt);
    }
    return;
  }

  let daysInMonth = 31;
  if (month === 2) {
    daysInMonth = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    daysInMonth = 30;
  }

  const prevValue = dayEl.value;
  dayEl.innerHTML = '<option selected disabled value="">Day</option>';
  for (let d = 1; d <= daysInMonth; d++) {
    const opt = document.createElement('option');
    opt.value = String(d);
    opt.textContent = String(d);
    dayEl.appendChild(opt);
  }
  // Try to preserve previously selected day if still valid
  if (prevValue && Number(prevValue) <= daysInMonth) {
    dayEl.value = prevValue;
  }
}
