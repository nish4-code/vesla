export interface ProcessStep {
	title: string;
	body: string;
	output: string;
}

export const processSteps: readonly ProcessStep[] = [
	{
		title: "Escuchamos",
		body: "Mapeamos cómo funciona hoy el proceso, qué datos lo sostienen y quiénes lo usan todos los días.",
		output: "Mapa de fricción",
	},
	{
		title: "Definimos",
		body: "Acordamos alcance, prioridades y la primera entrega visible. Lo que no entra ahora queda escrito.",
		output: "Alcance y estimación",
	},
	{
		title: "Construimos",
		body: "Avanzamos por etapas con demos, decisiones abiertas y entregas que se pueden probar.",
		output: "Entregas por etapa",
	},
	{
		title: "Operamos",
		body: "Medimos cómo se usa, ajustamos lo que haga falta y acompañamos la puesta en marcha.",
		output: "Soporte y evolución",
	},
];
