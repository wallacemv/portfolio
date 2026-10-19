import { useEffect, useRef, useState } from 'react';
import { competencies } from '../data/competencies';

/**
 * Competências em grupos, num grid responsivo (1 coluna no mobile, 2 no
 * tablet, 3 no desktop) com os pills animados.
 *
 * A animação roda pausada quando o bloco está fora da tela, quando a aba está
 * oculta e quando o usuário pede menos movimento — nesses casos o conteúdo é
 * renderizado normalmente, apenas estático.
 */
const CompetencyGroups = () => {
	const wrapRef = useRef(null);
	const [playing, setPlaying] = useState(false);
	let pillIndex = -1;

	useEffect(() => {
		const el = wrapRef.current;
		if (!el) return undefined;

		const motionOk = window.matchMedia('(prefers-reduced-motion: reduce)');
		let visible = false;

		const sync = () => {
			setPlaying(visible && !document.hidden && !motionOk.matches);
		};

		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				sync();
			},
			{ threshold: 0.05 },
		);
		io.observe(el);

		document.addEventListener('visibilitychange', sync);
		motionOk.addEventListener('change', sync);
		sync();

		return () => {
			io.disconnect();
			document.removeEventListener('visibilitychange', sync);
			motionOk.removeEventListener('change', sync);
		};
	}, []);

	return (
		<div
			ref={wrapRef}
			className={`competencies grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3${playing ? '' : ' is-paused'}`}
		>
			{competencies.map((group) => (
				<div key={group.label} className='flex flex-col gap-2'>
					<h3 className='text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/70'>
						{group.label}
					</h3>
					<div className='flex flex-wrap gap-2'>
						{group.items.map((item) => {
							// índice global: a cascata atravessa os grupos em vez de
							// reiniciar em cada um
							pillIndex += 1;
							return (
								<span
									key={item}
									className='skill-pill'
									style={{
										// entrada em cascata, teto de 700ms para não atrasar o fim da lista
										'--skill-delay': `${Math.min(pillIndex * 22, 700)}ms`,
										// fase própria do brilho: vizinhos não brilham juntos
										'--skill-sheen': `${(pillIndex * 179) % 6800}ms`,
									}}
								>
									{item}
								</span>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
};

export default CompetencyGroups;
