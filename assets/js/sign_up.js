// ==========================
// Handle Theme Switching
// ==========================

// Get the saved theme from localStorage
const storedTheme = localStorage.getItem('theme');

// Determine the preferred theme (light/dark)
const getPreferredTheme = () => {
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'light';
};

// Set the theme on the page
const setTheme = (theme) => {
  if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
};

// Apply theme immediately
setTheme(getPreferredTheme());

// Setup theme and footer year after page loads
window.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.theme-icon-active');

  if (el) {
    const showActiveTheme = (theme) => {
      const activeThemeIcon = document.querySelector('.theme-icon-active use');
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
      const svgOfActiveBtn = btnToActive.querySelector('.mode-switch use').getAttribute('href');

      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active');
      });

      btnToActive.classList.add('active');
      activeThemeIcon.setAttribute('href', svgOfActiveBtn);
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

  // Set the current year in the footer
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});

// ==========================
// Religion Denominations
// ==========================

const denominations = {
  Christianity: ["Catholic", "Protestant", "Orthodox", "Baptist", "Methodist", "Anglican", "Pentecostal"],
  Islam: ["Sunni", "Shia", "Sufism"],
  Hinduism: ["Shaivism", "Vaishnavism", "Shaktism", "Smartism"],
  Buddhism: ["Theravāda", "Mahāyāna", "Vajrayāna"],
  Sikhism: ["Khalsa", "Nirankari"],
  Judaism: ["Orthodox", "Conservative", "Reform", "Reconstructionist"],
  Bahai: ["Baháʼí"],
  Jainism: ["Digambara", "Śvētāmbara"],
  Shinto: ["Shrine Shinto", "Sect Shinto"],
  Taoism: ["Religious Taoism", "Philosophical Taoism"]
};

// ==========================
// Show Form (Personal or Organization)
// ==========================

function showForm(type) {
  const form = document.getElementById('dynamicFormContent');
  form.innerHTML = '';
  document.getElementById('signupForm').style.display = 'block';

  // Highlight selected account type button
  const accountButtons = document.querySelectorAll('.account-type-button');
  accountButtons.forEach(button => button.classList.remove('active-account'));

  const activeButton = document.getElementById(`${type}Button`);
  if (activeButton) {
    activeButton.classList.add('active-account');
  }

  // Build form HTML
  if (type === 'personal') {
    form.innerHTML = `
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="First Name" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="Last Name" required>
      </div>
      <div class="mb-3 input-group">
        <select class="form-select" id="monthSelect" required>
          <option selected disabled>Month</option>
          <option>January</option><option>February</option><option>March</option>
          <option>April</option><option>May</option><option>June</option>
          <option>July</option><option>August</option><option>September</option>
          <option>October</option><option>November</option><option>December</option>
        </select>
        <select class="form-select" id="daySelect" required>
          <option selected disabled>Day</option>
          ${Array.from({ length: 31 }, (_, i) => `<option>${i + 1}</option>`).join('')}
        </select>
        <select class="form-select" id="yearSelect" required></select>
      </div>
      <div class="mb-3 text-center">
        <label class="form-label d-block">Gender</label>
        <div class="d-flex justify-content-center gap-3 mt-2">
          <button type="button" class="btn btn-primary custom-button" onclick="selectGender('Female')">Female</button>
          <button type="button" class="btn btn-primary custom-button" onclick="selectGender('Male')">Male</button>
          <button type="button" class="btn btn-primary custom-button" onclick="selectGender('Custom')">Custom</button>
        </div>
        <input type="hidden" id="genderInput" name="gender" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="email" id="email" class="form-control" placeholder="Email" required>
        <div class="invalid-feedback" id="emailError"></div>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="tel" id="phone" class="form-control" placeholder="Phone Number" required>
        <div class="invalid-feedback" id="phoneError"></div>
      </div>
      <div class="mb-3">
        <select class="form-select" id="religionSelect" onchange="populateDenominations()" required>
          <option selected disabled>Select Religion</option>
          <option value="Christianity">Christianity</option>
          <option value="Islam">Islam</option>
          <option value="Hinduism">Hinduism</option>
          <option value="Buddhism">Buddhism</option>
          <option value="Sikhism">Sikhism</option>
          <option value="Judaism">Judaism</option>
          <option value="Bahai">Baháʼí Faith</option>
          <option value="Jainism">Jainism</option>
          <option value="Shinto">Shinto</option>
          <option value="Taoism">Taoism</option>
        </select>
      </div>
      <div class="mb-3" id="denominationDiv" style="display:none;">
        <select class="form-select" id="denominationSelect" required>
          <option selected disabled>Select Denomination</option>
        </select>
      </div>
    `;
    if (type === 'personal') {
      function populateYears() {
        const yearSelect = document.getElementById('yearSelect');
        if (!yearSelect) return;
      
        yearSelect.innerHTML = '<option selected disabled>Year</option>'; // 💥 clear it first
      
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 100; year--) {
          const option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          yearSelect.appendChild(option);
        }
      }
      ;
    }
  } else if (type === 'organization') {
    form.innerHTML = `
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="Organization Name" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="Organization Address" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="email" id="email" class="form-control" placeholder="Email" required>
        <div class="invalid-feedback" id="emailError"></div>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="tel" id="phone" class="form-control" placeholder="Phone Number" required>
        <div class="invalid-feedback" id="phoneError"></div>
      </div>
      <div class="mb-3 text-center">
        <label class="form-label d-block">Is your organization a 501(c)(3)?</label>
        <div class="d-flex justify-content-center gap-3 mt-2">
          <button type="button" class="btn btn-primary custom-button" onclick="showTaxId('yes')">Yes</button>
          <button type="button" class="btn btn-primary custom-button" onclick="showTaxId('no')">No</button>
        </div>
        <input type="hidden" id="is501c3" name="is501c3" required>
      </div>
      <div class="mb-3 input-group-lg" id="taxIdDiv" style="display:none;">
        <input type="text" class="form-control" placeholder="Enter Tax ID Number" id="taxIdInput">
      </div>
    `;
  }

  form.innerHTML += `
    <div class="mb-3 input-group-lg">
      <input type="password" id="password" class="form-control" placeholder="Enter Password" required>
    </div>
    <div class="mb-3 input-group-lg">
      <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm Password" required>
    </div>
    <div class="d-grid">
      <button type="submit" class="btn btn-lg btn-primary" style="background-color: #6d63bc;" onclick="validateForm(event)">Sign me up</button>
    </div>
    <p class="mb-0 mt-3">©<span id="currentYear"></span> <a target="_blank" href="https://www.Worshiptogethercenter.com">WORSHIP TOGETHER CENTER.</a> All rights reserved</p>
  `;

  if (type === 'personal') {
    populateYears();
  }

  // Reset year again
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  setupLiveValidation();
}

// ==========================
// Setup Live Validation (Email + Phone)
// ==========================
function setupLiveValidation() {
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phoneError');

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        emailError.textContent = 'Invalid email format.';
      } else {
        emailInput.classList.remove('is-invalid');
        emailError.textContent = '';
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(phoneInput.value)) {
        phoneInput.classList.add('is-invalid');
        phoneError.textContent = 'Phone must be 10-15 digits.';
      } else {
        phoneInput.classList.remove('is-invalid');
        phoneError.textContent = '';
      }
    });
  }
}