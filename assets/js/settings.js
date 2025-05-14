document.addEventListener('DOMContentLoaded', function () {
  // ==========================
  // Set Footer Year
  // ==========================
  const yearSpan = document.getElementById('currentYear2');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ==========================
  // Theme Handling
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

  const showActiveTheme = (theme) => {
    const activeThemeIcon = document.querySelector('.theme-icon-active use');
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`); // Find the button to activate

    if (btnToActive && activeThemeIcon) {
      const svgOfActiveBtn = btnToActive.querySelector('.mode-switch use')?.getAttribute('href');
      document.querySelectorAll('[data-bs-theme-value]').forEach(el => el.classList.remove('active'));
      btnToActive.classList.add('active');
      if (svgOfActiveBtn) activeThemeIcon.setAttribute('href', svgOfActiveBtn);
    }
  };

  setTheme(getPreferredTheme());
  showActiveTheme(getPreferredTheme());

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const preferred = getPreferredTheme();
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(preferred);
      showActiveTheme(preferred);
    }
  });

  document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const theme = toggle.getAttribute('data-bs-theme-value');
      localStorage.setItem('theme', theme);
      setTheme(theme);
      showActiveTheme(theme);
    });
  });

  // ==========================
  // Profile Photo Logic
  // ==========================
  const token = localStorage.getItem('token');
  const currentPhotoEl = document.getElementById('currentProfilePhoto');
  const previewPhotoEl = document.getElementById('previewPhoto');
  const newPhotoInput = document.getElementById('newPhoto');

  if (token && currentPhotoEl) {
    fetch('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`   

      }
    })
    .then(res => res.json())
    .then(user => {
      if (user.photo) {
        currentPhotoEl.src = user.photo.startsWith('http')
          ? user.photo
          : `/uploads/${user.photo}`;
      }
      
    })
    .catch(err => console.error('Failed to load profile photo:', err));
  }

  if (newPhotoInput) {
    newPhotoInput.addEventListener('change', () => {
      const file = newPhotoInput.files[0];
      if (file && previewPhotoEl) {
        previewPhotoEl.src = URL.createObjectURL(file);
        previewPhotoEl.style.display = 'block';
      } else if (previewPhotoEl) {
        previewPhotoEl.style.display = 'none';
      }
    });

    newPhotoInput.addEventListener('change', async () => {
      const file = newPhotoInput.files[0];
      if (!file || !token) return;

      const formData = new FormData();
      formData.append('photo', file);

      try {
        const res = await fetch('/api/profile/upload-photo', {
          method: 'POST',
          headers: { Authorization: `Bearer \${token}` },
          body: formData
        });

        const data = await res.json();
        if (data.photoUrl) {
          currentPhotoEl.src = data.photoUrl;
          previewPhotoEl.style.display = 'none';
          alert('✅ Profile photo updated!');
        }
      } catch (err) {
        console.error('Upload failed:', err);
        alert('❌ Upload failed. Try again.');
      }
    });
  }

  // ==========================
  // Populate Denominations
  // ==========================
  const denominations = {
    Christianity: ['Catholic', 'Protestant', 'Eastern Orthodox', 'Anglican', 'Evangelical'],
    Islam: ['Sunni', 'Shia', 'Sufi', 'Ahmadiyya'],
    Hinduism: ['Shaivism', 'Vaishnavism', 'Shaktism', 'Smartism'],
    Buddhism: ['Theravada', 'Mahayana', 'Vajrayana'],
    Sikhism: ['Khalsa', 'Nanakpanthi'],
    Judaism: ['Orthodox', 'Conservative', 'Reform', 'Hasidic'],
    Taoism: ['Religious Taoism', 'Philosophical Taoism'],
    Bahai: ['Bahá\'í'],
    Jainism: ['Digambara', 'Svetambara'],
    Shinto: ['Shinto'],
    Other: ['Other']
  };

  const religionSelect = document.getElementById('religionSelect');
  const denominationSelect = document.getElementById('denominationSelect');

  if (religionSelect && denominationSelect) {
    religionSelect.addEventListener('change', function () {
      const selectedReligion = religionSelect.value;
      const options = denominations[selectedReligion] || [];
      denominationSelect.innerHTML = '<option selected disabled>Select Denomination</option>';
      options.forEach(denom => {
        const option = document.createElement('option');
        option.value = denom;
        option.textContent = denom;
        denominationSelect.appendChild(option);
      });
    });
  }

  // ==========================
  // Form Validation
  // ==========================
  document.getElementById('profileForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const emailInputs = document.querySelectorAll('.email-input');
    const phoneInputs = document.querySelectorAll('.phone-input');
    let valid = true;

    emailInputs.forEach(emailInput => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        valid = false;
      } else {
        emailInput.classList.remove('is-invalid');
      }
    });

    phoneInputs.forEach(input => {
      if (!/^[\d\s\-()+]{7,}$/.test(input.value)) {
        input.classList.add('is-invalid');
        valid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (valid) {
      alert('Profile updated locally. (Backend integration needed to persist changes.)');
    }
  });

  // ==========================
  // Add/Remove Phone & Email
  // ==========================
  document.getElementById('addPhoneBtn')?.addEventListener('click', function (e) {
    e.preventDefault();
    const container = document.getElementById('phoneContainer');
    const wrapper = document.createElement('div');
    wrapper.className = 'input-group mt-2 phone-entry';

    const input = document.createElement('input');
    input.type = 'tel';
    input.className = 'form-control phone-input';
    input.placeholder = 'Enter additional phone number';

    const select = document.createElement('select');
    select.className = 'form-select ms-2';
    select.style.maxWidth = '150px';
    ['Home', 'Work', 'Cell'].forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      select.appendChild(option);
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-outline-danger ms-2 remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.type = 'button';
    removeBtn.addEventListener('click', () => wrapper.remove());

    wrapper.appendChild(input);
    wrapper.appendChild(select);
    wrapper.appendChild(removeBtn);
    container.insertBefore(wrapper, document.getElementById('addPhoneBtn'));
  });

  document.getElementById('addEmailBtn')?.addEventListener('click', function (e) {
    e.preventDefault();
    const container = document.getElementById('emailContainer');
    const wrapper = document.createElement('div');
    wrapper.className = 'input-group mt-2 email-entry';

    const input = document.createElement('input');
    input.type = 'email';
    input.className = 'form-control email-input';
    input.placeholder = 'Enter additional email address';

    const select = document.createElement('select');
    select.className = 'form-select ms-2';
    select.style.maxWidth = '150px';
    ['Personal', 'Organization'].forEach(label => {
      const option = document.createElement('option');
      option.value = label;
      option.textContent = label;
      select.appendChild(option);
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-outline-danger ms-2 remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.type = 'button';
    removeBtn.addEventListener('click', () => wrapper.remove());

    wrapper.appendChild(input);
    wrapper.appendChild(select);
    wrapper.appendChild(removeBtn);
    container.insertBefore(wrapper, document.getElementById('addEmailBtn'));
  });
});