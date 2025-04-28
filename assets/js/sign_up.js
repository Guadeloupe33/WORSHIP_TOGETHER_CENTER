document.addEventListener('DOMContentLoaded', function() {

    // ==========================
    // Set Footer Year
    // ==========================
    const yearSpan = document.getElementById('currentYear2');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
    // Activate Bootstrap popover
const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});


// Handle Gender Button Click
const genderButtons = document.querySelectorAll('.gender-button');
const genderInput = document.getElementById('genderInput');

genderButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Remove active from all gender buttons
    genderButtons.forEach(btn => btn.classList.remove('active'));

    // Add active to clicked button
    this.classList.add('active');

    // Set hidden input value
    if (genderInput) {
      genderInput.value = this.getAttribute('data-gender');
    }
  });
});

// Handle Religion Dropdown Change
const religionSelect = document.getElementById('religionSelect');
const denominationDiv = document.getElementById('denominationDiv');
const denominationSelect = document.getElementById('denominationSelect');

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

if (religionSelect) {
  religionSelect.addEventListener('change', function() {
    const religion = religionSelect.value;

    denominationSelect.innerHTML = '<option selected disabled>Select Denomination</option>';

    if (denominations[religion]) {
      denominations[religion].forEach(denomination => {
        const option = document.createElement('option');
        option.value = denomination;
        option.textContent = denomination;
        denominationSelect.appendChild(option);
      });
      denominationDiv.style.display = 'block'; // Show denomination box
    } else {
      denominationDiv.style.display = 'none'; // Hide if no options
    }
  });
}

  
    // ==========================
    // Handle Theme Switching
    // ==========================
    const storedTheme = localStorage.getItem('theme');
  
    const getPreferredTheme = () => {
      if (storedTheme) return storedTheme;
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
  
    const el = document.querySelector('.theme-icon-active');
    if (el) {
      const showActiveTheme = theme => {
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
  
    // ==========================
    // Populate Years
    // ==========================
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= currentYear - 100; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      }
    }
    updateDays(); // Call once on load
  
    // ==========================
    // Live Validation Setup
    // ==========================
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phoneNumber');
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
  
    if (passwordInput && confirmPasswordInput) {
      passwordInput.addEventListener('input', validatePasswords);
      confirmPasswordInput.addEventListener('input', validatePasswords);
    }
  
    function validatePasswords() {
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;
  
      // Check password strength
      if (!strongPasswordRegex.test(passwordInput.value)) {
        passwordInput.classList.add('is-invalid');
      } else {
        passwordInput.classList.remove('is-invalid');
      }
  
      // Check passwords match
      if (passwordInput.value !== confirmPasswordInput.value || confirmPasswordInput.value === '') {
        confirmPasswordInput.classList.add('is-invalid');
      } else {
        confirmPasswordInput.classList.remove('is-invalid');
      }
    }
  
    // ==========================
    // Form Submit Validation
    // ==========================
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', function(event) {
        const firstName = document.querySelector('input[placeholder="First Name"]');
        const lastName = document.querySelector('input[placeholder="Last Name"]');
        const month = document.getElementById('monthSelect');
        const day = document.getElementById('daySelect');
        const year = document.getElementById('yearSelect');
  
        let formIsValid = true;
  
        if (!firstName.value.trim()) {
          firstName.classList.add('is-invalid');
          formIsValid = false;
        } else {
          firstName.classList.remove('is-invalid');
        }
  
        if (!lastName.value.trim()) {
          lastName.classList.add('is-invalid');
          formIsValid = false;
        } else {
          lastName.classList.remove('is-invalid');
        }
  
        if (!month.value || !day.value || !year.value) {
          month.classList.add('is-invalid');
          day.classList.add('is-invalid');
          year.classList.add('is-invalid');
          formIsValid = false;
        } else {
          month.classList.remove('is-invalid');
          day.classList.remove('is-invalid');
          year.classList.remove('is-invalid');
        }
  
        if (!formIsValid) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    }
  
  });
  
  // ==========================
  // Update Days Based on Month and Year
  // ==========================
  function updateDays() {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearSelect').value) || new Date().getFullYear();
    const daySelect = document.getElementById('daySelect');
  
    if (!month || !daySelect) {
      daySelect.innerHTML = '<option selected disabled>Day</option>';
      for (let day = 1; day <= 31; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        daySelect.appendChild(option);
      }
      return;
    }
  
    let daysInMonth = 31;
    if (month === 2) {
      daysInMonth = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(month)) {
      daysInMonth = 30;
    }
  
    daySelect.innerHTML = '<option selected disabled>Day</option>';
    for (let day = 1; day <= daysInMonth; day++) {
      const option = document.createElement('option');
      option.value = day;
      option.textContent = day;
      daySelect.appendChild(option);
    }
  }
  