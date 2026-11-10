import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import App from './App';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './routes/Home';
import Paint from './routes/Paint';
import About from './routes/About';
import Projects from './routes/Projects';
import Infra from './routes/Infra';
import Privacy from './routes/Privacy';
import NotFound from './routes/NotFound';

import { MainProvider } from './providers/mainProvider';
import { ThemeProvider, useTheme } from './providers/themeProvider';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Home /> },
			{ path: '/paint', element: <Paint /> },
			{ path: '/about', element: <About /> },
			{ path: '/projects', element: <Projects /> },
			{ path: '/infra', element: <Infra /> },
			{ path: '/privacy', element: <Privacy /> },
			{ path: '*', element: <NotFound /> },
		],
	},
], { basename: '/portfolio' });

const darkTokens = {
	colorPrimary: '#363636',
	colorPrimaryHover: '#6366f1',
	colorItemBgSelected: '#6366f1',
	colorPrimaryBg: '#363636',
	colorBgTextActive: '#6366f1',
	colorLink: '#6366f1',
	colorTextBase: '#505050',
	colorLinkActive: '#4f46e5',
	colorLinkHover: '#4f46e5',
	controlItemBgActiveHover: '#4f46e5',
	colorBgContainer: '#ffffff',
	colorBgBase: '#363636',
	colorBgLayout: '#363636',
	fontFamily: 'Chakra Petch',
};

const lightTokens = {
	...darkTokens,
	colorPrimaryBg: '#e2e8f0',
	colorTextBase: '#0f172a',
	colorBgBase: '#ffffff',
	colorBgLayout: '#f1f5f9',
};

const Root = () => {
	const { theme: mode } = useTheme();
	return (
		<ConfigProvider theme={{ token: mode === 'light' ? lightTokens : darkTokens }}>
			<MainProvider>
				<RouterProvider router={router}>
					<StyleProvider hashPriority='high'>
						<App />
					</StyleProvider>
				</RouterProvider>
			</MainProvider>
		</ConfigProvider>
	);
};

ReactDOM.createRoot(document.getElementById('root')).render(
	<ThemeProvider>
		<Root />
	</ThemeProvider>
);
