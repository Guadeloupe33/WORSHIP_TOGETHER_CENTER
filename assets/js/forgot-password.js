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

    // ==========================
    // Handle Theme Switching
    // ==========================
    const storedTheme = localStorage.getItem('theme');

    const getPreferredTheme = () => {
      if (storedTheme) {
        return storedTheme;
      }
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

    // ==========================
    // Theme Icon Switching
    // ==========================
    var el = document.querySelector('.theme-icon-active');
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
});
