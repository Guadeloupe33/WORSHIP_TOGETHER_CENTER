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
  // Default to light if no preference
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

  if (el !== undefined && el !== null) {
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
  
      <!-- ✅ Add Email field here -->
      <div class="mb-3 input-group-lg">
        <input type="email" class="form-control" placeholder="Email" required>
      </div>
  
      <!-- ✅ Add Phone Number field here -->
      <div class="mb-3 input-group-lg">
        <input type="tel" class="form-control" placeholder="Phone Number" required>
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
  }
  
  
  
  
  
  
  
  
  
  else if (type === 'organization') {
    form.innerHTML = `
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="Organization Name" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="Organization Address" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="email" class="form-control" placeholder="Email" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="tel" class="form-control" placeholder="Phone Number" required>
      </div>
  
      <!-- ✅ 501(c)(3) Question -->
      <div class="mb-3 text-center">
        <label class="form-label d-block">Is your organization a 501(c)(3)?</label>
        <div class="d-flex justify-content-center gap-3 mt-2">
          <button type="button" class="btn btn-primary custom-button" onclick="showTaxId('yes')">Yes</button>
          <button type="button" class="btn btn-primary custom-button" onclick="showTaxId('no')">No</button>
        </div>
        <input type="hidden" id="is501c3" name="is501c3" required>
      </div>
  
      <!-- ✅ Hidden Tax ID Field (only shows if they click Yes) -->
      <div class="mb-3 input-group-lg" id="taxIdDiv" style="display:none;">
        <input type="text" class="form-control" placeholder="Enter Tax ID Number" id="taxIdInput">
      </div>
    `;
  }
  

  // Always add password fields and footer
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
    <p class="mb-0 mt-3">©<span id="currentYear"></span> 
      <a target="_blank" href="https://www.Worshiptogethercenter.com">WORSHIP TOGETHER CENTER.</a> All rights reserved
    </p>
  `;

  // Populate year dropdown if personal
  if (type === 'personal') {
    populateYears();
  }

  // 💥 Reset the footer year after inserting form
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
}

// ==========================
// Populate Denomination Options
// ==========================

function populateDenominations() {
  const religion = document.getElementById('religionSelect').value;
  const denominationDiv = document.getElementById('denominationDiv');
  const denominationSelect = document.getElementById('denominationSelect');

  denominationSelect.innerHTML = '<option selected disabled>Select Denomination</option>';

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
  }
}

// ==========================
// Highlight Selected Gender
// ==========================

function selectGender(gender) {
  document.getElementById('genderInput').value = gender;

  const buttons = document.querySelectorAll('.custom-button');
  buttons.forEach(button => button.classList.remove('active-gender'));

  const selectedButton = Array.from(buttons).find(btn => btn.textContent.trim() === gender);
  if (selectedButton) {
    selectedButton.classList.add('active-gender');
  }
}

// ==========================
// Populate Year Dropdown
// ==========================

function populateYears() {
  const yearSelect = document.getElementById('yearSelect');
  if (!yearSelect) {
    console.error('populateYears: yearSelect not found.');
    return;
  }

  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 100; y--) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }
}

// ==========================
// Validate Form
// ==========================

// ==========================
// Validate Form
// ==========================

function validateForm(event) {
  event.preventDefault();

  const form = document.getElementById('dynamicFormContent');
  const inputs = form.querySelectorAll('input, select');
  let missingFields = [];

  // Birthday fields
  const monthSelect = document.getElementById('monthSelect');
  const daySelect = document.getElementById('daySelect');
  const yearSelect = document.getElementById('yearSelect');

  if (monthSelect && monthSelect.selectedIndex === 0) missingFields.push('Month');
  if (daySelect && daySelect.selectedIndex === 0) missingFields.push('Day');
  if (yearSelect && yearSelect.selectedIndex === 0) missingFields.push('Year');

  // Check all other required inputs
  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value.trim()) {
      const placeholder = input.placeholder || input.name || "Unknown field";
      missingFields.push(placeholder);
    }
  });

  // Validate Email Format
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
  }

  // Validate Phone Number Format
  const phoneInput = form.querySelector('input[type="tel"]');
  if (phoneInput) {
    const phone = phoneInput.value.trim();
    const phoneRegex = /^[0-9]{10,15}$/; // Only digits, 10-15 characters
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number (numbers only, 10 to 15 digits).");
      return;
    }
  }

  // Validate Password
  const password = document.getElementById('password')?.value.trim();
  const confirmPassword = document.getElementById('confirmPassword')?.value.trim();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

  if (!passwordRegex.test(password)) {
    alert("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (missingFields.length > 0) {
    alert("Please complete the following fields:\n\n" + missingFields.join("\n"));
    return;
  }

  console.log("Form is valid! Submitting...");
  form.submit();
}
function showTaxId(answer) {
  document.getElementById('is501c3').value = answer;
  const taxIdDiv = document.getElementById('taxIdDiv');
  
  if (answer === 'yes') {
    taxIdDiv.style.display = 'block';
  } else {
    taxIdDiv.style.display = 'none';
  }
}

