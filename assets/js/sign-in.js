// Set footer year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Theme setup
const storedTheme = localStorage.getItem('theme');
const getPreferredTheme = () => {
  if (storedTheme) return storedTheme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'light';
};
const setTheme = function (theme) {
  if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
};
setTheme(getPreferredTheme());

window.addEventListener('DOMContentLoaded', () => {
  // Theme toggle buttons
  const el = document.querySelector('.theme-icon-active');
  if (el != 'undefined' && el != null) {
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
  // LOGIN FORM SUBMISSION
  // ==========================
  const loginForm = document.getElementById('signinForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value.trim();

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }

      console.log('📤 Attempting login...');

      fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
        .then(res => {
          console.log('🔁 Response:', res);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log('✅ Login successful:', data);
          window.location.href = 'my-profile.html';
        })
        .catch(err => {
          console.error('❌ Login error:', err);
          alert('Login failed. Please check your credentials and try again.');
        });
    });
  } else {
    console.warn('⚠️ signinForm not found in DOM');
  }
});
