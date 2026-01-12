import { useState } from "react";
import { GeminiClient } from "../lib/gemini/client";
import { StorageManager } from "../lib/storage/manager";

type GeminiIntegration = {
	client: GeminiClient | null;
	isGenerating: boolean;
	error: string | null;
};

type GeminiIntegrationActions = {
	initializeClient: () => Promise<void>;
	generateCode: (
		prompt: string,
		originalCode: string,
	) => Promise<{ code?: string; error?: string }>;
	setError: (error: string | null) => void;
};

export const useGeminiIntegration = (): [
	GeminiIntegration,
	GeminiIntegrationActions,
] => {
	const [state, setState] = useState<GeminiIntegration>({
		client: null,
		isGenerating: false,
		error: null,
	});

	const actions: GeminiIntegrationActions = {
		initializeClient: async () => {
			const apiKey = await StorageManager.getApiKey();
			if (apiKey) {
				setState((prev) => ({ ...prev, client: new GeminiClient({ apiKey }) }));
			}
		},
		generateCode: async (prompt: string, originalCode: string) => {
			if (!state.client) {
				return {
					error: "API Key not found. Please set it in the extension popup.",
				};
			}

			setState((prev) => ({ ...prev, isGenerating: true, error: null }));

			const result = await state.client.generateCode(prompt, originalCode);

			setState((prev) => ({ ...prev, isGenerating: false }));

			return result;
		},
		setError: (error: string | null) =>
			setState((prev) => ({ ...prev, error })),
	};

	return [state, actions];
};
