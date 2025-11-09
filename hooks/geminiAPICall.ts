
// --- Utility: Sleep for Backoff ---
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


// --- Gemini API Call with Grounding and Exponential Backoff ---
export const generateContentWithRetry = async (
    systemPrompt: string, 
    userQuery: string, 
    maxRetries = 3
): Promise<{ text: string, sources: { uri: string, title: string }[] }> => {

    const apiKey = process.env.NEXT_PUBLIC_API_KEY! ?? ""
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        tools: [{ "google_search": {} }], // Enable Google Search grounding
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 429 && attempt < maxRetries - 1) {
                // Rate limit error (429), implement exponential backoff
                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                await sleep(delay);
                continue; 
            }

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API call failed with status ${response.status}: ${errorBody}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];
            
            if (candidate && candidate.content?.parts?.[0]?.text) {
                const text = candidate.content.parts[0].text;
                
                let sources: { uri: string, title: string }[] = [];
                const groundingMetadata = candidate.groundingMetadata;
                if (groundingMetadata && groundingMetadata.groundingAttributions) {
                    sources = groundingMetadata.groundingAttributions
                        .map((attribution : { web?: { uri?: string; title?: string } }) => ({
                            uri: attribution.web?.uri,
                            title: attribution.web?.title,
                        }))
                        .filter((source: { uri?: string; title?: string }) => source.uri && source.title);
                }
                
                return { text, sources };

            } else {
                throw new Error("Received an invalid response structure from the API.");
            }

        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt === maxRetries - 1) {
                throw new Error("Failed to get a response from the AI Coach after multiple retries.");
            }
            // Sleep before retrying
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            await sleep(delay);
        }
    }
    // Should not be reached if maxRetries > 0, but for type safety
    throw new Error("Exceeded maximum retries."); 
};