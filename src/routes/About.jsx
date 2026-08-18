import { Tag } from 'antd';
import {
	LinkedinOutlined,
	MailOutlined,
	GithubOutlined,
	InstagramOutlined,
	GlobalOutlined,
} from '@ant-design/icons';
import { usePageMeta } from '../lib/seo';

const experience = [
	{
		role: 'Desenvolvedor Fullstack - Nest.js, Angular',
		company: 'Sem Parar',
		period: 'Jan 2019 - Jul 2026',
		desc: 'Node.js, TypeScript, Java, NestJS, Angular, Ionic',
		color: '#b94e98',
	},
	{
		role: 'Desenvolvedor Java Sênior',
		company: 'Telefonia Empresarial Vivo',
		period: 'Ago 2017 - Jan 2019',
		desc: 'Java, Angular, Oracle, SOA',
		color: '#575dd4',
	},
	{
		role: 'Desenvolvedor front-end (freelance)',
		company: 'HDI Seguros',
		period: 'Mar 2021 - Abr 2021',
		desc: 'Node.js, TypeScript, Angular, HTML, Sass, React Native',
		color: '#99afff',
	},
	{
		role: 'Desenvolvedor Mobile',
		company: 'Elocc',
		period: 'Jan 2017 - Ago 2017',
		desc: 'Apache Cordova, Ionic, JavaScript, HTML, CSS, Sass',
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
					'radial-gradient(1100px 700px at 85% -10%, rgba(59,130,246,0.22), transparent 55%), #0f172a',
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
						backgroundColor: 'rgba(255,255,255,0.06)',
						borderLeft: '4px solid #3b82f6',
					}}
				>
					<p className='text-white/90 leading-relaxed'>
						Sou Specialist Full Stack Developer com mais de 15 anos de
						experiência no desenvolvimento de softwares escaláveis, baseado
						em São Paulo. Construo aplicações web e mobile: APIs em Node.js,
						NestJS e Java (Spring Boot), front-ends em Angular e React, e
						apps híbridos com Ionic/React Native. Bacharel em Sistemas de
						Informação pela Universidade Ibirapuera e pós-graduado em
						Desenvolvimento de Aplicações Java — SOA.
					</p>
					<p className='text-white/90 leading-relaxed'>
						Já trabalhei em projetos de telemedicina, seguros e empresas de
						grande porte como Sem Parar, Vivo e HDI Seguros. Hoje mantenho
						projetos próprios em produção (e-commerce, bots com IA, apps) em
						infraestrutura Kubernetes na nuvem.
					</p>
					<div className='flex flex-row gap-4 text-2xl mt-2'>
						<a
							href='https://www.linkedin.com/in/wallacemarttins'
							target='_blank'
							rel='noreferrer'
							aria-label='LinkedIn'
							style={{ color: '#fff' }}
						>
							<LinkedinOutlined />
						</a>
						<a
							href='https://github.com/wallacemv'
							target='_blank'
							rel='noreferrer'
							aria-label='GitHub'
							style={{ color: '#fff' }}
						>
							<GithubOutlined />
						</a>
						<a
							href='https://www.instagram.com/wallacemarttins'
							target='_blank'
							rel='noreferrer'
							aria-label='Instagram'
							style={{ color: '#fff' }}
						>
							<InstagramOutlined />
						</a>
						<a
							href='mailto:wallacemv@gmail.com'
							aria-label='Email'
							style={{ color: '#fff' }}
						>
							<MailOutlined />
						</a>
						<a
							href='https://codedbywallace.dev'
							target='_blank'
							rel='noreferrer'
							aria-label='Site'
							style={{ color: '#fff' }}
						>
							<GlobalOutlined />
						</a>
					</div>
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
								backgroundColor: 'rgba(255,255,255,0.06)',
								borderLeft: '4px solid #60a5fa',
							}}
						>
							<div className='font-semibold'>{item.title}</div>
							<div className='text-sm opacity-80'>{item.place}</div>
							<div className='text-xs opacity-60'>{item.period}</div>
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
								backgroundColor: 'rgba(255,255,255,0.06)',
								borderLeft: '4px solid #93c5fd',
							}}
						>
							<div className='font-semibold'>{item.language}</div>
							<div className='text-sm opacity-80'>{item.level}</div>
						</div>
					))}
				</div>

				<h2 className='text-2xl font-bold mb-3'>Habilidades</h2>
				<div className='flex flex-wrap gap-2 mb-6'>
					{skills.map((skill) => (
						<Tag
							key={skill}
							style={{
								background: '#3b82f626',
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
								backgroundColor: 'rgba(255,255,255,0.06)',
								borderLeft: `4px solid ${exp.color}`,
							}}
							className='flex flex-1 flex-col p-4 rounded-lg text-[#ffffff]'
						>
							<div className='font-semibold'>{exp.role}</div>
							<div className='text-sm opacity-80'>{exp.company}</div>
							{exp.period && (
								<div className='text-xs opacity-60'>{exp.period}</div>
							)}
							<div className='text-sm mt-1 opacity-70'>{exp.desc}</div>
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
									background: '#6366f126',
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
