export interface FaqItem {
	question: string;
	answer: string;
}

export const faqItems: readonly FaqItem[] = [
	{
		question: "¿Puedo empezar por un solo producto?",
		answer:
			"Sí. Cada producto funciona por separado y se puede integrar con el resto cuando la operación lo necesite.",
	},
	{
		question: "¿Trabajan con sistemas que ya están en uso?",
		answer:
			"Sí. Partimos de lo que ya existe: integramos datos, reemplazamos partes sin frenar la operación o construimos una capa nueva sobre el sistema actual.",
	},
	{
		question: "¿Cómo definen el alcance y el presupuesto?",
		answer:
			"Primero entendemos el proceso y las restricciones. Después proponemos etapas con entregables concretos, para que sepas qué se construye, cuándo se prueba y cuánto cuesta.",
	},
	{
		question: "¿Qué pasa después de la entrega?",
		answer:
			"Medimos el uso real, corregimos lo que aparece en producción y acompañamos la evolución del producto con el equipo que lo opera.",
	},
	{
		question: "¿Trabajan con equipos fuera de Argentina?",
		answer:
			"Sí. Trabajamos de forma remota con equipos de distintas ciudades y zonas horarias, con reuniones cortas y decisiones documentadas.",
	},
];
