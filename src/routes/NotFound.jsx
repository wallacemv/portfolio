import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/seo';

const NotFound = () => {
	usePageMeta({
		title: 'Página não encontrada (404) — Wallace Martins Vieira',
		description:
			'A página que você procura não existe ou foi movida. Volte para a home do portfolio de Wallace Martins Vieira.',
		noIndex: true,
	});

	return (
		<div
			className='notfound-wrapper h-full overflow-auto flex items-center justify-center'
			style={{
				background:
					'radial-gradient(1100px 700px at 50% -10%, rgba(99,102,241,0.22), transparent 55%), #0f172a',
			}}
		>
			<div className='flex flex-col items-center gap-4 text-[#fff] p-8 text-center'>
				<div className='text-8xl font-bold leading-none'>404</div>
				<h1 className='text-2xl font-bold'>Página não encontrada</h1>
				<p className='text-white/80'>
					A página que você procura não existe ou foi movida.
				</p>
				<Link to='/'>
					<Button type='primary' size='large'>
						Voltar para a Home
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
