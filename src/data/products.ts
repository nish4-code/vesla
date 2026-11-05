export type SceneName =
	| "background"
	| "expression"
	| "craftsmanship"
	| "refinement"
	| "balance"
	| "origin";

export interface Product {
	slug: string;
	scene: SceneName;
	rail: string;
	headline: [string, string];
	blurb: [string, ...string[]];
	cta: string;
	href: string;
	name: string;
	tagline: string;
	description: string;
	features: string[];
}

export const products: Product[] = [
	{
		slug: "armar-proyecto",
		scene: "background",
		rail: "ARMAR PROYECTO",
		headline: ["Armá tu proyecto ", "sin fricción"],
		blurb: [
			"Definí el alcance, los módulos y el presupuesto de tu proyecto en",
			"minutos. Vesla te guía paso a paso y te entrega una propuesta clara",
			"para empezar a construir, sin reuniones innecesarias ni idas y",
			"vueltas.",
		],
		cta: "VER ARMAR PROYECTO",
		href: "/productos/armar-proyecto",
		name: "Armar proyecto",
		tagline: "De la idea al brief en minutos.",
		description:
			"Definí alcance, módulos y presupuesto con una guía clara. Recibí una propuesta lista para empezar a construir.",
		features: [
			"Brief guiado con preguntas concretas",
			"Estimación de alcance y presupuesto",
			"Propuesta lista para compartir con tu equipo",
			"Seguimiento del proyecto en un solo lugar",
		],
	},
	{
		slug: "empleos",
		scene: "expression",
		rail: "EMPLEOS",
		headline: ["Empleos reales, ", "sin ruido"],
		blurb: [
			"Hacemos scraping de portales de empleo y ordenamos las ofertas",
			"para que encuentres lo que buscás. Filtrá por rol, modalidad y",
			"tecnología, y postulate con información actualizada, sin perder",
			"horas saltando entre sitios.",
		],
		cta: "VER EMPLEOS",
		href: "/productos/empleos",
		name: "Empleos",
		tagline: "Ofertas reales, ordenadas para vos.",
		description:
			"Hacemos scraping de portales de empleo, normalizamos las ofertas y las ordenamos para que encuentres lo que buscás sin perder horas.",
		features: [
			"Scraping de portales de empleo",
			"Filtros por rol, modalidad y tecnología",
			"Datos actualizados y sin duplicados",
			"Alertas para nuevas oportunidades",
		],
	},
	{
		slug: "rutas",
		scene: "craftsmanship",
		rail: "RUTAS TURÍSTICAS",
		headline: ["Rutas que ", "valen el viaje"],
		blurb: [
			"Descubrí recorridos curados por locales, con paradas, tiempos y",
			"mapas claros. Armá tu itinerario según tus intereses y viajá con",
			"una guía que se adapta a tu ritmo, tu presupuesto y las ganas de",
			"explorar.",
		],
		cta: "VER RUTAS",
		href: "/productos/rutas",
		name: "Rutas turísticas",
		tagline: "Recorridos curados por locales.",
		description:
			"Descubrí rutas con paradas, tiempos y mapas claros. Armá un itinerario que se adapte a tu ritmo y presupuesto.",
		features: [
			"Rutas curadas por locales",
			"Mapas y tiempos por parada",
			"Itinerarios según tus intereses",
			"Guía disponible desde el celular",
		],
	},
	{
		slug: "facturacion",
		scene: "refinement",
		rail: "FACTURACIÓN",
		headline: ["Facturación ", "sin errores"],
		blurb: [
			"Emití facturas electrónicas, controlá vencimientos y",
			"conciliá pagos desde un solo lugar. Integramos tu operación con",
			"los organismos fiscales para que cada comprobante salga bien la",
			"primera vez.",
		],
		cta: "VER FACTURACIÓN",
		href: "/productos/facturacion",
		name: "Facturación",
		tagline: "Comprobantes bien la primera vez.",
		description:
			"Emití facturas electrónicas, controlá vencimientos y conciliá pagos desde un solo lugar, integrado con los organismos fiscales.",
		features: [
			"Emisión de facturas electrónicas",
			"Control de vencimientos y pagos",
			"Integración con organismos fiscales",
			"Historial y exportación de comprobantes",
		],
	},
	{
		slug: "automatizacion",
		scene: "balance",
		rail: "AUTOMATIZACIÓN",
		headline: ["Automatizá ", "lo repetitivo"],
		blurb: [
			"Conectamos tus herramientas y automatizamos tareas con bots",
			"y flujos a medida. Menos planillas, menos copiar y pegar, y más",
			"tiempo para lo que realmente mueve tu negocio, todos los días.",
		],
		cta: "VER AUTOMATIZACIÓN",
		href: "/productos/automatizacion",
		name: "Automatización",
		tagline: "Menos tareas, más tiempo.",
		description:
			"Conectamos tus herramientas y automatizamos tareas con bots y flujos a medida para liberar tiempo operativo.",
		features: [
			"Bots para tareas repetitivas",
			"Integraciones entre tus herramientas",
			"Flujos de trabajo a medida",
			"Monitoreo y registro de ejecuciones",
		],
	},
	{
		slug: "software",
		scene: "origin",
		rail: "SOFTWARE A MEDIDA",
		headline: ["Software a medida ", "para tu negocio"],
		blurb: [
			"Diseñamos y construimos la plataforma que tu operación",
			"necesita: web, mobile, APIs e integraciones. Trabajamos por",
			"etapas, con entregas visibles y un equipo que sigue el proyecto",
			"de punta a punta.",
		],
		cta: "VER SOFTWARE",
		href: "/productos/software",
		name: "Software a medida",
		tagline: "La plataforma que tu operación necesita.",
		description:
			"Diseñamos y construimos web, mobile, APIs e integraciones por etapas, con entregas visibles y acompañamiento de punta a punta.",
		features: [
			"Descubrimiento y definición de producto",
			"Diseño de experiencia e interfaz",
			"Desarrollo web, mobile y APIs",
			"Entregas por etapas y soporte",
		],
	},
];
