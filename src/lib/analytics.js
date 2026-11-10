// GA4 com consentimento: o gtag.js só é baixado depois que o visitante aceita.
// Sem Measurement ID configurado, tudo aqui vira no-op (e o banner nem aparece).
// O ID é público; defina VITE_GA_ID no build ou troque o fallback abaixo.
export const GA_ID = import.meta.env.VITE_GA_ID || 'G-FD0R3G33MC';

const CONSENT_KEY = 'cookieConsent';
let loaded = false;

export const getConsent = () => {
	try {
		const v = localStorage.getItem(CONSENT_KEY);
		return v === 'granted' || v === 'denied' ? v : null;
	} catch {
		return null;
	}
};

export const setConsent = (value) => {
	try {
		localStorage.setItem(CONSENT_KEY, value);
	} catch {
		/* storage indisponível: vale só para esta sessão */
	}
	if (value === 'granted') loadAnalytics();
	else disableAnalytics();
	window.dispatchEvent(new Event('cookie-consent'));
};

export const clearConsent = () => {
	try {
		localStorage.removeItem(CONSENT_KEY);
	} catch {
		/* ignore */
	}
	window.dispatchEvent(new Event('cookie-consent'));
};

// O gtag.js só processa o objeto `arguments` no dataLayer — empurrar um array
// comum (rest params) faz todos os eventos serem ignorados em silêncio.
function gtag() {
	window.dataLayer = window.dataLayer || [];
	// eslint-disable-next-line prefer-rest-params
	window.dataLayer.push(arguments);
}

export const loadAnalytics = () => {
	if (!GA_ID || loaded || typeof document === 'undefined') return;
	loaded = true;
	window[`ga-disable-${GA_ID}`] = false;
	gtag('js', new Date());
	gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true });
	const s = document.createElement('script');
	s.async = true;
	s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
	document.head.appendChild(s);
};

const disableAnalytics = () => {
	if (GA_ID) window[`ga-disable-${GA_ID}`] = true;
};

const enabled = () => !!GA_ID && getConsent() === 'granted' && loaded;

export const trackEvent = (name, params = {}) => {
	if (enabled()) gtag('event', name, params);
};

export const trackPageView = (path) => {
	trackEvent('page_view', {
		page_path: path,
		page_location: window.location.href,
		page_title: document.title,
	});
};
