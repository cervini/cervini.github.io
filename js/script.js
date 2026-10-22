(() => {
	const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
	let savedTheme = null;

	try {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme === 'light' || storedTheme === 'dark') {
			savedTheme = storedTheme;
		}
	} catch {}

	function applyTheme(theme) {
		const isDark = theme === 'dark';
		document.documentElement.dataset.theme = theme;
		document.querySelector('meta[name="theme-color"]').content = isDark ? '#191919' : '#f8f8f6';

		const toggle = document.querySelector('.theme-toggle');
		if (toggle) {
			toggle.setAttribute('aria-pressed', String(isDark));
			toggle.title = `Switch to ${isDark ? 'light' : 'dark'} theme`;
		}
	}

	applyTheme(savedTheme ?? (systemTheme.matches ? 'dark' : 'light'));

	systemTheme.addEventListener('change', (event) => {
		if (savedTheme === null) {
			applyTheme(event.matches ? 'dark' : 'light');
		}
	});

	document.addEventListener('DOMContentLoaded', () => {
		const toggle = document.querySelector('.theme-toggle');
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let switchTimer;
		applyTheme(document.documentElement.dataset.theme);
		toggle.hidden = false;

		toggle.addEventListener('click', () => {
			savedTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

			if (!reducedMotion.matches) {
				clearTimeout(switchTimer);
				document.documentElement.classList.remove('theme-switching');
				void document.documentElement.offsetWidth;
				document.documentElement.classList.add('theme-switching');
				switchTimer = setTimeout(() => document.documentElement.classList.remove('theme-switching'), 340);
			}

			applyTheme(savedTheme);

			try {
				localStorage.setItem('theme', savedTheme);
			} catch {}
		});

		const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
		const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);

		function updateCurrentSection() {
			const offset = document.querySelector('.site-header').offsetHeight + 24;
			const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
			let current = atBottom ? sections[sections.length - 1] : null;

			if (!current) {
				for (const section of sections) {
					if (section.getBoundingClientRect().top <= offset) {
						current = section;
					}
				}
			}

			for (const link of navLinks) {
				if (current && link.hash === `#${current.id}`) {
					link.setAttribute('aria-current', 'location');
				} else {
					link.removeAttribute('aria-current');
				}
			}
		}

		let frame = 0;
		const scheduleUpdate = () => {
			if (!frame) {
				frame = requestAnimationFrame(() => {
					frame = 0;
					updateCurrentSection();
				});
			}
		};

		window.addEventListener('scroll', scheduleUpdate, { passive: true });
		window.addEventListener('resize', scheduleUpdate);
		updateCurrentSection();
	});
})();