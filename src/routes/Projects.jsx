import React from 'react';
import { Card, Tag, Space, Divider } from 'antd';
import {
	RobotOutlined,
	ShoppingCartOutlined,
	CameraOutlined,
	GithubOutlined,
	ExportOutlined,
} from '@ant-design/icons';

const projects = [
	{
		name: 'SexyBot',
		icon: <RobotOutlined />,
		description:
			'Plataforma multi-tenant de gestão de modelos e bots do Telegram. Backend FastAPI com painel admin web, gerenciamento de conteúdo e integração de pagamentos (Mercado Pago e Stripe).',
		stack: [
			'Python',
			'FastAPI',
			'SQLAlchemy',
			'MySQL',
			'React 19',
			'TypeScript',
			'Tailwind CSS',
			'shadcn',
			'Telegram Bot API',
		],
		github: 'https://github.com/wallacemv/sexybot',
		live: 'https://codedbywallace.dev/sexybot/',
		color: '#d946ef',
	},
	{
		name: 'Shop Commerce',
		icon: <ShoppingCartOutlined />,
		description:
			'Plataforma de e-commerce multi-tenant: cada loja com catálogo, carrinho, pedidos e administração próprios, tema/design system customizável por loja, checkout e relatórios exportáveis.',
		stack: [
			'FastAPI',
			'SQLAlchemy',
			'MySQL',
			'React 19',
			'TypeScript',
			'Vite',
			'Tailwind CSS',
			'TanStack Query',
			'Zod',
		],
		github: 'https://github.com/wallacemv/shop-commerce',
		live: 'https://codedbywallace.dev/shop-commerce/',
		color: '#22d3ee',
	},
	{
		name: 'Photojobs',
		icon: <CameraOutlined />,
		description:
			'Plataforma para conectar clientes e fotógrafos/modelos: busca por estado e cidade, cálculo de distância (haversine), consulta de CEP (ViaCEP), verificação de idade e upload de fotos.',
		stack: [
			'FastAPI',
			'SQLAlchemy',
			'React 19',
			'TypeScript',
			'Vite',
			'Tailwind CSS',
			'shadcn',
			'Framer Motion',
		],
		live: 'https://codedbywallace.dev/photojobs/',
		color: '#fbbf24',
	},
];

const Projects = () => {
	return (
		<div
			className='projects-wrapper h-full overflow-auto'
			style={{
				background:
					'radial-gradient(1100px 700px at 85% -10%, rgba(168,85,247,0.22), transparent 55%), #0f172a',
			}}
		>
			<div className='p-6 sm:p-8 text-[#fff]'>
				<h1 className='text-3xl font-bold mb-2'>Projetos</h1>
				<p className='text-white/80 mb-6'>
					Alguns dos projetos que desenvolvi recentemente.
				</p>

				<div className='flex flex-col gap-6'>
					{projects.map((project) => (
						<Card
							key={project.name}
							className='w-full backdrop-blur-sm'
							style={{
								backgroundColor: `${project.color}2e`,
								border: `1px solid ${project.color}66`,
								borderRadius: '12px',
								boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
							}}
							styles={{
								body: { padding: '20px 24px' },
							}}
						>
							<Space direction='vertical' size='middle' className='w-full'>
								<Space align='center' className='w-full justify-between'>
									<Space align='center' size='middle'>
										<span
											style={{
												fontSize: '28px',
												color: project.color,
												display: 'inline-flex',
											}}
										>
											{project.icon}
										</span>
										<h2
											className='text-2xl font-bold'
											style={{ color: '#fff' }}
										>
											{project.name}
										</h2>
									</Space>
									<Space size='small' wrap>
										{project.github && (
											<a
												href={project.github}
												target='_blank'
												rel='noreferrer'
												className='text-white hover:text-white/70'
												style={{ fontSize: '22px' }}
												aria-label={`GitHub do ${project.name}`}
											>
												<GithubOutlined />
											</a>
										)}
										{project.live && (
											<a
												href={project.live}
												target='_blank'
												rel='noreferrer'
												className='text-white hover:text-white/70'
												style={{ fontSize: '22px' }}
												aria-label={`Demo do ${project.name}`}
											>
												<ExportOutlined />
											</a>
										)}
									</Space>
								</Space>

								<div className='text-white/90'>{project.description}</div>

								<Divider style={{ margin: '4px 0', borderColor: '#ffffff33' }} />

								<div className='flex flex-wrap gap-2'>
									{project.stack.map((tech) => (
										<Tag
											key={tech}
											style={{
												background: `${project.color}33`,
												border: `1px solid ${project.color}88`,
												color: '#fff',
												borderRadius: '999px',
												padding: '2px 12px',
												fontWeight: 500,
											}}
										>
											{tech}
										</Tag>
									))}
								</div>
							</Space>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default Projects;