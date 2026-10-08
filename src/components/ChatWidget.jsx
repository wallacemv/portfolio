import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Typography, Space, Badge, App } from 'antd';
import {
	SendOutlined,
	MessageOutlined,
	WifiOutlined,
	DisconnectOutlined,
	EditOutlined,
	CloseOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

// Paleta do portfolio
const C = {
	bg: '#0f172a',
	surface: '#334155',
	line: 'rgba(255,255,255,0.15)',
	text: '#ffffff',
	muted: '#94a3b8',
	mine: '#6366f1',
	botBg: '#064e3b',
	botLine: '#22c55e',
};

const NUDGE_KEY = 'chatNudged';

const ChatWidget = () => {
	const { message } = App.useApp();
	const [open, setOpen] = useState(false);
	const [showNudge, setShowNudge] = useState(false);
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [username, setUsername] = useState('');
	const [usernameInput, setUsernameInput] = useState('');
	const [editingUsername, setEditingUsername] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const typingTimeoutRef = useRef(null);
	const websocketRef = useRef(null);
	const messagesEndRef = useRef(null);
	const usernameRef = useRef(username);
	const openRef = useRef(open);

	useEffect(() => {
		openRef.current = open;
		if (open) {
			setUnreadCount(0);
			setShowNudge(false);
			sessionStorage.setItem(NUDGE_KEY, '1');
		}
	}, [open]);

	useEffect(() => {
		usernameRef.current = username;
	}, [username]);

	// Balãozinho "Fale comigo!" — 1x por sessão
	useEffect(() => {
		if (sessionStorage.getItem(NUDGE_KEY)) return;
		const t = setTimeout(() => setShowNudge(true), 1500);
		return () => clearTimeout(t);
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const requestNotificationPermission = () => {
		if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
			Notification.requestPermission().catch(() => {});
		}
	};

	const notifyIncoming = (messageData) => {
		if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
			return;
		}
		try {
			const sender =
				messageData.type === 'bot'
					? 'Wallace'
					: messageData.type === 'system'
						? 'Chat'
						: messageData.username;
			new Notification(`💬 ${sender}`, {
				body: messageData.text.slice(0, 140),
				icon: `${import.meta.env.BASE_URL}images/paint.webp`,
				tag: 'chat-amizade',
			});
		} catch (e) {
			/* notificação é best-effort */
		}
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

		let disposed = false;
		let retryTimer = null;
		let ws = null;

		const connect = () => {
			if (disposed) return;
			ws = new WebSocket('wss://codedbywallace.dev/websocket');
			websocketRef.current = ws;

			ws.onopen = () => {
				if (!disposed) setIsConnected(true);
			};

			ws.onmessage = (event) => {
				if (disposed) return;
				const messageData = JSON.parse(event.data);

				if (messageData.type === 'history') {
					setMessages(messageData.messages);
					return;
				}

				if (messageData.type === 'typing') {
					setIsBotTyping(true);
					clearTimeout(typingTimeoutRef.current);
					typingTimeoutRef.current = setTimeout(() => setIsBotTyping(false), 30000);
					return;
				}

				if (messageData.type === 'bot') {
					setIsBotTyping(false);
				}

				if (messageData.username !== usernameRef.current) {
					setMessages((prevMessages) => [...prevMessages, messageData]);

					if (!openRef.current) {
						setUnreadCount((c) => c + 1);
						notifyIncoming(messageData);
					}
				}
			};

			ws.onclose = () => {
				if (disposed) return;
				setIsConnected(false);
				// reconecta enquanto o popup estiver aberto (pod restart, rede caiu)
				retryTimer = setTimeout(connect, 3000);
			};

			ws.onerror = () => {
				/* onclose cuida da reconexão */
			};
		};

		connect();

		return () => {
			disposed = true;
			clearTimeout(retryTimer);
			clearTimeout(typingTimeoutRef.current);
			ws?.close();
			websocketRef.current = null;
			setIsConnected(false);
			setIsBotTyping(false);
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

	const handleToggle = () => {
		if (!open) requestNotificationPermission();
		setOpen((o) => !o);
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
				<Text style={{ color: C.muted, fontSize: '0.75em', fontStyle: 'italic' }}>
					{message.text}
				</Text>
			);
		}

		const isMine = message.username === usernameRef.current;
		const isBot = message.type === 'bot';

		return (
			<div
				style={{
					background: isMine ? C.mine : isBot ? C.botBg : C.surface,
					border: isBot
						? `1px solid ${C.botLine}`
						: isMine
							? '1px solid transparent'
							: `1px solid ${C.line}`,
					borderRadius: 12,
					padding: '8px 12px',
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				<Text
					style={{
						color: isBot ? C.botLine : isMine ? '#e0e7ff' : C.text,
						fontSize: '0.8em',
						fontWeight: 600,
					}}
				>
					{isBot ? '🤖 Wallace' : isMine ? 'Você' : message.username}
				</Text>
				<Text style={{ color: C.text, whiteSpace: 'pre-wrap' }}>{message.text}</Text>
				<Text style={{ color: isMine ? '#c7d2fe' : C.muted, fontSize: '0.65em' }}>
					{new Date(message.timestamp).toLocaleTimeString()}
				</Text>
			</div>
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
					<div
						className='flex flex-col'
						style={{
							width: '100%',
							height: '100%',
							background: C.bg,
							border: `1px solid ${C.line}`,
							borderRadius: 12,
							boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
							overflow: 'hidden',
						}}
					>
						<div
							className='flex items-center justify-between gap-2 p-3'
							style={{ borderBottom: `1px solid ${C.line}`, background: C.surface }}
						>
							<Space>
								<MessageOutlined style={{ color: C.botLine }} />
								<Text strong style={{ color: C.text }}>
									Fale com o Wallace
								</Text>
							</Space>
							<Space size='small'>
								{editingUsername ? (
									<Space.Compact>
										<Input
											size='small'
											value={usernameInput}
											onChange={(e) => setUsernameInput(e.target.value)}
											onPressEnter={saveUsername}
											style={{
												width: 110,
												background: C.bg,
												borderColor: C.line,
												color: C.text,
											}}
										/>
										<Button
											size='small'
											type='primary'
											onClick={saveUsername}
											style={{ background: C.mine }}
										>
											OK
										</Button>
									</Space.Compact>
								) : (
									<Button
										size='small'
										type='text'
										icon={<EditOutlined />}
										style={{ color: C.muted }}
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
									style={{ color: C.muted }}
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
												style={{
													color: C.muted,
													fontSize: '0.7em',
													background: C.surface,
													padding: '2px 10px',
													borderRadius: '10px',
												}}
											>
												{item.label}
											</Text>
										</div>
									);
								}

								const isSystem = item.data.type === 'system';
								const isMine = item.data.username === usernameRef.current;

								return (
									<div
										key={item.id}
										style={{
											display: 'flex',
											justifyContent: isSystem
												? 'center'
												: isMine
													? 'flex-end'
													: 'flex-start',
											maxWidth: '85%',
											alignSelf: isSystem ? 'center' : isMine ? 'flex-end' : 'flex-start',
										}}
									>
										{renderMessageContent(item.data)}
									</div>
								);
							})}
							{isBotTyping && (
								<div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
									<div
										style={{
											background: C.botBg,
											border: `1px dashed ${C.botLine}`,
											borderRadius: 12,
											padding: '8px 12px',
										}}
									>
										<Text
											style={{ color: C.botLine, fontSize: '0.8em', fontWeight: 600 }}
										>
											🤖 Wallace
										</Text>
										<Text style={{ color: C.muted, fontSize: '0.8em', marginLeft: 8 }}>
											digitando...
										</Text>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} className='messages-end-ref' />
						</div>

						<div
							className='flex flex-row gap-2 p-3'
							style={{ borderTop: `1px solid ${C.line}` }}
						>
							<Input
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder='Mande sua mensagem...'
								disabled={!isConnected}
								style={{
									background: C.surface,
									borderColor: C.line,
									color: C.text,
								}}
							/>
							<Button
								shape='circle'
								icon={<SendOutlined />}
								onClick={sendMessage}
								disabled={!isConnected || !inputMessage.trim()}
								style={{ background: C.mine, color: '#fff' }}
							/>
						</div>
					</div>
				</div>
			)}

			{showNudge && !open && (
				<button
					onClick={() => {
						requestNotificationPermission();
						setOpen(true);
					}}
					aria-label='Fale comigo — abrir chat'
					style={{
						position: 'fixed',
						right: 24,
						bottom: 96,
						zIndex: 1001,
						background: C.surface,
						color: C.text,
						border: `1px solid ${C.botLine}`,
						borderRadius: 12,
						padding: '8px 14px',
						fontFamily: 'Chakra Petch, sans-serif',
						fontWeight: 600,
						fontSize: 14,
						cursor: 'pointer',
						boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
						animation: 'chatNudgePulse 2s ease-in-out infinite',
					}}
				>
					Fale comigo!
					<span
						style={{
							position: 'absolute',
							bottom: -7,
							right: 26,
							width: 14,
							height: 14,
							background: C.surface,
							borderRight: `1px solid ${C.botLine}`,
							borderBottom: `1px solid ${C.botLine}`,
							transform: 'rotate(45deg)',
						}}
					/>
				</button>
			)}

			<Button
				shape='circle'
				icon={open ? <CloseOutlined /> : <MessageOutlined />}
				onClick={handleToggle}
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
			>
				{unreadCount > 0 && (
					<span
						className='absolute -top-1 -right-1 flex items-center justify-center rounded-full min-w-[20px] h-[20px] px-1 text-[12px] font-bold'
						style={{
							backgroundColor: '#ef4444',
							color: '#fff',
							border: '2px solid #fff',
						}}
					>
						{unreadCount > 99 ? '99+' : unreadCount}
					</span>
				)}
			</Button>
		</>
	);
};

export default ChatWidget;
