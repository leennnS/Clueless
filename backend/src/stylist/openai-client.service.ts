import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OpenAiClientService {
  private readonly logger = new Logger(OpenAiClientService.name);
  private readonly baseUrl =
    process.env.GROQ_API_BASE_URL ??
    'https://api.groq.com/openai/v1/chat/completions';
  private readonly model =
    process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';
  private readonly temperature = Number(process.env.GROQ_TEMPERATURE ?? 0.7);

  async generateStylistResponse(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured.');
    }

    const body = {
      model: this.model,
      temperature: this.temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(
        `Groq request failed with status ${response.status}: ${errorText}`,
      );
      throw new Error('Groq request failed.');
    }

    const payload = (await response.json()) as Record<string, any>;
    this.logUsage(payload);

    const text: string | undefined =
      payload?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('Groq response did not include assistant content.');
    }

    return text;
  }

  private logUsage(payload: Record<string, any>) {
    const usage = payload?.usage;
    if (!usage) {
      return;
    }
    this.logger.debug(
      `Groq usage prompt=${usage.prompt_tokens ?? 0} completion=${usage.completion_tokens ?? 0} total=${usage.total_tokens ?? 0}`,
    );
  }
}
