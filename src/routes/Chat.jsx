import React, { useState, useEffect, useRef } from 'react';
import {
	Layout,
	Card,
	Input,
	Button,
	Typography,
	Space,
	Badge,
	App,
} from 'antd';
import {
	SendOutlined,
	MessageOutlined,
	WifiOutlined,
	DisconnectOutlined,
	EditOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Text } = Typography;

//explique como inicia esse  codigo e o que ele faz
//

const Chat = () => {
	const { message } = App.useApp();
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [username, setUsername] = useState('');
	const [usernameInput, setUsernameInput] = useState('');
	const [editingUsername, setEditingUsername] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const websocketRef = useRef(null);
	const messagesEndRef = useRef(null);

	// Scroll to bottom when messages change
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

		// Establish WebSocket connection
		websocketRef.current = new WebSocket('wss://codedbywallace.dev/websocket');

		websocketRef.current.onopen = () => {
			setIsConnected(true);
			//addSystemMessage('Connected to chat server');

			message.success('Connectado!');
		};

		websocketRef.current.onmessage = (event) => {
			const messageData = JSON.parse(event.data);

			if (messageData.type === 'history') {
				setMessages(messageData.messages);
				return;
			}

			// Only add message if it's not from the current user
			// This prevents duplicate messages
			if (messageData.username !== username) {
				setMessages((prevMessages) => [...prevMessages, messageData]);
			}
		};

		websocketRef.current.onclose = () => {
			setIsConnected(false);
			addSystemMessage('Desconectado do chat.');
			message.error('Desconectado do chat.');
		};

		websocketRef.current.onerror = (error) => {
			console.error('WebSocket Error:', error);
			//addSystemMessage('Connection error');
			message.error('Connection error');
		};

		// [
		// 	{
		// 		username: 'Wallace test',
		// 		text: 'asda',
		// 		type: 'user',
		// 		timestamp: '2024-11-30T15:26:14.219Z',
		// 	},
		// 	{
		// 		username: 'Wallace test',
		// 		text: 'asda',
		// 		type: 'user',
		// 		timestamp: '2024-11-30T15:26:14.219Z',
		// 	},
		// 	{
		// 		username: 'Wallace test',
		// 		text: 'asda',
		// 		type: 'user',
		// 		timestamp: '2024-11-30T15:26:14.219Z',
		// 	},
		// 	{
		// 		username: 'Wallace test',
		// 		text: 'asda',
		// 		type: 'user',
		// 		timestamp: '2024-11-30T15:26:14.219Z',
		// 	},
		// 	{
		// 		username: 'Wallace test',
		// 		text: 'asda',
		// 		type: 'user',
		// 		timestamp: '2024-11-30T15:26:14.219Z',
		// 	},
		// 	{
		// 		username: 'Wallace test',
		// 		text: 'asda',
		// 		type: 'user',
		// 		timestamp: '2024-11-30T15:26:14.219Z',
		// 	},
		// 	{
		// 		username: 'Wallace test',
		// 		text: 'asda',
		// 		type: 'user',
		// 		timestamp: '2024-11-30T15:26:14.219Z',
		// 	},
		// ].forEach((message) => {
		// 	setMessages((prevMessages) => [...prevMessages, message]);
		// });

		// Cleanup on component unmount
		return () => {
			if (websocketRef.current) {
				websocketRef.current.close();
			}
		};
	}, []);

	const addSystemMessage = (text) => {
		const systemMessage = {
			type: 'system',
			text,
			timestamp: new Date().toISOString(),
		};
		setMessages((prevMessages) => [...prevMessages, systemMessage]);
	};

	const sendMessage = () => {
		if (!inputMessage.trim() || !isConnected) return;

		const messageObject = {
			username,
			text: inputMessage,
			type: 'user',
			timestamp: new Date().toISOString(),
		};

		// Send message via WebSocket
		websocketRef.current.send(JSON.stringify(messageObject));

		// Add message to local state
		//setMessages((prevMessages) => [...prevMessages, messageObject]);

		// Clear input
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
		// System message
		if (message.type === 'system') {
			return (
				// <Card
				// 	size='small'
				// 	style={{
				// 		backgroundColor: '#f0f0f0',
				// 		textAlign: 'center',
				// 		fontStyle: 'italic',
				// 	}}
				// >
				//	{message.text}
				//</Card>
				//
				//
				<Text className='text-center text-sm italic underline'>
					{message.text}
				</Text>
			);
		}

		// User message
		return (
			<Card
				size='small'
				style={{
					backgroundColor:
						message.username === username ? '#e6f7ff' : '#f6ffed',
					alignSelf: message.username === username ? 'flex-end' : 'flex-start',
				}}
			>
				<Space direction='vertical' size='small' className='gap-1'>
					<Text strong>
						{message.username === username ? 'You' : message.username}
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
		<div className='chat-wrapper relative h-full bg-[#22c55e]'>
			<div
				style={{
					transform: 'translate(-50%, -50%)',
					top: '50%',
					left: '50%',
					position: 'relative',
					width: '80%',
				}}
			>
				<Card
					title={
						<Space className='flex justify-between' style={{ width: '100%' }}>
							<Space>
								<MessageOutlined />
								<Text strong>Chat Amizade</Text>
							</Space>
							<Space>
								<span style={{ color: '#999', fontSize: 12 }}>Seu nickname:</span>
								{editingUsername ? (
									<Space.Compact>
										<Input
											size='small'
											value={usernameInput}
											onChange={(e) => setUsernameInput(e.target.value)}
											onPressEnter={saveUsername}
											style={{ width: 150 }}
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
						</Space>
					}
					style={{
						width: '100%',
						maxHeight: '400px',
						flexGrow: 1,
						borderRadius: '12px',
						boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
						display: 'flex',
						flexDirection: 'column',
					}}
					styles={{
						body: {
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							padding: '16px',
							overflow: 'hidden',
						},
					}}
				>
					<Content
						style={{
							flex: 1,
							overflowY: 'auto',
							display: 'flex',
							flexDirection: 'column',
							gap: 8,
							padding: '12px',
							border: 'solid 1px #000',
						}}
					>
						{groupMessagesByDate(messages).map((item) => {
							if (item.type === 'date') {
								return (
									<div
										key={item.id}
										style={{
											textAlign: 'center',
											margin: '8px 0',
										}}
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
												: message.username === username
													? 'flex-end'
													: 'flex-start',
										maxWidth: '80%',
										alignSelf:
											message.username === username ? 'flex-end' : 'flex-start',
									}}
								>
									{renderMessageContent(message)}
								</div>
							);
						})}
						<div ref={messagesEndRef} className='messages-end-ref' />
					</Content>
					<Space.Compact className='flex flex-row w-full   bg-white gap-4 mt-4'>
						<div className='flex flex-1'>
							<Input
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder='Type your message...'
								disabled={!isConnected}
							/>
						</div>
						<div className='flex items-center'>
							<Button
								shape='circle'
								icon={<SendOutlined />}
								onClick={sendMessage}
								disabled={!isConnected || !inputMessage.trim()}
							></Button>
						</div>
					</Space.Compact>
				</Card>
			</div>
		</div>
	);
};

export default Chat;
