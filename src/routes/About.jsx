import { Tag } from 'antd';
import { usePageMeta } from '../lib/seo';
import CompetencyGroups from '../components/CompetencyGroups';
import ExperienceList from '../components/ExperienceList';
import { allSkills } from '../data/competencies';
import { profile } from '../data/profile';

const EDUCATION = [
	{
		title: 'Bacharelado em Sistemas de Informação',
		place: 'Universidade Ibirapuera',
		period: '2005 - 2009',
	},
	{
		title: 'Pós-graduação em Desenvolvimento de Aplicações Java — SOA',
		place: 'FIAP',
		period: '2012 - 2013',
	},
];

const LANGUAGES = [
	{ language: 'Português', level: 'Nativo' },
	{ language: 'Inglês', level: 'Intermediário avançado (B2)' },
];

const SITE_STACK = [
	'Vite',
	'React',
	'React Router',
	'Ant Design',
	'Tailwind CSS',
	'WebSocket',
	'Kute.js',
	'Potrace',
	'Docker',
	'Nginx',
	'Kubernetes',
];

const About = () => {
	usePageMeta({
		title: 'Sobre | Wallace Martins Vieira — Fullstack Engineer',
		description:
			'Wallace Martins Vieira, Fullstack Engineer com 15+ anos em backend e fullstack: microsserviços, APIs RESTful de alta disponibilidade, mensageria e cloud native em AWS e GCP.',
		path: '/about',
		jsonLd: [{
			'@context': 'https://schema.org',
			'@type': 'AboutPage',
			name: 'Sobre Wallace Martins Vieira',
			url: 'https://codedbywallace.dev/portfolio/about',
			description:
				'Biografia, competências, formação, idiomas e experiência profissional de Wallace Martins Vieira, Fullstack Engineer.',
			mainEntity: { '@id': 'https://codedbywallace.dev/portfolio/#wallace' },
		}, {
			'@context': 'https://schema.org',
			'@type': 'Person',
			'@id': 'https://codedbywallace.dev/portfolio/#wallace',
			name: 'Wallace Martins Vieira',
			jobTitle: 'Fullstack Engineer',
			url: 'https://codedbywallace.dev/portfolio/',
			knowsAbout: allSkills,
			alumniOf: [
				{ '@type': 'CollegeOrUniversity', name: 'Universidade Ibirapuera' },
				{ '@type': 'CollegeOrUniversity', name: 'FIAP' },
			],
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
				<h1 className='text-3xl font-bold mb-4'>Sobre</h1>

				<div
					className='flex flex-col gap-3 p-4 rounded-lg mb-6'
					style={{
						backgroundColor: '#334155',
						border: '1px solid rgba(255,255,255,0.15)',
						borderLeft: '4px solid #3b82f6',
					}}
				>
					{profile.bio.map((paragraph) => (
						<p key={paragraph} className='text-white/90 leading-relaxed'>
							{paragraph}
						</p>
					))}
				</div>

				<h2 className='text-2xl font-bold mb-3'>Principais competências</h2>
				<div className='mb-6'>
					<CompetencyGroups />
				</div>

				<h2 className='text-2xl font-bold mb-3'>Experiências profissionais</h2>
				<div className='mb-6'>
					<ExperienceList />
				</div>

				<h2 className='text-2xl font-bold mb-3'>Formação acadêmica</h2>
				<div className='flex flex-col sm:flex-row gap-4 mb-6'>
					{EDUCATION.map((item) => (
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
					{LANGUAGES.map((item) => (
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

				<h2 className='text-2xl font-bold mb-3'>Stack deste site</h2>
				<div className='flex flex-wrap gap-2'>
					{SITE_STACK.map((tech) => (
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
					))}
				</div>
			</div>
		</div>
	);
};

export default About;
