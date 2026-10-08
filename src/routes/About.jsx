import { Tag } from 'antd';
import { usePageMeta } from '../lib/seo';

const experience = [
	{
		role: 'Desenvolvedor Fullstack - Nest.js, Angular',
		company: 'Sem Parar',
		period: 'Jan 2019 - Jul 2026',
		desc: 'APIs com Node.js/NestJS e Java, front-end Angular, apps híbridos Ionic em produto de mobilidade de grande porte.',
		highlights: [
			'Desenvolvimento fullstack em produto de mobilidade (telemetria, tag e apps) que atende milhares de usuários',
			'APIs e integrações em Node.js/NestJS e Java dialogando com sistemas legados e serviços externos',
			'Front-end Angular e apps híbridos Ionic com entregas frequentes em ambiente de alta criticidade',
		],
		color: '#b94e98',
	},
	{
		role: 'Desenvolvedor Java Sênior',
		company: 'Telefonia Empresarial Vivo',
		period: 'Ago 2017 - Jan 2019',
		desc: 'Serviços e integrações Java (SOA/Oracle) e front-end Angular em telecom empresarial.',
		highlights: [
			'Serviços e integrações Java em arquitetura SOA com Oracle para telecom empresarial',
			'APIs e sistemas que sustentam produtos de telefonia fixa e móvel corporativa',
		],
		color: '#575dd4',
	},
	{
		role: 'Desenvolvedor front-end (freelance)',
		company: 'HDI Seguros',
		period: 'Mar 2021 - Abr 2021',
		desc: 'Front-end TypeScript/Angular com Sass em portal do mercado de seguros.',
		highlights: [
			'Front-end com TypeScript, Angular e Sass para o mercado de seguros',
			'Construção de telas e componentes consumindo APIs do segurador',
		],
		color: '#99afff',
	},
	{
		role: 'Desenvolvedor Mobile',
		company: 'Elocc',
		period: 'Jan 2017 - Ago 2017',
		desc: 'Desenvolvimento de apps híbridos com Apache Cordova e Ionic.',
		highlights: [
			'Apps híbridos Android/iOS com Apache Cordova e Ionic',
			'Desenvolvimento mobile com JavaScript, HTML e CSS',
		],
		color: '#99afff',
	},
];

const skills = [
	'Node.js',
	'TypeScript',
	'JavaScript',
	'Java',
	'Angular',
	'React.js',
	'React Native',
	'Ionic',
	'HTML, CSS, Sass',
	'PHP',
	'Spring Boot',
	'Python',
	'SQL',
	'Git',
	'NestJS',
	'Docker',
	'Kubernetes',
	'FastAPI',
];

const About = () => {
	usePageMeta({
		title: 'Sobre | Wallace Martins Vieira — Desenvolvedor Full Stack',
		description:
			'Wallace Martins Vieira, Specialist Full Stack Developer com 15+ anos no desenvolvimento de softwares escaláveis. Bacharel em Sistemas de Informação pela Universidade Ibirapuera. São Paulo.',
		path: '/about',
		jsonLd: [{
			'@context': 'https://schema.org',
			'@type': 'AboutPage',
			name: 'Sobre Wallace Martins Vieira',
			url: 'https://codedbywallace.dev/portfolio/about',
			description:
				'Biografia, formação, idiomas e experiência de Wallace Martins Vieira, desenvolvedor full stack.',
		}, {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://codedbywallace.dev/portfolio/' },
				{ '@type': 'ListItem', position: 2, name: 'Sobre', item: 'https://codedbywallace.dev/portfolio/about' },
			],
		}],
	});

	return (
		<div
			className='about-wrapper h-full overflow-auto'
			style={{
				background:
					'radial-gradient(1100px 700px at 85% -10%, rgba(59,130,246,0.22), transparent 55%)',
			}}
		>
			<div className='p-6 sm:p-8 text-[#fff]'>
				<h1 className='text-3xl font-bold mb-2'>Sobre</h1>
				<p className='text-white/80 mb-6'>
					Specialist Full Stack Developer com 15+ anos de experiência.
				</p>

				<div
					className='flex flex-col gap-3 p-4 rounded-lg mb-4'
					style={{
						backgroundColor: '#334155',
						border: '1px solid rgba(255,255,255,0.15)',
						borderLeft: '4px solid #3b82f6',
					}}
				>
					<p className='text-white/90 leading-relaxed'>
						Sou desenvolvedor full stack baseado em São Paulo. Construo
						aplicações web e mobile: APIs em Node.js, NestJS e Java (Spring
						Boot), front-ends em Angular e React, e apps híbridos com
						Ionic/React Native.
					</p>
					<p className='text-white/90 leading-relaxed'>
						Já trabalhei em projetos de telemedicina, seguros e empresas de
						grande porte. Hoje mantenho projetos próprios em produção
						(e-commerce, apps) em infraestrutura Kubernetes na nuvem.
					</p>
				</div>

				<h2 className='text-2xl font-bold mb-3'>Formação acadêmica</h2>
				<div className='flex flex-col sm:flex-row gap-4 mb-6'>
					{[
						{
							title: 'Bacharelado em Sistemas de Informação',
							place: 'Universidade Ibirapuera',
							period: '2005 - 2009',
						},
						{
							title: 'Pós-graduação em Desenvolvimento de Aplicações Java — SOA',
							place: 'Especialização',
							period: 'Concluída',
						},
					].map((item) => (
						<div
							key={item.title}
							className='flex-1 flex flex-col gap-1 p-4 rounded-lg'
							style={{
								backgroundColor: '#334155',
								border: '1px solid rgba(255,255,255,0.15)',
								borderLeft: '4px solid #60a5fa',
							}}
						>
							<div className='font-semibold'>{item.title}</div>
							<div className='text-sm text-white/90'>{item.place}</div>
							<div className='text-xs text-white/70'>{item.period}</div>
						</div>
					))}
				</div>

				<h2 className='text-2xl font-bold mb-3'>Idiomas</h2>
				<div className='flex flex-col sm:flex-row gap-4 mb-6'>
					{[
						{ language: 'Português', level: 'Nativo' },
						{ language: 'Inglês', level: 'Básico a intermediário' },
					].map((item) => (
						<div
							key={item.language}
							className='flex-1 flex flex-col gap-1 p-4 rounded-lg'
							style={{
								backgroundColor: '#334155',
								border: '1px solid rgba(255,255,255,0.15)',
								borderLeft: '4px solid #93c5fd',
							}}
						>
							<div className='font-semibold'>{item.language}</div>
							<div className='text-sm text-white/90'>{item.level}</div>
						</div>
					))}
				</div>

				<h2 className='text-2xl font-bold mb-3'>Habilidades</h2>
				<div className='flex flex-wrap gap-2 mb-6'>
					{skills.map((skill) => (
						<Tag
							key={skill}
							style={{
								background: '#475569',
								border: '1px solid #3b82f688',
								color: '#fff',
								borderRadius: '999px',
								padding: '2px 12px',
								fontWeight: 500,
							}}
						>
							{skill}
						</Tag>
					))}
				</div>

				<h2 className='text-2xl font-bold mb-3'>Experiências profissionais</h2>
				<div className='flex flex-col gap-4 mb-6'>
					{experience.map((exp) => (
						<div
							key={exp.company}
							style={{
								backgroundColor: '#334155',
								border: '1px solid rgba(255,255,255,0.15)',
								borderLeft: `4px solid ${exp.color}`,
							}}
							className='flex flex-1 flex-col p-4 rounded-lg'
						>
							<div className='font-semibold text-white'>{exp.role}</div>
							<div className='text-sm text-white/90'>{exp.company}</div>
							{exp.period && (
								<div className='text-xs text-white/70'>{exp.period}</div>
							)}
							<div className='text-sm mt-1 text-white/85'>{exp.desc}</div>
							{exp.highlights && (
								<ul className='mt-2 flex flex-col gap-1 list-none m-0 p-0'>
									{exp.highlights.map((h) => (
										<li
											key={h}
											className='text-sm text-white/85 flex gap-2'
										>
											<span
												className='inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0'
												style={{ backgroundColor: exp.color }}
											/>
											<span>{h}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					))}
				</div>

				<h2 className='text-2xl font-bold mb-3'>Stack deste site</h2>
				<div className='flex flex-wrap gap-2'>
					{['Vite', 'React', 'React Router', 'Ant Design', 'Tailwind CSS', 'WebSocket', 'Kute.js', 'Potrace', 'Docker', 'Nginx', 'Kubernetes'].map(
						(tech) => (
							<Tag
								key={tech}
								style={{
									background: '#475569',
									border: '1px solid #6366f188',
									color: '#fff',
									borderRadius: '999px',
									padding: '2px 12px',
								}}
							>
								{tech}
							</Tag>
						),
					)}
				</div>
			</div>
		</div>
	);
};

export default About;
