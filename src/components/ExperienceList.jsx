import { experience } from '../data/experience';

/**
 * Experiências profissionais em cards completos (cargo, empresa, período,
 * resumo e destaques). Usada no Sobre, que lista o histórico inteiro.
 */
const ExperienceList = () => (
	<div className='flex flex-col gap-4'>
		{experience.map((exp) => (
			<div
				key={`${exp.company}-${exp.period}`}
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
							<li key={h} className='text-sm text-white/85 flex gap-2'>
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
);

export default ExperienceList;
