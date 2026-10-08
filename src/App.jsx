import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Layout, Menu, theme, App as AntApp } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './App.css';
import ChatWidget from './components/ChatWidget';

import {
	HomeOutlined,
	ContactsOutlined,
	BookOutlined,
	LinkedinOutlined,
	InstagramOutlined,
	GithubOutlined,
	MailOutlined,
	ProjectOutlined,
	CloudServerOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const FloatingCircles = () => {
	const circlesRef = useRef([]);
	const mouseRef = useRef({ x: -9999, y: -9999 });
	const animIdRef = useRef(null);
	const lastInteractRef = useRef(Date.now());
	const pausedRef = useRef(false);

	const createRandomColor = () => {
		const colors = [
			'#e2e8f014', '#cbd5e11a', '#94a3b818', '#f1f5f91a',
			'#e2e8f01f', '#cbd5e122', '#f8fafc14', '#94a3b820',
			'#e2e8f01a', '#cbd5e110', '#f1f5f91e', '#94a3b814',
		];
		return colors[Math.floor(Math.random() * colors.length)];
	};

	const isMobile = () => window.innerWidth < 768;

	const circlesConfig = useMemo(() => {
		const count = isMobile() ? 10 : 15;
		const ww = window.innerWidth;
		const wh = window.innerHeight;
		return Array.from({ length: count }, (_, i) => {
			const size = randomBetween(12, 32);
			const d = size * 16;
			return {
				id: i,
				size,
				r: size * 8,
				color: createRandomColor(),
				x: randomBetween(0, Math.max(0, ww - d)),
				y: randomBetween(0, Math.max(0, wh - d)),
				vx: randomBetween(-0.25, 0.25),
				vy: randomBetween(-0.25, 0.25),
				popping: false,
				lastTransform: '',
			};
		});
	}, []);

	useEffect(() => {
		const circles = circlesConfig.map((c) => ({ ...c, el: null }));

		circlesRef.current.forEach((el) => {
			if (!el) return;
			const id = parseInt(el.dataset.id);
			const circle = circles.find((c) => c.id === id);
			if (circle) circle.el = el;
		});

		const wake = () => {
			lastInteractRef.current = Date.now();
			if (pausedRef.current) {
				pausedRef.current = false;
				animIdRef.current = requestAnimationFrame(animate);
			}
		};

		const handlePointerMove = (e) => {
			mouseRef.current = { x: e.clientX, y: e.clientY };
			wake();
		};
		const handlePointerDown = (e) => {
			mouseRef.current = { x: e.clientX, y: e.clientY };
			wake();
		};
		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		window.addEventListener('pointerdown', handlePointerDown, { passive: true });

		const MAX_SPEED = 0.6;
		const IDLE_MS = 5000;

		const animate = () => {
			const mx = mouseRef.current.x;
			const my = mouseRef.current.y;
			const ww = window.innerWidth;
			const wh = window.innerHeight;
			const repulseRange = 150;

			circles.forEach((c) => {
				if (!c.el || c.popping) return;

				const dx = c.x + c.r - mx;
				const dy = c.y + c.r - my;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < repulseRange && dist > 0) {
					const force = ((repulseRange - dist) / repulseRange) * 0.5;
					c.vx += (dx / dist) * force;
					c.vy += (dy / dist) * force;
				}

				c.vx *= 0.985;
				c.vy *= 0.985;

				const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
				if (speed > MAX_SPEED) {
					c.vx = (c.vx / speed) * MAX_SPEED;
					c.vy = (c.vy / speed) * MAX_SPEED;
				}

				c.x += c.vx;
				c.y += c.vy;

				// Wrap-around: sai por um lado e entra pelo outro — sem colisão
				// e sem acúmulo de bolhas espremidas nas bordas.
				const d = c.r * 2;
				if (c.x > ww) c.x = -d;
				if (c.x + d < 0) c.x = ww;
				if (c.y > wh) c.y = -d;
				if (c.y + d < 0) c.y = wh;
			});

			circles.forEach((c) => {
				if (!c.el || c.popping) return;
				const tx = `translate(${c.x}px, ${c.y}px)`;
				if (c.lastTransform !== tx) {
					c.lastTransform = tx;
					c.el.style.transform = tx;
				}
			});

			// Pausa quando ocioso: sem interação o loop para por completo,
			// zerando o custo de CPU do navegador.
			if (Date.now() - lastInteractRef.current > IDLE_MS) {
				pausedRef.current = true;
				return;
			}
			animIdRef.current = requestAnimationFrame(animate);
		};

		let resizeTimer;
		const handleResize = () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				const ww = window.innerWidth;
				const wh = window.innerHeight;
				circles.forEach((c) => {
					if (!c.el || c.popping) return;
					if (c.x + c.r * 2 > ww) c.x = Math.max(0, ww - c.r * 2);
					if (c.y + c.r * 2 > wh) c.y = Math.max(0, wh - c.r * 2);
				});
				wake();
			}, 300);
		};
		window.addEventListener('resize', handleResize, { passive: true });

		animIdRef.current = requestAnimationFrame(animate);
		return () => {
			cancelAnimationFrame(animIdRef.current);
			clearTimeout(resizeTimer);
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('resize', handleResize);
		};
	}, [circlesConfig]);

	const popBubble = useCallback((id) => {
		const circle = circlesConfig.find((c) => c.id === id);
		if (!circle || circle.popping) return;
		const el = circlesRef.current[id];
		if (!el) return;

		circle.popping = true;

		el.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';
		el.style.opacity = '0';
		el.style.transform = `translate(${circle.x}px, ${circle.y}px) scale(1.8)`;

		setTimeout(() => {
			el.style.display = 'none';
		}, 400);
	}, [circlesConfig]);

	const handleBubbleClick = useCallback((e) => {
		for (const c of circlesConfig) {
			if (c.popping) continue;
			const el = circlesRef.current[c.id];
			if (!el) continue;
			const d = c.r * 2;
			if (e.clientX >= c.x && e.clientX <= c.x + d &&
				e.clientY >= c.y && e.clientY <= c.y + d) {
				popBubble(c.id);
				break;
			}
		}
	}, [circlesConfig, popBubble]);

	useEffect(() => {
		window.addEventListener('click', handleBubbleClick);
		return () => window.removeEventListener('click', handleBubbleClick);
	}, [handleBubbleClick]);

	return (
		<div className='fixed inset-0 pointer-events-none' style={{ zIndex: 1 }}>
			{circlesConfig.map((c) => (
				<div
					key={c.id}
					data-id={c.id}
					ref={(el) => {
						if (el) circlesRef.current[c.id] = el;
					}}
					className='rounded-full'
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: `${c.size}rem`,
						height: `${c.size}rem`,
						backgroundColor: c.color,
					}}
				/>
			))}
		</div>
	);
};

const pageColors = {
	'/': '#6366f1',
	'/projects': '#a855f7',
	'/infra': '#14b8a6',
	'/paint': '#ef4444',
	'/about': '#3b82f6',
};

const menuItems = [
	{
		key: '/',
		label: <Link to='/'>Home</Link>,
		icon: <HomeOutlined />,
	},

	{
		key: '/projects',
		label: <Link to='/projects'>Projetos</Link>,
		icon: <ProjectOutlined />,
	},

	{
		key: '/infra',
		label: <Link to='/infra'>Infra</Link>,
		icon: <CloudServerOutlined />,
	},

	{
		key: '/paint',
		label: <Link to='/paint'>Paint</Link>,
		icon: <BookOutlined />,
	},

	{
		key: '/about',
		label: <Link to='/about'>Sobre</Link>,
		icon: <ContactsOutlined />,
	},
];

const App = () => {
	const [collapsed, setCollapsed] = useState(true);

	const location = useLocation();

	const {
		token: { colorBgContainer, colorPrimaryBg },
	} = theme.useToken();

	const selectedBg = pageColors[location.pathname] || '#6366f1';

	return (
		<AntApp style={{ height: '100%' }}>
		<Layout className='flex flex-col h-full bg-[#0f172a]'>
			<FloatingCircles />
			<Header
				style={{
					padding: 0,
					zIndex: 9999,
					display: 'flex',
					background: 'transparent',
				}}
			>
				<Menu
					theme='dark'
					mode='horizontal'
					selectedKeys={[location.pathname]}
					items={menuItems}
					style={{
						background: 'rgba(15, 23, 42, 0.92)',
						borderBottom: '1px solid rgba(255,255,255,0.06)',
						flex: 1,
						minWidth: 0,
						'--menu-active-color': selectedBg,
					}}
				/>
			</Header>
			{/* <Content className='content-wrapper flex-col flex flex-1'>
				<div className='outlet-wrapper flex flex-1 flex-col  h-full overflow-auto'>
					<div className='flex-1'>
						<Outlet />
					</div>
				</div>
			</Content> */}

			<Content
				className='content-wrapper flex-1 overflow-auto'
				style={{ position: 'relative', zIndex: 2 }}
			>
				<Outlet />
			</Content>

			<Footer
				style={{
					background: 'rgba(30, 41, 59, 0.95)',
					borderTop: '1px solid rgba(255,255,255,0.08)',
					width: '100%',
				}}
				className='drop-shadow p-4 justify-end'
			>
				<div className='flex flex-row gap-2 justify-center text-xl'>
					<a
						href='mailto:wallacemv@gmail.com'
						target='_blank'
						className='animate-pulse'
						style={{ color: '#ffffff' }}
					>
						<span style={{ fontSize: '12px' }} className='mr-2'>
							wallacemv@gmail.com
						</span>
						<MailOutlined />
					</a>

					<a
						href='https://www.instagram.com/wallacemarttins'
						target='_blank'
						className='animate-pulse'
						style={{ color: '#ffffff' }}
					>
						<InstagramOutlined />
					</a>

					<a
						href='https://github.com/wallacemv'
						target='_blank'
						className='animate-pulse'
						style={{ color: '#ffffff' }}
					>
						<GithubOutlined />
					</a>

					<a
						href='https://www.linkedin.com/in/wallacemarttins'
						target='_blank'
						className='animate-pulse'
						style={{ color: '#ffffff' }}
					>
						<LinkedinOutlined />
					</a>
				</div>
			</Footer>
			<ChatWidget />
		</Layout>
		</AntApp>
	);
};

export default App;
