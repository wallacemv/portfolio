import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GA_ID, getConsent, setConsent } from '../lib/analytics';

// Banner de consentimento (LGPD). Só aparece se há analytics configurado e o
// visitante ainda não escolheu. "Cookies" no rodapé reabre a escolha.
const CookieBanner = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!GA_ID) return undefined;
		const sync = () => setVisible(getConsent() === null);
		const reopen = () => setVisible(true);
		sync();
		window.addEventListener('cookie-consent', sync);
		window.addEventListener('cookie-settings', reopen);
		return () => {
			window.removeEventListener('cookie-consent', sync);
			window.removeEventListener('cookie-settings', reopen);
		};
	}, []);

	if (!visible) return null;

	return (
		<div
			role='dialog'
			aria-live='polite'
			aria-label='Aviso de cookies'
			style={{
				position: 'fixed',
				left: 16,
				right: 16,
				bottom: 16,
				zIndex: 1000,
				maxWidth: 560,
				margin: '0 auto',
				background: 'rgba(15,23,42,0.97)',
				border: '1px solid rgba(255,255,255,0.15)',
				borderRadius: 12,
				padding: 16,
				color: '#fff',
				boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
			}}
		>
			<p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
				Uso cookies do Google Analytics para entender como o site é usado:
				páginas visitadas, abertura do assistente e download do currículo.
				Nada é coletado antes da sua escolha.{' '}
				<Link to='/privacy' style={{ color: '#a5b4fc', textDecoration: 'underline' }}>
					Política de privacidade
				</Link>
			</p>
			<div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
				<button
					type='button'
					onClick={() => {
						setConsent('denied');
						setVisible(false);
					}}
					style={{
						padding: '6px 14px',
						borderRadius: 8,
						border: '1px solid rgba(255,255,255,0.3)',
						background: 'transparent',
						color: '#fff',
						cursor: 'pointer',
					}}
				>
					Recusar
				</button>
				<button
					type='button'
					onClick={() => {
						setConsent('granted');
						setVisible(false);
					}}
					style={{
						padding: '6px 14px',
						borderRadius: 8,
						border: 0,
						background: '#6366f1',
						color: '#fff',
						fontWeight: 600,
						cursor: 'pointer',
					}}
				>
					Aceitar
				</button>
			</div>
		</div>
	);
};

export default CookieBanner;
