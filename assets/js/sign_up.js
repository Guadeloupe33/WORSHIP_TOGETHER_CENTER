
		// Handle Theme Switching
const storedTheme = localStorage.getItem('theme');

const getPreferredTheme = () => {
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'light';
};

const setTheme = (theme) => {
  if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
};

setTheme(getPreferredTheme());

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

  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Religion denominations
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

// Show the form based on type (personal or organization)
function showForm(type) {
  const form = document.getElementById('dynamicFormContent');
  form.innerHTML = ''; // clear

  document.getElementById('signupForm').style.display = 'block';

  if (type === 'personal') {
    form.innerHTML = `
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="First Name" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="Last Name" required>
      </div>
      <div class="mb-3 input-group">
        <select class="form-select" required>
          <option selected disabled>Month</option>
          <option>January</option><option>February</option><option>March</option>
          <option>April</option><option>May</option><option>June</option>
          <option>July</option><option>August</option><option>September</option>
          <option>October</option><option>November</option><option>December</option>
        </select>
        <select class="form-select" required>
          <option selected disabled>Day</option>
          ${Array.from({length: 31}, (_, i) => `<option>${i + 1}</option>`).join('')}
        </select>
        <select class="form-select" required id="yearSelect"></select>
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
  } else if (type === 'organization') {
    form.innerHTML = `
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="Organization Name" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="text" class="form-control" placeholder="Organization Address" required>
      </div>
      <div class="mb-3 input-group-lg">
        <input type="email" class="form-control" placeholder="Email" id="email" required>
      </div>
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

  // Add password fields (always)
  form.innerHTML += `
    <div class="mb-3 input-group-lg">
      <input type="password" id="password" class="form-control" placeholder="Enter Password" required>
    </div>
    <div class="mb-3 input-group-lg">
      <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm Password" required>
    </div>
    <div class="d-grid">
      <button type="submit" class="btn btn-lg btn-primary" style="background-color: #6d63bc;">Sign me up</button>
    </div>
    <p class="mb-0 mt-3">©<span id="currentYear"></span> 
      <a target="_blank" href="https://www.Worshiptogethercenter.com">WORSHIP TOGETHER CENTER.</a> 
      All rights reserved
    </p>
  `;

  if (type === 'personal') {
    populateYears();
  }
}

// Denomination Dropdown
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

// Handle Gender Selection
function selectGender(gender) {
  document.getElementById('genderInput').value = gender;
}

// Handle Tax ID (501c3)
function showTaxId(answer) {
  document.getElementById('is501c3').value = answer;
  const taxIdDiv = document.getElementById('taxIdDiv');
  taxIdDiv.style.display = (answer === 'yes') ? 'block' : 'none';
}

// Populate Year Dropdown
function populateYears() {
  const yearSelect = document.getElementById('yearSelect');
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 100; y--) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }
}

// Form Validation
function validateForm(event) {
  event.preventDefault(); // Stop normal form submit

  const form = document.getElementById('dynamicFormContent');
  const inputs = form.querySelectorAll('input, select');
  let missingFields = [];

  inputs.forEach(input => {
    if (input.hasAttribute('required')) {
      if (input.tagName === "SELECT") {
        // For SELECT, check if the user picked a valid option (not disabled)
        if (input.selectedIndex === 0 || input.options[input.selectedIndex].disabled) {
          const label = input.previousElementSibling?.innerText || input.name || "Unknown field";
          missingFields.push(label);
        }
      } else if (!input.value.trim()) {
        const placeholder = input.placeholder || input.name || "Unknown field";
        missingFields.push(placeholder);
      }
    }
  });

  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  const password = passwordInput?.value.trim();
  const confirmPassword = confirmPasswordInput?.value.trim();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

  if (!passwordRegex.test(password)) {
    alert("Password must be at least 8 characters long and include:\n- One uppercase letter\n- One lowercase letter\n- One number\n- One special character (@, $, !, %, *, ?, &, #, ^)");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please confirm your password.");
    return;
  }

  if (missingFields.length > 0) {
    alert("Please complete the following fields:\n\n" + missingFields.join("\n"));
    return;
  }

  console.log("Form is valid! Submitting...");
  form.submit(); // Submit only if all fields are good
}


	
