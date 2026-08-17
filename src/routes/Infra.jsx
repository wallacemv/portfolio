import React from 'react';
import { Card, Tag, Space, Divider } from 'antd';
import {
	CloudServerOutlined,
	ClusterOutlined,
	DockerOutlined,
	GlobalOutlined,
	LockOutlined,
	ApiOutlined,
	RobotOutlined,
	ShoppingCartOutlined,
	CameraOutlined,
	MessageOutlined,
	ProjectOutlined,
	DeploymentUnitOutlined,
} from '@ant-design/icons';

const apps = [
	{
		name: 'Portfolio',
		icon: <ProjectOutlined />,
		url: 'https://codedbywallace.dev/portfolio/',
		color: '#a855f7',
		desc: 'Este site. SPA React + Vite + Ant Design.',
		stack: ['React 18', 'Vite', 'Ant Design', 'Tailwind CSS'],
	},
	{
		name: 'WebSocket Server',
		icon: <MessageOutlined />,
		url: 'wss://codedbywallace.dev/websocket',
		color: '#22c55e',
		desc: 'Chat em tempo real usado na página Chat Amizade.',
		stack: ['Node.js'],
	},
	{
		name: 'SexyBot',
		icon: <RobotOutlined />,
		url: 'https://codedbywallace.dev/sexybot/',
		color: '#d946ef',
		desc: 'Plataforma multi-tenant de gestão de modelos e bots do Telegram, com IA.',
		stack: ['FastAPI', 'React 19', 'MySQL', 'Telegram Bot API', 'Gemini'],
	},
	{
		name: 'Shop Commerce',
		icon: <ShoppingCartOutlined />,
		url: 'https://codedbywallace.dev/shop-commerce/',
		color: '#22d3ee',
		desc: 'E-commerce multi-tenant com assistente de IA no admin.',
		stack: ['FastAPI', 'React 19', 'MySQL', 'TanStack Query', 'Zod', 'Gemini'],
	},
	{
		name: 'Photojobs',
		icon: <CameraOutlined />,
		url: 'https://codedbywallace.dev/photojobs/',
		color: '#fbbf24',
		desc: 'Plataforma para conectar clientes e fotógrafos/modelos.',
		stack: ['FastAPI', 'React 19', 'Vite', 'Tailwind CSS', 'shadcn'],
	},
];

const deploySteps = [
	{
		step: 'rsync',
		detail: 'Código local é enviado ao VPS via rsync (sem node_modules/dist).',
	},
	{
		step: 'docker build',
		detail: 'Imagem da aplicação é construída no servidor (multi-stage: node → nginx).',
	},
	{
		step: 'ctr import',
		detail: 'Imagem exportada do Docker e importada no containerd do k8s (ctr -n k8s.io).',
	},
	{
		step: 'kubectl apply',
		detail: 'Manifests de Deployment e Service aplicados no cluster k3s.',
	},
	{
		step: 'rollout',
		detail: 'Rolling update com probes de readiness/liveness e zero downtime.',
	},
];

const ai = [
	{
		app: 'SexyBot',
		model: 'Gemini (gemini-3.5-flash-lite)',
		detail:
			'Persona de uma modelo com funil de vendas guiando as conversas do bot no Telegram: geração de respostas, gatilhos de mídia e oferta de assinatura.',
		color: '#d946ef',
	},
	{
		app: 'Shop Commerce',
		model: 'Gemini (gemini-flash-latest)',
		detail:
			'Assistente de IA no painel admin: responde em JSON estruturado, envia histórico e imagens, com health check e chave de API criptografada no banco.',
		color: '#22d3ee',
	},
	{
		app: 'Photojobs',
		model: 'Sem LLM no momento',
		detail:
			'Integrações utilitárias: consulta de CEP via ViaCEP e cálculo de distância com haversine. IA pode entrar no futuro.',
		color: '#fbbf24',
	},
];

const Infra = () => {
	return (
		<div
			className='infra-wrapper h-full overflow-auto'
			style={{
				background:
					'radial-gradient(1100px 700px at 85% -10%, rgba(20,184,166,0.22), transparent 55%), #0f172a',
			}}
		>
			<div className='p-6 sm:p-8 text-[#fff]'>
				<h1 className='text-3xl font-bold mb-2'>Infraestrutura</h1>
				<p className='text-white/80 mb-6'>
					Como os projetos são servidos em produção.
				</p>

				<div className='flex flex-col gap-6'>
					<Card
						className='w-full'
						style={{
							backgroundColor: '#ffffff18',
							border: '1px solid #ffffff40',
							borderRadius: '12px',
							boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
						}}
						styles={{ body: { padding: '20px 24px' } }}
					>
						<Space direction='vertical' size='middle' className='w-full'>
							<Space align='center' size='middle'>
								<span
									className='inline-flex'
									style={{ fontSize: '26px', color: '#fff' }}
								>
									<CloudServerOutlined />
								</span>
								<h2 className='text-2xl font-bold'>Servidor</h2>
							</Space>
							<div className='text-white/90'>
								VPS Ubuntu 22.04 LTS em{' '}
								<span className='font-semibold text-white'>
									104.251.211.44 (codedbywallace.dev)
								</span>
								, com todos os apps rodando em Kubernetes (k3s v1.28).
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
								{[{
									icon: <ClusterOutlined />,
									title: 'Kubernetes (k3s)',
									desc: 'Orquestração de containers: Deployments, Services, namespaces, probes e rolling updates.',
								}, {
									icon: <DockerOutlined />,
									title: 'Docker + containerd',
									desc: 'Imagens construídas com Docker e importadas no containerd do k8s (ctr).',
								}, {
									icon: <GlobalOutlined />,
									title: 'Nginx (host)',
									desc: 'Reverse proxy na porta 443 com prefixos por app (/portfolio, /shop-commerce, /sexybot, /photojobs) para os serviços via *.svc.cluster.local.',
								}, {
									icon: <LockOutlined />,
									title: 'SSL Let\u2019s Encrypt',
									desc: 'Certificados automáticos no Nginx do host; dashboard em HTTPS na porta 8443.',
								}].map((item) => (
									<div
										key={item.title}
										className='flex flex-col gap-1 p-3 rounded-lg'
										style={{ backgroundColor: '#ffffff12' }}
									>
										<Space>
											<span className='inline-flex text-lg text-white/90'>
												{item.icon}
											</span>
											<span className='font-semibold'>{item.title}</span>
										</Space>
										<div className='text-sm text-white/80'>{item.desc}</div>
									</div>
								))}
							</div>
						</Space>
					</Card>

					<Card
						className='w-full'
						style={{
							backgroundColor: '#ffffff18',
							border: '1px solid #ffffff40',
							borderRadius: '12px',
							boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
						}}
						styles={{ body: { padding: '20px 24px' } }}
					>
						<Space direction='vertical' size='middle' className='w-full'>
							<Space align='center' size='middle'>
								<span
									className='inline-flex'
									style={{ fontSize: '26px', color: '#fff' }}
								>
									<DeploymentUnitOutlined />
								</span>
								<h2 className='text-2xl font-bold'>Aplicações hospedadas</h2>
							</Space>
							<div className='flex flex-col gap-3'>
								{apps.map((app) => (
									<div
										key={app.name}
										className='flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 rounded-lg'
										style={{
											backgroundColor: `${app.color}22`,
											border: `1px solid ${app.color}66`,
										}}
									>
										<div className='flex items-center gap-3 min-w-[180px]'>
											<span
												className='inline-flex text-xl'
												style={{ color: app.color }}
											>
												{app.icon}
											</span>
											<div className='flex flex-col'>
												<span className='font-semibold'>{app.name}</span>
												<a
													href={app.url}
													target='_blank'
													rel='noreferrer'
													className='text-xs text-white/70 hover:text-white underline underline-offset-2'
												>
													{app.url.replace('wss://', '').replace('https://', '')}
												</a>
											</div>
										</div>
										<div className='flex flex-col gap-1 flex-1'>
											<div className='text-sm text-white/85'>{app.desc}</div>
											<div className='flex flex-wrap gap-1.5'>
												{app.stack.map((tech) => (
													<Tag
														key={tech}
														style={{
															background: `${app.color}33`,
															border: `1px solid ${app.color}88`,
															color: '#fff',
															borderRadius: '999px',
															padding: '0 10px',
															fontSize: '11px',
														}}
													>
														{tech}
													</Tag>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
						</Space>
					</Card>

					<Card
						className='w-full'
						style={{
							backgroundColor: '#ffffff18',
							border: '1px solid #ffffff40',
							borderRadius: '12px',
							boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
						}}
						styles={{ body: { padding: '20px 24px' } }}
					>
						<Space direction='vertical' size='middle' className='w-full'>
							<Space align='center' size='middle'>
								<span
									className='inline-flex'
									style={{ fontSize: '26px', color: '#fff' }}
								>
									<ApiOutlined />
								</span>
								<h2 className='text-2xl font-bold'>Integração com IA</h2>
							</Space>
							<div className='flex flex-col gap-3'>
								{ai.map((item) => (
									<div
										key={item.app}
										className='flex flex-col gap-1 p-3 rounded-lg'
										style={{
											backgroundColor: `${item.color}22`,
											border: `1px solid ${item.color}66`,
										}}
									>
										<div className='flex items-center gap-2 flex-wrap'>
											<span className='font-semibold'>{item.app}</span>
											<Tag
												style={{
													background: `${item.color}33`,
													border: `1px solid ${item.color}88`,
													color: '#fff',
													borderRadius: '999px',
													padding: '0 10px',
													fontSize: '11px',
												}}
											>
												{item.model}
											</Tag>
										</div>
										<div className='text-sm text-white/85'>{item.detail}</div>
									</div>
								))}
							</div>
						</Space>
					</Card>

					<Card
						className='w-full'
						style={{
							backgroundColor: '#ffffff18',
							border: '1px solid #ffffff40',
							borderRadius: '12px',
							boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
						}}
						styles={{ body: { padding: '20px 24px' } }}
					>
						<Space direction='vertical' size='middle' className='w-full'>
							<Space align='center' size='middle'>
								<span
									className='inline-flex'
									style={{ fontSize: '26px', color: '#fff' }}
								>
									<DockerOutlined />
								</span>
								<h2 className='text-2xl font-bold'>Fluxo de deploy</h2>
							</Space>
							<div className='flex flex-col gap-3'>
								{deploySteps.map((item, i) => (
									<div key={item.step} className='flex items-start gap-3'>
										<span
											className='inline-flex items-center justify-center rounded-full font-bold'
											style={{
												minWidth: '28px',
												height: '28px',
												backgroundColor: '#ffffff25',
												border: '1px solid #ffffff55',
											}}
										>
											{i + 1}
										</span>
										<div className='flex flex-col'>
											<span className='font-semibold'>{item.step}</span>
											<span className='text-sm text-white/80'>
												{item.detail}
											</span>
										</div>
									</div>
								))}
							</div>
						</Space>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Infra;