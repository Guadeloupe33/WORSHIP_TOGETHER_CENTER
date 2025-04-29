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
	  return storedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'light');
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
	  const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
  
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
	  if (storedTheme !== 'light' && storedTheme !== 'dark') {
		setTheme(getPreferredTheme());
		showActiveTheme(getPreferredTheme());
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
	// Chat Toast Activation
	// ==========================
	const chatToastEl = document.getElementById('chatToast');
	if (chatToastEl) {
	  const chatToast = new bootstrap.Toast(chatToastEl, { autohide: false });
  
	  document.querySelectorAll('.open-chat-btn').forEach(btn => {
		btn.addEventListener('click', () => {
		  chatToast.show();
		});
	  });
	}
  });
  