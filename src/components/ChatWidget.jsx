import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Typography, Space, Badge, App } from 'antd';
import {
	SendOutlined,
	MessageOutlined,
	WifiOutlined,
	DisconnectOutlined,
	EditOutlined,
	CloseOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const ChatWidget = () => {
	const { message } = App.useApp();
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [username, setUsername] = useState('');
	const [usernameInput, setUsernameInput] = useState('');
	const [editingUsername, setEditingUsername] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const websocketRef = useRef(null);
	const messagesEndRef = useRef(null);
	const usernameRef = useRef(username);

	useEffect(() => {
		usernameRef.current = username;
	}, [username]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		const storedUsername = localStorage.getItem('chatUsername');
		if (storedUsername) {
			setUsername(storedUsername);
			setUsernameInput(storedUsername);
		} else {
			const newUsername = `User${Math.floor(Math.random() * 1000)}`;
			setUsername(newUsername);
			setUsernameInput(newUsername);
			localStorage.setItem('chatUsername', newUsername);
		}
	}, []);

	useEffect(() => {
		if (!open) return;

		const ws = new WebSocket('wss://codedbywallace.dev/websocket');
		websocketRef.current = ws;

		ws.onopen = () => {
			setIsConnected(true);
		};

		ws.onmessage = (event) => {
			const messageData = JSON.parse(event.data);

			if (messageData.type === 'history') {
				setMessages(messageData.messages);
				return;
			}

			if (messageData.username !== usernameRef.current) {
				setMessages((prevMessages) => [...prevMessages, messageData]);
			}
		};

		ws.onclose = () => {
			setIsConnected(false);
		};

		ws.onerror = () => {
			setIsConnected(false);
			message.error('Connection error');
		};

		return () => {
			ws.close();
			websocketRef.current = null;
			setIsConnected(false);
			setMessages([]);
		};
	}, [open]);

	const sendMessage = () => {
		if (!inputMessage.trim() || !isConnected) return;

		const messageObject = {
			username,
			text: inputMessage,
			type: 'user',
			timestamp: new Date().toISOString(),
		};

		websocketRef.current.send(JSON.stringify(messageObject));

		setMessages((prevMessages) => [...prevMessages, messageObject]);
		setInputMessage('');
	};

	const saveUsername = () => {
		const name = usernameInput.trim() || `User${Math.floor(Math.random() * 1000)}`;
		setUsername(name);
		setUsernameInput(name);
		localStorage.setItem('chatUsername', name);
		setEditingUsername(false);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			sendMessage();
		}
	};

	const groupMessagesByDate = (msgs) => {
		const groups = [];
		let currentDate = null;

		msgs.forEach((msg) => {
			const date = new Date(msg.timestamp).toLocaleDateString('pt-BR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
			if (date !== currentDate) {
				currentDate = date;
				groups.push({ type: 'date', label: date, id: `date-${date}` });
			}
			groups.push({ type: 'message', data: msg, id: msg.timestamp });
		});

		return groups;
	};

	const renderMessageContent = (message) => {
		if (message.type === 'system') {
			return (
				<Text className='text-center text-sm italic underline'>
					{message.text}
				</Text>
			);
		}

		return (
			<Card
				size='small'
				style={{
					backgroundColor:
						message.username === usernameRef.current ? '#e6f7ff' : '#f6ffed',
					alignSelf: message.username === usernameRef.current ? 'flex-end' : 'flex-start',
				}}
			>
				<Space direction='vertical' size='small' className='gap-1'>
					<Text strong>
						{message.username === usernameRef.current ? 'You' : message.username}
					</Text>
					<Text>{message.text}</Text>
					<Text type='secondary' style={{ fontSize: '0.6em' }}>
						{new Date(message.timestamp).toLocaleTimeString()}
					</Text>
				</Space>
			</Card>
		);
	};

	return (
		<>
			{open && (
				<div
					className='fixed flex flex-col'
					style={{
						right: 24,
						bottom: 96,
						width: 'min(360px, calc(100vw - 48px))',
						height: 480,
						maxHeight: 'calc(100vh - 130px)',
						zIndex: 1000,
					}}
				>
					<Card
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							borderRadius: '12px',
							boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
						}}
						styles={{
							body: {
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								padding: 0,
								overflow: 'hidden',
							},
						}}
					>
						<div
							className='flex items-center justify-between gap-2 p-3'
							style={{ borderBottom: '1px solid #eee' }}
						>
							<Space>
								<MessageOutlined />
								<Text strong>Chat Amizade</Text>
							</Space>
							<Space size='small'>
								{editingUsername ? (
									<Space.Compact>
										<Input
											size='small'
											value={usernameInput}
											onChange={(e) => setUsernameInput(e.target.value)}
											onPressEnter={saveUsername}
											style={{ width: 110 }}
										/>
										<Button size='small' type='primary' onClick={saveUsername}>
											OK
										</Button>
									</Space.Compact>
								) : (
									<Button
										size='small'
										type='text'
										icon={<EditOutlined />}
										onClick={() => {
											setUsernameInput(username);
											setEditingUsername(true);
										}}
									>
										{username}
									</Button>
								)}
								<Badge
									status={isConnected ? 'success' : 'error'}
									text={isConnected ? 'Online' : 'Offline'}
									icon={isConnected ? <WifiOutlined /> : <DisconnectOutlined />}
								/>
							</Space>
						</div>

						<div
							className='flex-1 overflow-y-auto flex flex-col gap-2 p-3'
							style={{ minHeight: 0 }}
						>
							{groupMessagesByDate(messages).map((item) => {
								if (item.type === 'date') {
									return (
										<div
											key={item.id}
											style={{ textAlign: 'center', margin: '8px 0' }}
										>
											<Text
												type='secondary'
												style={{
													fontSize: '0.7em',
													background: '#f0f0f0',
													padding: '2px 10px',
													borderRadius: '10px',
												}}
											>
												{item.label}
											</Text>
										</div>
									);
								}

								const message = item.data;
								return (
									<div
										key={item.id}
										style={{
											display: 'flex',
											justifyContent:
												message.type === 'system'
													? 'center'
													: message.username === usernameRef.current
														? 'flex-end'
														: 'flex-start',
											maxWidth: '80%',
											alignSelf:
												message.username === usernameRef.current
													? 'flex-end'
													: 'flex-start',
										}}
									>
										{renderMessageContent(message)}
									</div>
								);
							})}
							<div ref={messagesEndRef} className='messages-end-ref' />
						</div>

						<Space.Compact
							className='flex flex-row w-full gap-2 p-3'
							style={{ borderTop: '1px solid #eee' }}
						>
							<Input
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder='Type your message...'
								disabled={!isConnected}
							/>
							<Button
								shape='circle'
								icon={<SendOutlined />}
								onClick={sendMessage}
								disabled={!isConnected || !inputMessage.trim()}
							/>
						</Space.Compact>
					</Card>
				</div>
			)}

			<Button
				shape='circle'
				icon={open ? <CloseOutlined /> : <MessageOutlined />}
				onClick={() => setOpen((o) => !o)}
				aria-label={open ? 'Fechar chat' : 'Abrir chat'}
				style={{
					position: 'fixed',
					right: 24,
					bottom: 24,
					zIndex: 1001,
					width: 56,
					height: 56,
					background: '#22c55e',
					color: '#ffffff',
					fontSize: 22,
					boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
				}}
			/>
		</>
	);
};

export default ChatWidget;