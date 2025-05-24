import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateScript(prompt: string, tone: string, duration: number, industry?: string): Promise<string> {
  try {
    const systemPrompt = `You are a professional video script writer. Create engaging, compelling video scripts that are perfect for AI avatar videos. The script should be natural, conversational, and designed to be spoken aloud.

Guidelines:
- Write in a ${tone.toLowerCase()} tone
- Target duration: approximately ${duration} seconds (about ${Math.round(duration / 2)} words per second)
- Make it engaging and audience-focused
- Include natural pauses and transitions
- Avoid overly complex sentences
- Make it suitable for video narration
${industry ? `- Focus on the ${industry} industry` : ''}

Return only the script text, no additional formatting or explanations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: Math.min(4000, Math.round(duration * 3)), // Rough estimate for token count
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Unable to generate script. Please try again.";
  } catch (error) {
    console.error("Error generating script:", error);
    throw new Error("Failed to generate script with AI");
  }
}

export async function enhanceScript(script: string, enhancementType: string): Promise<string> {
  try {
    const enhancementPrompts = {
      engagement: "Rewrite this script to be more engaging by adding hooks, questions, and call-to-actions. Make it captivating and interactive.",
      clarity: "Rewrite this script to be clearer and more concise. Simplify complex language and improve the structure for better understanding.",
      emotional: "Rewrite this script to be more emotionally compelling. Add storytelling elements and emotional triggers that connect with the audience.",
      conversion: "Rewrite this script to be more persuasive and conversion-focused. Add compelling reasons to take action and stronger calls-to-action."
    };

    const systemPrompt = `You are a professional script editor. ${enhancementPrompts[enhancementType as keyof typeof enhancementPrompts]} Keep the core message but improve the delivery. Return only the enhanced script text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: script }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || script;
  } catch (error) {
    console.error("Error enhancing script:", error);
    throw new Error("Failed to enhance script with AI");
  }
}

export async function analyzeScriptForTemplate(script: string, templates: any[]): Promise<{ templateId: number; confidence: number }> {
  try {
    const templateCategories = templates.map(t => `${t.id}: ${t.name} (${t.category}) - ${t.description}`).join('\n');
    
    const systemPrompt = `You are an AI that analyzes video scripts and recommends the best template. Based on the script content, tone, and purpose, recommend the most suitable template from the list.

Available templates:
${templateCategories}

Analyze the script and return a JSON object with:
- templateId: the ID number of the best matching template
- confidence: a number between 0-100 representing how confident you are in this match

Consider factors like:
- Industry/topic relevance
- Tone and style
- Content purpose (marketing, education, corporate, etc.)
- Target audience`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this script: "${script}"` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"templateId": 1, "confidence": 50}');
    return {
      templateId: parseInt(result.templateId) || 1,
      confidence: Math.max(0, Math.min(100, parseInt(result.confidence) || 50))
    };
  } catch (error) {
    console.error("Error analyzing script for template:", error);
    // Return a fallback
    return { templateId: 1, confidence: 30 };
  }
}