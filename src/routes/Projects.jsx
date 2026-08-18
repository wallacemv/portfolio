import React from 'react';
import { Tag, Space } from 'antd';
import {
	RobotOutlined,
	ShoppingCartOutlined,
	CameraOutlined,
	GithubOutlined,
	ExportOutlined,
} from '@ant-design/icons';
import { usePageMeta } from '../lib/seo';

const projects = [
	{
		name: 'SexyBot',
		icon: <RobotOutlined />,
		description:
			'Plataforma multi-tenant de gestão de modelos e bots do Telegram. Backend FastAPI com painel admin web, gerenciamento de conteúdo e integração de pagamentos (Mercado Pago e Stripe). Assistente de IA (Gemini) entrevista a modelo e gera a persona do bot automaticamente.',
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
			'Gemini',
		],
		github: 'https://github.com/wallacemv/sexybot',
		live: 'https://codedbywallace.dev/sexybot/',
		color: '#d946ef',
	},
	{
		name: 'Shop Commerce',
		icon: <ShoppingCartOutlined />,
		description:
			'Plataforma de e-commerce multi-tenant: cada loja com catálogo, carrinho, pedidos e administração próprios, tema/design system customizável por loja, checkout e relatórios exportáveis. Assistente de IA (Gemini) no admin ajuda a configurar a loja: explica as telas, escreve descrições e cadastra produtos, categorias, cupons e tema por chat.',
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
			'Gemini',
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
	usePageMeta({
		title: 'Projetos — Wallace Martins Vieira | Desenvolvedor Full Stack',
		description:
			'Projetos de Wallace Martins Vieira: SexyBot (bots de Telegram com IA), Shop Commerce (e-commerce multi-tenant) e Photojobs (conexão entre clientes e fotógrafos).',
		path: '/projects',
		jsonLd: {
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: 'Projetos de Wallace Martins Vieira',
			itemListElement: projects.map((p, i) => ({
				'@type': 'CreativeWork',
				position: i + 1,
				name: p.name,
				description: p.description,
				url: p.live || p.github,
				...(p.github && { codeRepository: p.github }),
			})),
		},
	});

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

				<div className='flex flex-col gap-4'>
					{projects.map((project) => (
						<div
							key={project.name}
							style={{
								backgroundColor: 'rgba(255,255,255,0.06)',
								borderLeft: `4px solid ${project.color}`,
							}}
							className='flex flex-col gap-3 p-4 rounded-lg text-[#ffffff]'
						>
							<div className='flex items-center justify-between gap-2 flex-wrap'>
								<Space align='center' size='middle'>
									<span
										style={{
											fontSize: '24px',
											color: project.color,
											display: 'inline-flex',
										}}
									>
										{project.icon}
									</span>
									<h2 className='text-2xl font-bold'>{project.name}</h2>
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
							</div>

							<div className='text-white/90'>{project.description}</div>

							<div className='flex flex-wrap gap-2'>
								{project.stack.map((tech) => (
									<Tag
										key={tech}
										style={{
											background: `${project.color}26`,
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
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Projects;