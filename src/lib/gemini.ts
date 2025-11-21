import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async generateCode(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
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
