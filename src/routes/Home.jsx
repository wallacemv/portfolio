import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRightOutlined } from '@ant-design/icons';
import { usePageMeta } from '../lib/seo';
import CompetencyGroups from '../components/CompetencyGroups';
import { profile } from '../data/profile';
import { experience } from '../data/experience';

const ASCII_COLS = 120;
// Largura do rosto: ancorado no topo da coluna esquerda (o herói). Antes ele
// era centralizado na coluna inteira, mas os grupos de competências a
// esticaram e o rosto caía atrás dos pills.
const ASCII_WIDTH = 'min(380px, 30vw)';
const ASCII_RAMP = ' .:-=+*#%@';
// Fonte do retrato em ASCII (quadrada, recortada centralizada).
const ASCII_SRC = 'ascii-portrait.webp';
// Largura/altura de um glifo monoespaçado. Com 0.6 e line-height 1.2 o bloco
// de caracteres fica exatamente quadrado e preenche a máscara redonda.
const GLYPH_RATIO = 0.6;
const LINE_HEIGHT = 1.2;

const Home = () => {
	usePageMeta({
		title:
			'Wallace Martins Vieira — Fullstack Engineer | Node.js, TypeScript, Angular, Java',
		description:
			'Wallace Martins Vieira, Fullstack Engineer com mais de 15 anos no desenvolvimento de softwares escaláveis. Node.js, TypeScript, Angular, Java, Python e Kubernetes.',
		path: '/',
		jsonLd: {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: 'Wallace Martins Vieira — Fullstack Engineer',
			url: 'https://codedbywallace.dev/portfolio/',
			description:
				'Portfolio de Wallace Martins Vieira, Fullstack Engineer com 15+ anos de experiência.',
			isPartOf: {
				'@type': 'WebSite',
				name: 'Wallace Martins Vieira — Portfolio',
				url: 'https://codedbywallace.dev/portfolio/',
			},
		},
	});

	const [ascii, setAscii] = useState('');
	const [typed, setTyped] = useState(0);

	// Foto em ASCII: amostra ascii-portrait.webp num canvas ASCII_COLS x N
	// (recorte quadrado centralizado) e mapeia a luminância pro ramp
	useEffect(() => {
		const img = new Image();
		img.src = `${import.meta.env.BASE_URL}images/${ASCII_SRC}`;
		img.onload = () => {
			const size = Math.min(img.width, img.height);
			const sx = (img.width - size) / 2;
			const sy = (img.height - size) / 2;
			const rows = Math.max(1, Math.round(ASCII_COLS / 2));
			const canvas = document.createElement('canvas');
			canvas.width = ASCII_COLS;
			canvas.height = rows;
			const ctx = canvas.getContext('2d');
			ctx.filter = 'grayscale(1) contrast(1.35) brightness(1.08)';
			ctx.drawImage(img, sx, sy, size, size, 0, 0, ASCII_COLS, rows);
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
				background: [
					// névoa original do hero — mantida intacta
					'radial-gradient(1100px 700px at 85% -10%, rgba(99,102,241,0.22), transparent 55%)',
					// névoas extras, todas no mesmo indigo da original (só muda
					// posição/intensidade), para não pintar o fundo de arco-íris
					'radial-gradient(760px 520px at 12% 2%, rgba(99,102,241,0.14), transparent 62%)',
					'radial-gradient(900px 460px at 58% 34%, rgba(99,102,241,0.10), transparent 60%)',
					'radial-gradient(680px 520px at 4% 88%, rgba(99,102,241,0.07), transparent 65%)',
				].join(', '),
				backgroundRepeat: 'no-repeat',
			}}
		>
			<div className='flex flex-col'>
				{/**left */}
				<div className='flex flex-col p-4 sm:p-6 relative overflow-hidden pic'>
					<div
						className='hidden sm:block absolute pointer-events-none'
						style={{
							width: ASCII_WIDTH,
							aspectRatio: '1',
							// absolute se posiciona pela padding box: sem esse offset o
							// retrato come os 24px do sm:p-6 e encosta na borda da seção
							right: '1.5rem',
							top: '1.5rem',
							borderRadius: '50%',
							overflow: 'hidden',
							opacity: 0.95,
							// borda suave: o ASCII redondo derrete no fundo em vez de
							// terminar num corte seco (o quadrado antigo)
							WebkitMaskImage:
								'radial-gradient(circle at 50% 50%, #000 68%, transparent 100%)',
							maskImage:
								'radial-gradient(circle at 50% 50%, #000 68%, transparent 100%)',
						}}
					>
						<pre
							aria-hidden='true'
							style={{
								position: 'absolute',
								inset: 0,
								margin: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: 'monospace',
								fontSize: `calc(${ASCII_WIDTH} / ${ASCII_COLS * GLYPH_RATIO})`,
								lineHeight: LINE_HEIGHT,
								color: '#ffffff',
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
									sequence={[profile.name]}
									speed={30}
									repeat={1}
								/>
							</div>
							<div className='text-sm text-white'>
								<TypeAnimation
									sequence={[profile.role]}
									speed={60}
									repeat={1}
								/>
							</div>
						</div>
						<div className='flex flex-col'>
							<div
								className='w-full sm:w-2/3 p-6 my-6 sm:my-12 rounded-lg font-semibold text-[#ffffff] border border-white/15'
								style={{ backgroundColor: '#334155' }}
							>
								<p className='text-base leading-relaxed'>{profile.pitch}</p>
								<Link
									to='/about'
									className='group inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-white/80 hover:text-white underline underline-offset-4'
								>
									Ver trajetória completa
									<ArrowRightOutlined className='text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none' />
								</Link>
							</div>
						</div>
						<div className='mt-6 sm:mt-8'>
							<h2 className='text-xl sm:text-2xl text-white font-bold mb-3'>
								Principais competências
							</h2>
							<CompetencyGroups />
						</div>
					</div>
				</div>

				{/**right */}
				<div className='flex flex-auto p-6 relative overflow-hidden'>
					<div className='flex flex-col gap-6 w-full'>
						<div className='relative z-50'>
							<h2 className='text-2xl text-white font-bold mb-4'>
								Experiências profissionais recentes
							</h2>
							<div className='gap-4 flex flex-col sm:flex-row flex-wrap'>
								{experience.slice(0, 4).map((exp) => (
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
									</div>
								))}
								<div className='flex flex-1 min-w-[200px] items-center'>
									<Link
										to='/about'
										className='group inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white underline underline-offset-4'
									>
										Saiba mais
										<ArrowRightOutlined className='text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none' />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
