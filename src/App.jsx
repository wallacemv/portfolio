import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Layout, Menu, Breadcrumb, Button, theme, Affix, App as AntApp } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './App.css';

import {
	HomeOutlined,
	ContactsOutlined,
	BookOutlined,
	LinkedinOutlined,
	InstagramOutlined,
	MailOutlined,
	MessageOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const FloatingCircles = () => {
	const circlesRef = useRef([]);
	const mouseRef = useRef({ x: -9999, y: -9999 });
	const animIdRef = useRef(null);
	const [, forceUpdate] = useState(0);

	const createRandomColor = () => {
		const colors = [
			'#1e293b20', '#33415518', '#47556915', '#64748b18',
			'#0f172a20', '#1e3a5f15', '#2d374818', '#1a202c20',
			'#37415115', '#1f293718', '#11182720', '#1e293b15',
		];
		return colors[Math.floor(Math.random() * colors.length)];
	};

	const circlesConfig = useMemo(() => {
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		return Array.from({ length: 15 }, (_, i) => ({
			id: i,
			size: randomBetween(12, 32),
			color: createRandomColor(),
			x: centerX + randomBetween(-400, 400),
			y: centerY + randomBetween(-400, 400),
			vx: randomBetween(-0.3, 0.3),
			vy: randomBetween(-0.3, 0.3),
			popping: false,
		}));
	}, []);

	useEffect(() => {
		const circles = circlesConfig.map((c) => ({ ...c, el: null }));

		circlesRef.current.forEach((el) => {
			if (!el) return;
			const id = parseInt(el.dataset.id);
			const circle = circles.find((c) => c.id === id);
			if (circle) circle.el = el;
		});

		const handleMouseMove = (e) => {
			mouseRef.current = { x: e.clientX, y: e.clientY };
		};
		window.addEventListener('mousemove', handleMouseMove);

		const animate = () => {
			const mx = mouseRef.current.x;
			const my = mouseRef.current.y;
			const ww = window.innerWidth;
			const wh = window.innerHeight;

			circles.forEach((c) => {
				if (!c.el || c.popping) return;

				const radius = c.el.offsetWidth / 2;
				const cx = c.x + radius;
				const cy = c.y + radius;
				const dx = cx - mx;
				const dy = cy - my;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const minDist = 120;

				if (dist < minDist && dist > 0) {
					const force = ((minDist - dist) / minDist) * 3;
					c.vx += (dx / dist) * force;
					c.vy += (dy / dist) * force;
				}

				c.vx *= 0.98;
				c.vy *= 0.98;
				c.x += c.vx;
				c.y += c.vy;

				const ew = c.el.offsetWidth;
				const eh = c.el.offsetHeight;

				if (c.x + ew >= ww) { c.x = ww - ew; c.vx = 0; }
				if (c.x <= 0) { c.x = 0; c.vx = 0; }
				if (c.y + eh >= wh) { c.y = wh - eh; c.vy = 0; }
				if (c.y <= 0) { c.y = 0; c.vy = 0; }
			});

			for (let i = 0; i < circles.length; i++) {
				for (let j = i + 1; j < circles.length; j++) {
					const a = circles[i];
					const b = circles[j];
					if (!a.el || !b.el || a.popping || b.popping) continue;

					const ax = a.x + a.el.offsetWidth / 2;
					const ay = a.y + a.el.offsetHeight / 2;
					const bx = b.x + b.el.offsetWidth / 2;
					const by = b.y + b.el.offsetHeight / 2;
					const dx = ax - bx;
					const dy = ay - by;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const minDist = (a.el.offsetWidth + b.el.offsetWidth) / 2;

					if (dist < minDist && dist > 0) {
						const overlap = (minDist - dist) / 2;
						const nx = dx / dist;
						const ny = dy / dist;
						a.x += nx * overlap;
						a.y += ny * overlap;
						b.x -= nx * overlap;
						b.y -= ny * overlap;

						const dvx = a.vx - b.vx;
						const dvy = a.vy - b.vy;
						const dot = dvx * nx + dvy * ny;
						a.vx -= dot * nx * 0.5;
						a.vy -= dot * ny * 0.5;
						b.vx += dot * nx * 0.5;
						b.vy += dot * ny * 0.5;
					}
				}
			}

			circles.forEach((c) => {
				if (!c.el || c.popping) return;
				c.el.style.transform = `translate(${c.x}px, ${c.y}px)`;
			});

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
					c.vx = 0;
					c.vy = 0;
					if (c.x + c.el.offsetWidth > ww) c.x = Math.max(0, ww - c.el.offsetWidth);
					if (c.y + c.el.offsetHeight > wh) c.y = Math.max(0, wh - c.el.offsetHeight);
					if (c.x < 0) c.x = 0;
					if (c.y < 0) c.y = 0;
				});
			}, 300);
		};
		window.addEventListener('resize', handleResize);

		animIdRef.current = requestAnimationFrame(animate);
		return () => {
			cancelAnimationFrame(animIdRef.current);
			clearTimeout(resizeTimer);
			window.removeEventListener('mousemove', handleMouseMove);
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
			if (e.clientX >= c.x && e.clientX <= c.x + el.offsetWidth &&
				e.clientY >= c.y && e.clientY <= c.y + el.offsetHeight) {
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
	'/paint': '#ef4444',
	'/shapes': '#f97316',
	'/chat': '#22c55e',
	'/about': '#3b82f6',
};

const menuItems = [
	{
		key: '/',
		label: <Link to='/'>Home</Link>,
		icon: <HomeOutlined />,
		style: { borderBottom: '5px solid #6366f1' },
	},

	{
		key: '/paint',
		label: <Link to='/paint'>Paint</Link>,
		icon: <BookOutlined />,
		style: { borderBottom: '5px solid #ef4444' },
	},

	{
		key: '/shapes',
		label: <Link to='/shapes'>Shapes</Link>,
		icon: <BookOutlined />,
		style: { borderBottom: '5px solid #f97316' },
	},

	{
		key: '/chat',
		label: <Link to='/chat'>Chat Amizade</Link>,
		icon: <MessageOutlined />,
		style: { borderBottom: '5px solid #22c55e' },
	},

	{
		key: '/about',
		label: <Link to='/about'>About</Link>,
		icon: <ContactsOutlined />,
		style: { borderBottom: '5px solid #3b82f6' },
	},
];

const App = () => {
	const [collapsed, setCollapsed] = useState(true);

	const location = useLocation();

	const {
		token: { colorBgContainer, colorPrimaryBg },
	} = theme.useToken();

	const selectedBg = pageColors[location.pathname] || '#6366f1';

	const hexToRgba = (hex, alpha) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	return (
		<AntApp style={{ height: '100%' }}>
		<Layout className='flex flex-col h-full bg-white'>
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
						background: hexToRgba(selectedBg, 0.88),
						flex: 1,
						minWidth: 0,
						'--menu-active-color': selectedBg,
						transition: 'background 0.4s ease',
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

			<Content className='content-wrapper flex-1 overflow-auto'>
				<Outlet />
			</Content>

			<Footer
				style={{
					background: hexToRgba(selectedBg, 0.88),
					width: '100%',
					transition: 'background 0.4s ease',
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
						href='https://www.linkedin.com/in/wallacemarttins'
						target='_blank'
						className='animate-pulse'
						style={{ color: '#ffffff' }}
					>
						<LinkedinOutlined />
					</a>
				</div>
			</Footer>
		</Layout>
		</AntApp>
	);
};

export default App;
