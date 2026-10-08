import React from 'react';
import { Tag, Space } from 'antd';
import {
	ShoppingCartOutlined,
	GithubOutlined,
	ExportOutlined,
} from '@ant-design/icons';
import { usePageMeta } from '../lib/seo';

const projects = [
	{
		name: 'Shop Commerce',
		icon: <ShoppingCartOutlined />,
		description:
			'Plataforma de e-commerce multi-tenant: cada loja com catálogo, carrinho, pedidos, cupons e avaliações próprios, tema/design system customizável por loja e checkout transacional com baixa de estoque. Pagamentos com Mercado Pago e Stripe (Pix, cartão e entrega), uploads de mídia em Cloudflare R2, atribuição de tráfego (UTM/share com GA4), notificações de pedido por WhatsApp (Evolution API) e relatórios exportáveis. Assistente de IA (Gemini) no admin ajuda a configurar a loja: explica as telas, escreve descrições e cadastra produtos, categorias, cupons e tema por chat.',
		stack: [
			'FastAPI',
			'SQLAlchemy async',
			'MySQL 8',
			'Alembic',
			'Redis',
			'React 19',
			'TypeScript',
			'Vite',
			'Tailwind CSS',
			'shadcn',
			'TanStack Query',
			'Zod',
			'Mercado Pago',
			'Stripe',
			'Cloudflare R2',
			'Gemini',
		],
		github: 'https://github.com/wallacemv/shop-commerce',
		live: 'https://codedbywallace.dev/shop-commerce/',
		color: '#22d3ee',
	},
];

const Projects = () => {
	usePageMeta({
		title: 'Projetos | Wallace Martins Vieira — Desenvolvedor Full Stack',
		description:
			'Projetos desenvolvidos por Wallace Martins Vieira: Shop Commerce (e-commerce multi-tenant).',
		path: '/projects',
		jsonLd: [{
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
		}, {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://codedbywallace.dev/portfolio/' },
				{ '@type': 'ListItem', position: 2, name: 'Projetos', item: 'https://codedbywallace.dev/portfolio/projects' },
			],
		}],
	});

	return (
		<div
			className='projects-wrapper h-full overflow-auto'
			style={{
				background:
					'radial-gradient(1100px 700px at 85% -10%, rgba(168,85,247,0.22), transparent 55%)',
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
								backgroundColor: '#334155',
								border: '1px solid rgba(255,255,255,0.15)',
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
											background: '#475569',
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