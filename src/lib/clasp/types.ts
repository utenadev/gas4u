export interface GASFile {
	name: string;
	type: "SERVER_JS" | "HTML" | "JSON";
	source: string;
}

export interface GASProject {
	scriptId: string;
	title: string;
	files: GASFile[];
}
