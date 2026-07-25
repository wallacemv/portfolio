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
import Shapes from './routes/Shapes';
import Chat from './routes/Chat';

import { MainProvider } from './providers/mainProvider';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Home /> },
			{ path: '/paint', element: <Paint /> },
			{ path: '/about', element: <About /> },
			{ path: '/shapes', element: <Shapes /> },
			{ path: '/chat', element: <Chat /> },
		],
	},
], { basename: '/portfolio' });

ReactDOM.createRoot(document.getElementById('root')).render(
	<ConfigProvider
		theme={{
			token: {
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
			},
		}}
	>
		<MainProvider>
			<RouterProvider router={router}>
				<StyleProvider hashPriority='high'>
					<App />
				</StyleProvider>
			</RouterProvider>
		</MainProvider>
	</ConfigProvider>
);
