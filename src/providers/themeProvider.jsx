import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';
const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

const systemTheme = () => {
	try {
		return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
	} catch {
		return 'dark';
	}
};

// Mesma regra do script inline do index.html (que evita o "flash" no primeiro paint).
const initialTheme = () => {
	const attr = document.documentElement.dataset.theme;
	if (attr === 'light' || attr === 'dark') return attr;
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved === 'light' || saved === 'dark') return saved;
	} catch {
		/* storage indisponível */
	}
	return systemTheme();
};

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(initialTheme);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', theme === 'light' ? '#f1f5f9' : '#0f172a');
	}, [theme]);

	const toggleTheme = useCallback(() => {
		setTheme((current) => {
			const next = current === 'dark' ? 'light' : 'dark';
			try {
				localStorage.setItem(STORAGE_KEY, next);
			} catch {
				/* só vale para esta sessão */
			}
			return next;
		});
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
