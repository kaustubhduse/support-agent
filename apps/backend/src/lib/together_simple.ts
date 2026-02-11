import fetch from "node-fetch";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
const MODEL_ID = "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"; // Or 8B if needed

interface AgentOptions {
  model?: string;
  system: string;
  messages?: Array<{ role: string; content: string }>;
  prompt?: string;
  tools?: Record<string, any>;
}

export const runTogetherAgent = async (options: AgentOptions) => {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) throw new Error("TOGETHER_API_KEY is missing");

  let messages: any[] = [
    { role: "system", content: options.system },
  ];

  if (options.messages) {
    // Map tool calls if they exist in history? 
    // For now assuming history is clean or standard OA format.
    messages = [...messages, ...options.messages];
  } else if (options.prompt) {
    messages.push({ role: "user", content: options.prompt });
  }

  let toolsBody: any[] | undefined = undefined;
  let toolMap: Record<string, any> = {};

  if (options.tools) {
    toolsBody = [];
    toolMap = options.tools;
    for (const [name, tool] of Object.entries(options.tools)) {
      toolsBody.push({
        type: "function",
        function: {
          name,
          description: tool.description,
          parameters: zodToJsonSchema(tool.parameters)
        }
      });
    }
  }

  let turnCount = 0;
  const maxTurns = 5; // Safety

  while (turnCount < maxTurns) {
    turnCount++;
    console.log(`[Together] Turn ${turnCount} sending request...`);
    
    const body: any = {
      model: options.model || MODEL_ID,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    };

    if (toolsBody && toolsBody.length > 0) {
        body.tools = toolsBody;
        body.tool_choice = "auto";
    }

    let response;
    let attempts = 0;
    while (attempts < 3) {
        try {
            response = await fetch(TOGETHER_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.status === 429) {
                console.warn(`[Together] Rate limit hit. Retrying in ${(attempts + 1) * 1000}ms...`);
                await new Promise(r => setTimeout(r, (attempts + 1) * 1000));
                attempts++;
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Together API Error: ${response.status} ${errorText}`);
            }
            break; // Success
        } catch (e: any) {
            if (attempts === 2 || !e.message.includes("429")) throw e;
            attempts++;
        }
    }

    if (!response) throw new Error("Failed to get response after retries");

    const data: any = await response.json();
    const choice = data.choices[0];
    const message = choice.message;

    // Add assistant message to history
    messages.push(message);

    if (message.tool_calls && message.tool_calls.length > 0) {
        console.log(`[Together] Tool Calls: ${message.tool_calls.length}`);
        
        for (const toolCall of message.tool_calls) {
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments);
            const toolId = toolCall.id;

            console.log(`[Together] Executing ${toolName} with`, toolArgs);
            
            const tool = toolMap[toolName];
            if (tool) {
                let result;
                try {
                   result = await tool.execute(toolArgs);
                } catch (err: any) {
                   result = { error: err.message };
                }
                
                messages.push({
                    role: "tool",
                    tool_call_id: toolId, 
                    content: JSON.stringify(result),
                    name: toolName 
                } as any);
            } else {
                 messages.push({
                    role: "tool",
                    tool_call_id: toolId,
                    content: JSON.stringify({ error: "Tool not found" }),
                    name: toolName
                } as any);
            }
        }
        // Loop keeps running to let model process tool results
    } else {
        // No tool calls, final response
        return { text: message.content || "" };
    }
  }
  
  return { text: "Max turns reached without final response." };
};
