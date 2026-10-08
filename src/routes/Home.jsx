import { React, useEffect, useMemo, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { usePageMeta } from '../lib/seo';

const ASCII_COLS = 72;
const ASCII_RAMP = ' .:-=+*#%@';

const Home = () => {
	usePageMeta({
		title:
			'Wallace Martins Vieira — Desenvolvedor Full Stack | Node.js, TypeScript, Angular, Java',
		description:
			'Wallace Martins Vieira, Specialist Full Stack Developer com mais de 15 anos no desenvolvimento de softwares escaláveis. Node.js, TypeScript, Angular, Java, Python e Kubernetes.',
		path: '/',
		jsonLd: {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: 'Wallace Martins Vieira — Desenvolvedor Full Stack',
			url: 'https://codedbywallace.dev/portfolio/',
			description:
				'Portfolio de Wallace Martins Vieira, desenvolvedor full stack com 15+ anos de experiência.',
			isPartOf: {
				'@type': 'WebSite',
				name: 'Wallace Martins Vieira — Portfolio',
				url: 'https://codedbywallace.dev/portfolio/',
			},
		},
	});

	const [ascii, setAscii] = useState('');
	const [typed, setTyped] = useState(0);

	// Foto em ASCII: amostra paint.webp num canvas 72xN e mapeia luminância pro ramp
	useEffect(() => {
		const img = new Image();
		img.src = `${import.meta.env.BASE_URL}images/paint.webp`;
		img.onload = () => {
			const rows = Math.max(
				1,
				Math.round(ASCII_COLS * (img.height / img.width) * 0.55),
			);
			const canvas = document.createElement('canvas');
			canvas.width = ASCII_COLS;
			canvas.height = rows;
			const ctx = canvas.getContext('2d');
			ctx.filter = 'grayscale(1) brightness(1.15) contrast(1.15)';
			ctx.drawImage(img, 0, 0, ASCII_COLS, rows);
			const { data } = ctx.getImageData(0, 0, ASCII_COLS, rows);
			let out = '';
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < ASCII_COLS; x++) {
					const i = (y * ASCII_COLS + x) * 4;
					const lum =
						(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
					out +=
						ASCII_RAMP[
							Math.min(
								ASCII_RAMP.length - 1,
								Math.floor(lum * ASCII_RAMP.length),
							)
						];
				}
				out += '\n';
			}
			setAscii(out);
		};
	}, []);

	// Efeito de digitacao: revela os caracteres como se uma máquina estivesse
	// datilografando (respeta prefers-reduced-motion)
	useEffect(() => {
		if (!ascii) return;
		const total = ascii.length;
		const reduce =
			typeof matchMedia === 'function' &&
			matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) {
			setTyped(total);
			return;
		}
		setTyped(0);
		const step = Math.max(1, Math.ceil(total / 120));
		const id = setInterval(() => {
			setTyped((t) => {
				const n = t + step;
				if (n >= total) {
					clearInterval(id);
					return total;
				}
				return n;
			});
		}, 25);
		return () => clearInterval(id);
	}, [ascii]);

	// Prefixo digitado + espaços até o fim de cada linha → bloco com tamanho
	// fixo, nada pula enquanto digita
	const displayAscii = useMemo(() => {
		if (!ascii) return '';
		const origLines = ascii.split('\n');
		const typedLines = ascii.slice(0, typed).split('\n');
		return origLines
			.map((line, i) => {
				const t = typedLines[i] || '';
				return t + ' '.repeat(Math.max(0, line.length - t.length));
			})
			.join('\n');
	}, [ascii, typed]);

	return (
		<div
			className='home-wrapper relative h-full overflow-auto'
			style={{
				background:
					'radial-gradient(1100px 700px at 85% -10%, rgba(99,102,241,0.22), transparent 55%)',
			}}
		>
			<div className='flex flex-col'>
				{/**left */}
				<div className='flex flex-col p-4 sm:p-6 relative overflow-hidden pic'>
					<div
						className='absolute overflow-hidden pointer-events-none'
						style={{
							width: 'min(400px, 60vw)',
							aspectRatio: '1',
							right: '0',
							top: '50%',
							transform: 'translateY(-50%)',
							opacity: 0.5,
						}}
					>
						<pre
							aria-hidden='true'
							style={{
								position: 'absolute',
								inset: 0,
								paddingRight: '1.5rem',
								margin: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: 'monospace',
								fontSize: `calc(min(400px, 60vw) / ${ASCII_COLS * 0.6})`,
								lineHeight: 1,
								color: '#e2e8f0',
								whiteSpace: 'pre',
								overflow: 'hidden',
								pointerEvents: 'none',
							}}
						>
							{displayAscii}
						</pre>
					</div>
					<div className='flex flex-col flex-nowrap relative z-10'>
						<div className='flex flex-col'>
							<div className='text-2xl sm:text-4xl text-white font-bold'>
								<TypeAnimation
									sequence={['Wallace Martins Vieira']}
									speed={30}
									repeat={1}
								/>
							</div>
							<div className='text-sm text-white'>
								<TypeAnimation
									sequence={[
										'Specialist Full Stack Developer | Node.js • TypeScript • Angular • Java • Python • AI',
									]}
									speed={60}
									repeat={1}
								/>
							</div>
						</div>
						<div className='flex flex-col'>
							<div
								className='w-full sm:w-1/2 p-6 my-6 sm:my-12 rounded-lg font-semibold text-[#ffffff] border border-white/15'
								style={{ backgroundColor: '#334155' }}
							>
								<TypeAnimation
									sequence={[
										'Mais de 15 anos no desenvolvimento de softwares escaláveis. Bacharel em Sistemas de Informação e Pós Graduado em Desenvolvimento de aplicações Java - SOA.',
									]}
									speed={50}
									repeat={1}
								/>
							</div>
						</div>
						<div className='flex flex-row flex-1'>
							<div className='grid grid-cols-2 gap-2 text-white'>
								{[
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
								].map((skill) => (
									<div key={skill} className='text-lg font-medium'>
										{skill}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/**right */}
				<div className='flex flex-auto p-6 relative overflow-hidden'>
					<div className='flex flex-col gap-6 w-full'>
						<div className='relative z-50'>
							<h2 className='text-2xl text-white font-bold mb-4'>
								Experiências profissionais
							</h2>
							<div className='gap-4 flex flex-col sm:flex-row flex-wrap'>
								{[
									{
										role: 'Desenvolvedor Fullstack - Nest.js, Angular',
										company: 'Sem Parar',
										period: 'Jan 2019 - Jul 2026',
										desc: 'APIs com Node.js/NestJS e Java, front-end Angular, apps híbridos Ionic em produto de mobilidade de grande porte.',
										highlights: [
											'Fullstack em produto de mobilidade (telemetria, tag e apps) que atende milhares de usuários',
											'APIs e integrações em Node.js/NestJS e Java com sistemas legados e serviços externos',
											'Angular e apps híbridos Ionic com entregas frequentes em ambiente de alta criticidade',
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
											'APIs e sistemas que sustentam produtos de telefonia empresarial',
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
											'Telas e componentes consumindo APIs do segurador',
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
								].map((exp) => (
									<div
										key={exp.company}
										style={{
											backgroundColor: '#334155',
											border: '1px solid rgba(255,255,255,0.15)',
											borderLeft: `4px solid ${exp.color}`,
										}}
										className='flex flex-1 min-w-[200px] flex-col p-4 rounded-lg'
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
