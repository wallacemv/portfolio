import React from 'react';

const About = () => {
	return (
		<div
			className='about-wrapper h-full overflow-auto'
			style={{
				background:
					'radial-gradient(1100px 700px at 85% -10%, rgba(59,130,246,0.22), transparent 55%), #0f172a',
			}}
		>
			<div className='p-8 text-[#fff]'>
				<h1>O que eu usei aqui</h1>

				<h2>1. Vite</h2>
				<ul>
					<li>Bundler e dev server ultrarrápido</li>
					<li>Hot Module Replacement durante desenvolvimento</li>
					<li>Build otimizado com code splitting e hash nos assets</li>
				</ul>

				<h2>2. React</h2>
				<ul>
					<li>Hooks para gerenciamento de estado e efeitos colaterais</li>
					<li>Referências (refs) para manipulação direta do DOM</li>
					<li>Componentização e composição de UI</li>
				</ul>

				<h2>3. React Router</h2>
				<ul>
					<li>Roteamento client-side com basename /portfolio</li>
					<li>Navegação entre páginas sem recarregar</li>
					<li>Aninhamento de rotas com layout compartilhado</li>
				</ul>

				<h2>4. Ant Design (antd)</h2>
				<ul>
					<li>Componentes de UI prontos (Layout, Card, Input, Button)</li>
					<li>Notificações e mensagens de feedback</li>
					<li>Tipografia e gerenciamento de espaçamento</li>
					<li>Badges para indicadores de status</li>
					<li>Tema customizado com cores e fontes</li>
				</ul>

				<h2>5. Tailwind CSS</h2>
				<ul>
					<li>Utilitários CSS para estilização direta nos componentes</li>
					<li>Design responsivo sem sair do HTML/JSX</li>
					<li>Purge CSS para remover estilos não utilizados em produção</li>
				</ul>

				<h2>6. WebSocket</h2>
				<ul>
					<li>Comunicação bidirecional em tempo real com o servidor</li>
					<li>API nativa do navegador, sem dependências extras</li>
					<li>Conexão segura via WSS com proxy reverso Nginx</li>
				</ul>

				<h2>7. Kute.js</h2>
				<ul>
					<li>Animações SVG interpoladas de alto desempenho</li>
					<li>Morphing e transições suaves entre formas</li>
				</ul>

				<h2>8. Potrace</h2>
				<ul>
					<li>Conversão de imagens bitmap em gráficos vetoriais SVG</li>
					<li>Otimização de traços e curvas</li>
					<li>Integração com o sistema de desenho para vetorização em tempo real</li>
				</ul>

				<h2>10. Deploy</h2>
				<ul>
					<li>Docker com Nginx Alpine servindo os arquivos estáticos</li>
					<li>VPS com Nginx, SSL via Certbot e proxy reverso</li>
					<li>Servidor WebSocket Node.js em container separado</li>
				</ul>
			</div>
		</div>
	);
};

export default About;
