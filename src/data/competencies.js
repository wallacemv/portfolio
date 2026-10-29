// Principais competências — fonte única, usada na Home e no Sobre (pills
// agrupadas). Os grupos e itens vêm do currículo do autor; itens que já
// estavam no site e não aparecem no resumo do currículo foram mantidos no
// grupo correspondente, para nada real sair da página.
export const competencies = [
	{
		label: 'Backend & Arquitetura',
		items: [
			'Node.js',
			'TypeScript',
			'NestJS',
			'Express',
			'TypeORM',
			'Java 8–21',
			'Spring Boot',
			'Spring Data',
			'Spring Security',
			'Hibernate',
			'Spring Batch',
			'PHP',
			'Python',
			'FastAPI',
			'Microsserviços',
			'APIs RESTful',
			'GraphQL',
			'Event-Driven',
			'APIs bancárias',
			'WhatsApp API',
			'Keycloak',
			'OAuth2/OIDC/JWT',
		],
	},
	{
		label: 'AI & Developer Productivity',
		items: [
			'AI-Assisted Development',
			'Claude Code',
			'OpenCode',
			'LLM Integration',
			'Agentic Workflows',
			'AI Pair-Programming',
			'Cursor',
			'GitHub Copilot',
			'MCP',
		],
	},
	{
		label: 'Cloud, Serverless & DevOps',
		items: [
			'AWS',
			'Lambda',
			'DynamoDB',
			'SQS/SNS',
			'EC2',
			'S3',
			'RDS',
			'Azure',
			'Linux',
			'Docker',
			'Kubernetes',
			'OpenShift',
			'GitHub Actions',
			'GitLab CI',
			'Azure DevOps',
			'CI/CD',
		],
	},
	{
		label: 'Bancos de Dados & Mensageria',
		items: [
			'PostgreSQL',
			'MySQL',
			'Oracle',
			'SQL Server',
			'SQL',
			'DynamoDB',
			'MongoDB',
			'Redis',
			'Elasticsearch',
			'RabbitMQ',
			'Kafka',
			'JMS',
		],
	},
	{
		label: 'Frontend',
		items: [
			'React.js',
			'Next.js',
			'Vue.js',
			'Angular',
			'AngularJS',
			'Angular Material',
			'Material UI',
			'Bootstrap',
			'HTML5',
			'CSS3',
			'ES6+',
			'Sass',
			'jQuery',
		],
	},
	{
		label: 'Mobile',
		items: ['React Native', 'Ionic', 'Apache Cordova'],
	},
	{
		label: 'Sustentação, Observabilidade & Confiabilidade',
		items: [
			'Sistemas críticos',
			'Troubleshooting',
			'Rastreio distribuído',
			'Filas e tópicos',
			'Reprocessamento de mensagens',
			'Monitoramento e alertas',
			'Análise de causa raiz',
			'Incidentes de alta severidade',
			'OpenTelemetry',
			'Prometheus',
			'Grafana',
		],
	},
	{
		label: 'Qualidade & Práticas',
		items: [
			'SOLID',
			'Clean Code',
			'Design Patterns',
			'TDD',
			'Testes de integração',
			'Testes E2E',
			'Git',
		],
	},
];

/**
 * Stack antiga que aparece nas experiências mais distantes do currículo
 * (Java EE e ecossistema). Não entra nas pills — a página mostra as
 * competências principais — mas é publicada no dados estruturados
 * (`knowsAbout`) para crawlers e LLMs lerem o histórico completo.
 */
export const legacySkills = [
	'JavaEE',
	'EJB',
	'J2EE',
	'Struts',
	'JSF',
	'Primefaces',
	'MyBatis',
	'JMS',
	'Jersey',
	'Tomcat',
	'JBoss',
	'Glassfish',
	'WebSphere',
	'Maven',
	'Ant',
	'Sybase',
	'ExtJS',
	'Smarty',
	'Memcache',
	'JMeter',
];

/** Todas as competências em uma lista plana (pills + legado). */
export const allSkills = [
	...competencies.flatMap((group) => group.items),
	...legacySkills,
];
