import React from 'react';
import { Tag, Space } from 'antd';
import {
	CloudServerOutlined,
	ClusterOutlined,
	DockerOutlined,
	GlobalOutlined,
	LockOutlined,
	ShoppingCartOutlined,
	MessageOutlined,
	ProjectOutlined,
	DeploymentUnitOutlined,
} from '@ant-design/icons';
import { usePageMeta } from '../lib/seo';

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
		desc: 'Chat em tempo real com o Wallace — bot com IA (Gemini) que responde como o dono do portfólio, com boas-vindas e notificação no navegador.',
		stack: ['Node.js', 'WebSocket', 'Gemini'],
	},
	{
		name: 'Shop Commerce',
		icon: <ShoppingCartOutlined />,
		url: 'https://codedbywallace.dev/shop-commerce/',
		color: '#22d3ee',
		desc: 'E-commerce multi-tenant: pagamentos (Mercado Pago/Stripe), WhatsApp, uploads em R2 e assistente de IA no admin.',
		stack: ['FastAPI', 'React 19', 'MySQL', 'Redis', 'Cloudflare R2', 'TanStack Query', 'Zod', 'Gemini'],
	},
];

const deploySteps = [
	{
		step: 'git pull',
		detail: 'O código vem do GitHub (deploy key): no servidor, git fetch + reset --hard.',
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

const Infra = () => {
	usePageMeta({
		title: 'Infraestrutura e Deploy | Wallace Martins Vieira',
		description:
			'Como os projetos de Wallace Martins Vieira são servidos em produção: VPS Ubuntu, Kubernetes (k3s), Docker, Nginx e SSL Let\u2019s Encrypt.',
		path: '/infra',
		jsonLd: {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://codedbywallace.dev/portfolio/' },
				{ '@type': 'ListItem', position: 2, name: 'Infraestrutura', item: 'https://codedbywallace.dev/portfolio/infra' },
			],
		},
	});

	return (
		<div
			className='infra-wrapper h-full overflow-auto'
			style={{
				background:
					'radial-gradient(1100px 700px at 85% -10%, rgba(20,184,166,0.22), transparent 55%)',
			}}
		>
			<div className='p-6 sm:p-8 text-[#fff]'>
				<h1 className='text-3xl font-bold mb-2'>Infraestrutura</h1>
				<p className='text-white/80 mb-6'>
					Como os projetos são servidos em produção.
				</p>

				<div className='flex flex-col gap-4'>
					<div
						className='flex flex-col gap-3 p-4 rounded-lg text-[#ffffff]'
						style={{
							backgroundColor: '#334155',
							border: '1px solid rgba(255,255,255,0.15)',
							borderLeft: '4px solid #14b8a6',
						}}
					>
						<div className='flex items-center gap-3'>
							<span
								className='inline-flex'
								style={{ fontSize: '26px', color: '#14b8a6' }}
							>
								<CloudServerOutlined />
							</span>
							<h2 className='text-2xl font-bold'>Servidor</h2>
						</div>
						<div className='text-white/90'>
							VPS Ubuntu 22.04 LTS com todos os apps rodando em Kubernetes (k3s v1.28).
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
								desc: 'Reverse proxy na porta 443 com prefixos por app (/portfolio, /shop-commerce) para os serviços via *.svc.cluster.local.',
							}, {
								icon: <LockOutlined />,
								title: 'SSL Let\u2019s Encrypt',
								desc: 'Certificados automáticos no Nginx do host; dashboard em HTTPS na porta 8443.',
							}].map((item) => (
								<div
									key={item.title}
									className='flex flex-col gap-1 p-3 rounded-lg'
									style={{ backgroundColor: '#475569', border: '1px solid rgba(255,255,255,0.14)' }}
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
					</div>

					<div
						className='flex flex-col gap-3 p-4 rounded-lg text-[#ffffff]'
						style={{
							backgroundColor: '#334155',
							border: '1px solid rgba(255,255,255,0.15)',
							borderLeft: '4px solid #0ea5e9',
						}}
					>
						<div className='flex items-center gap-3'>
							<span
								className='inline-flex'
								style={{ fontSize: '26px', color: '#0ea5e9' }}
							>
								<DeploymentUnitOutlined />
							</span>
							<h2 className='text-2xl font-bold'>Aplicações hospedadas</h2>
						</div>
						<div className='flex flex-col gap-3'>
							{apps.map((app) => (
								<div
									key={app.name}
									className='flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 rounded-lg'
									style={{
										backgroundColor: '#475569',
										border: `1px solid ${app.color}99`,
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
														background: '#475569',
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
					</div>

					<div
						className='flex flex-col gap-3 p-4 rounded-lg text-[#ffffff]'
						style={{
							backgroundColor: '#334155',
							border: '1px solid rgba(255,255,255,0.15)',
							borderLeft: '4px solid #f59e0b',
						}}
					>
						<div className='flex items-center gap-3'>
							<span
								className='inline-flex'
								style={{ fontSize: '26px', color: '#f59e0b' }}
							>
								<DockerOutlined />
							</span>
							<h2 className='text-2xl font-bold'>Fluxo de deploy</h2>
						</div>
						<div className='flex flex-col gap-3'>
							{deploySteps.map((item, i) => (
								<div key={item.step} className='flex items-start gap-3'>
									<span
										className='inline-flex items-center justify-center rounded-full font-bold'
										style={{
											minWidth: '28px',
											height: '28px',
											backgroundColor: '#475569',
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default Infra;