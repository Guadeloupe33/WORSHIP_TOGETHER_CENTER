// ==========================
// Handle Theme Switching
// ==========================
// [This part already exists in your file, leave it as is ✅]

// ==========================
// Religion Denominations
// ==========================
// [This part already exists too ✅]

// ==========================
// Populate Denominations
// ==========================
function populateDenominations() {
  const religion = document.getElementById('religionSelect')?.value;
  const denominationDiv = document.getElementById('denominationDiv');
  const denominationSelect = document.getElementById('denominationSelect');

  if (!religion || !denominationDiv || !denominationSelect) return;

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
// Select Gender
// ==========================
function selectGender(gender) {
  const genderInput = document.getElementById('genderInput');
  if (!genderInput) return;

  genderInput.value = gender;

  const buttons = document.querySelectorAll('.custom-button');
  buttons.forEach(button => button.classList.remove('active-gender'));

  const selectedButton = Array.from(buttons).find(btn => btn.textContent.trim() === gender);
  selectedButton?.classList.add('active-gender');
}

// ==========================
// Populate Year Dropdown
// ==========================
function populateYears() {
  const yearSelect = document.getElementById('yearSelect');
  if (!yearSelect) return;

  const currentYear = new Date().getFullYear();
  yearSelect.innerHTML = '<option selected disabled>Year</option>'; // reset first
  for (let year = currentYear; year >= currentYear - 100; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

// ==========================
// Show Form (Personal or Organization)
// ==========================
function showForm(type) {
  const form = document.getElementById('dynamicFormContent');
  form.innerHTML = '';
  document.getElementById('signupForm').style.display = 'block';

  const accountButtons = document.querySelectorAll('.account-type-button');
  accountButtons.forEach(button => button.classList.remove('active-account'));

  const activeButton = document.getElementById(`${type}Button`);
  if (activeButton) {
    activeButton.classList.add('active-account');
  }

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
        <input type="text" id="taxIdInput" class="form-control" placeholder="Tax ID Number">
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
      <button type="submit" class="btn btn-lg btn-primary" onclick="validateForm(event)">Sign me up</button>
    </div>
    <p class="mb-0 mt-3">©<span id="currentYear"></span> <a href="https://www.Worshiptogethercenter.com" target="_blank">WORSHIP TOGETHER CENTER.</a> All rights reserved.</p>
  `;

  populateYears();
  setupLiveValidation();
}






function showTaxId(answer) {
  const taxIdDiv = document.getElementById('taxIdDiv');
  const is501c3Input = document.getElementById('is501c3');

  if (!taxIdDiv || !is501c3Input) return;

  is501c3Input.value = answer;

  if (answer === 'yes') {
    taxIdDiv.style.display = 'block';
  } else {
    taxIdDiv.style.display = 'none';
  }
}


// ==========================
// Validate Form
// ==========================
function validateForm(event) {
  event.preventDefault();

  const formData = collectUserData();
  console.log('User data ready for backend:', formData);





// ==========================
// Setup Live Validation
// ==========================
function setupLiveValidation() {
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
      } else {
        emailInput.classList.remove('is-invalid');
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(phoneInput.value)) {
        phoneInput.classList.add('is-invalid');
      } else {
        phoneInput.classList.remove('is-invalid');
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
      if (!passwordRegex.test(passwordInput.value)) {
        passwordInput.classList.add('is-invalid');
      } else {
        passwordInput.classList.remove('is-invalid');
      }
    });
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.classList.add('is-invalid');
      } else {
        confirmPasswordInput.classList.remove('is-invalid');
      }
    });
  }
}




  // Later: Here you will send it to your server/database
  alert('Form is valid! Ready to submit 🚀');
}

// ==========================
// Collect User Data
// ==========================
function collectUserData() {
  const data = {};

  data.firstName = document.querySelector('input[placeholder="First Name"]')?.value.trim() || '';
  data.lastName = document.querySelector('input[placeholder="Last Name"]')?.value.trim() || '';
  data.email = document.getElementById('email')?.value.trim() || '';
  data.phone = document.getElementById('phone')?.value.trim() || '';
  data.password = document.getElementById('password')?.value.trim() || '';
  data.accountType = document.querySelector('.active-account')?.id?.includes('personal') ? 'personal' : 'organization';

  if (data.accountType === 'personal') {
    data.birthMonth = document.getElementById('monthSelect')?.value || '';
    data.birthDay = document.getElementById('daySelect')?.value || '';
    data.birthYear = document.getElementById('yearSelect')?.value || '';
    data.gender = document.getElementById('genderInput')?.value || '';
    data.religion = document.getElementById('religionSelect')?.value || '';
    data.denomination = document.getElementById('denominationSelect')?.value || '';
  } else if (data.accountType === 'organization') {
    data.organizationName = document.querySelector('input[placeholder="Organization Name"]')?.value.trim() || '';
    data.organizationAddress = document.querySelector('input[placeholder="Organization Address"]')?.value.trim() || '';
    data.is501c3 = document.getElementById('is501c3')?.value || '';
    data.taxId = document.getElementById('taxIdInput')?.value.trim() || '';
  }

  return data;
}
