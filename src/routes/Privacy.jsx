import { usePageMeta } from '../lib/seo';

const sections = [
	{
		title: 'Quem é o responsável',
		body: [
			'Wallace Martins Vieira, dono deste site (codedbywallace.dev). Contato para qualquer assunto de privacidade: wallacemv@gmail.com.',
		],
	},
	{
		title: 'O que é coletado',
		body: [
			'Analytics (somente se você aceitar os cookies): páginas visitadas, abertura do assistente, download do currículo e cliques em links externos, via Google Analytics 4 com anonimização de IP. Nada é enviado ao Google antes da sua escolha, e o script nem é carregado se você recusar.',
			'Assistente de chat: o apelido e as mensagens que você enviar são processados para gerar as respostas. A conversa fica salva apenas no seu navegador (localStorage), sem cadastro e sem conta.',
			'Preferências locais: sua escolha sobre cookies e o apelido do chat ficam no seu navegador.',
		],
	},
	{
		title: 'Com quem os dados são compartilhados',
		body: [
			'Google Analytics (métricas de uso, só com consentimento) e Google Gemini (modelo de IA que responde no chat; recebe as mensagens da conversa). Não vendo nem uso seus dados para outros fins. O servidor do chat não grava as conversas.',
			'Evite enviar dados sensíveis ou pessoais no chat.',
		],
	},
	{
		title: 'Seus direitos (LGPD)',
		body: [
			'Você pode pedir acesso, correção ou exclusão dos seus dados e revogar o consentimento a qualquer momento: use o botão "Cookies" no canto da tela para mudar a escolha, limpe os dados do site no navegador para apagar a conversa e o apelido, ou escreva para wallacemv@gmail.com.',
		],
	},
	{
		title: 'Atualizações',
		body: ['Esta política pode mudar quando o site mudar. Última atualização: 9 de novembro de 2026.'],
	},
];

const Privacy = () => {
	usePageMeta({
		title: 'Política de Privacidade | Wallace Martins Vieira',
		description: 'Como o site de Wallace Martins Vieira trata cookies, analytics e as conversas do assistente.',
		path: '/privacy',
	});

	return (
		<div
			className='h-full overflow-auto'
			style={{
				background:
					'radial-gradient(1100px 700px at 85% -10%, rgba(99,102,241,0.2), transparent 55%)',
			}}
		>
			<div className='p-6 sm:p-8 text-[#fff] max-w-3xl'>
				<h1 className='text-3xl font-bold mb-2'>Política de Privacidade</h1>
				<p className='text-white/80 mb-6'>
					Resumo simples de quais dados este site usa e por quê.
				</p>
				<div className='flex flex-col gap-5'>
					{sections.map((s) => (
						<section key={s.title}>
							<h2 className='text-xl font-bold mb-1'>{s.title}</h2>
							{s.body.map((p) => (
								<p key={p} className='text-white/90 leading-relaxed mb-2'>
									{p}
								</p>
							))}
						</section>
					))}
				</div>
			</div>
		</div>
	);
};

export default Privacy;
