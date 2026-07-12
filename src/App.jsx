import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Button, theme, Affix } from 'antd';
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

const menuItems = [
	{
		key: '/',
		label: <Link to='/'>Home</Link>,
		icon: <HomeOutlined />,
		style: { background: '#818cf8' },
		text: 'Home',
	},

	{
		key: '/paint',
		label: <Link to='/paint'>Paint</Link>,
		icon: <BookOutlined />,
		style: { background: '#63bbff' },
		text: 'Paint',
	},

	{
		key: '/shapes',
		label: <Link to='/shapes'>Shapes</Link>,
		icon: <BookOutlined />,
		style: { background: '#ff6600' },
		text: 'Shapes',
	},

	{
		key: '/chat',
		label: <Link to='/chat'>Chat</Link>,
		icon: <MessageOutlined />,
		style: { background: '#00cc99' },
		text: 'Chat',
	},

	{
		key: '/about',
		label: <Link to='/about'>About</Link>,
		icon: <ContactsOutlined />,

		style: { background: '#7600dc' },

		text: 'Sobre',
	},
];

const App = () => {
	const [collapsed, setCollapsed] = useState(true);

	const location = useLocation();

	const {
		token: { colorBgContainer, colorPrimaryBg },
	} = theme.useToken();

	const selectedBg =
		menuItems.find((item) => item.key === location.pathname)?.style
			?.background || '#818cf8';

	return (
		<Layout className='flex flex-col h-full bg-white'>
			<Header
				style={{
					padding: 0,
					zIndex: 9999,
					display: 'flex',
				}}
			>
				<Menu
					theme='dark'
					mode='horizontal'
					selectedKeys={[location.pathname]}
					items={menuItems}
					style={{
						background: selectedBg,
						flex: 1,
						minWidth: 0,
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
					background: colorPrimaryBg,
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
	);
};

export default App;
