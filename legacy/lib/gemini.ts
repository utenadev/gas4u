import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async generateCode(prompt: string, currentCode?: string): Promise<string> {
        let systemPrompt = `You are a Google Apps Script code generator.
Generate ONLY the requested Google Apps Script code without any explanations, comments, or markdown formatting.
Do not include \`\`\`javascript or any other markdown code blocks.
Return only the pure JavaScript/Google Apps Script code.`;

        if (currentCode) {
            systemPrompt += `\n\nThe following is the current code in the editor:
\`\`\`javascript
${currentCode}
\`\`\`

Please modify this code according to the user's request. Return the COMPLETE updated code, not just the changes.`;
        }

        systemPrompt += `\n\nUser request: ${prompt}`;

        try {
            const result = await this.model.generateContent(systemPrompt);
            const response = await result.response;
            let code = response.text();

            // Remove markdown code blocks if present
            code = code.replace(/```(?:javascript|js|typescript|ts)?\n?/g, '');
            code = code.replace(/```\n?$/g, '');

            return code.trim();
        } catch (error) {
            console.error('Error generating code:', error);
            throw error;
        }
    }

    async explainCode(code: string): Promise<string> {
        const prompt = `Please explain the following Google Apps Script code:\n\n\`\`\`javascript\n${code}\n\`\`\``;
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error explaining code:', error);
            throw error;
        }
    }
}
