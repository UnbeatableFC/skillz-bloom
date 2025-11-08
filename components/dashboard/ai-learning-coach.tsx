"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { Send, Loader2, Bot } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  ChatMessage,
  LearningPathKey,
  MasterRoadmap,
  Reflection,
} from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { generateContentWithRetry } from "@/hooks/geminiAPICall";
import { ChatMessageBubble } from "./chatBubble";

// --- Main Component ---
const AICoachChat = () => {
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [contextReady, setContextReady] = useState(false);
  const [contextString, setContextString] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const userId = user?.id;

  // --- 2. Context Aggregation (Roadmap + Reflections) ---
  useEffect(() => {
    if (!db || !userId) return;

    const aggregateContext = async () => {
      let context = "";

      // --- A. Get Current Roadmap Info (Active Phase/Module) ---
      const roadmapDocRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );

      const unsubscribeRoadmap = onSnapshot(
        roadmapDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as MasterRoadmap & {
              careerGoal?: string;
              learningPath?: LearningPathKey;
            };
            context += `\n--- USER ROADMAP STATUS ---\n`;
            context += `Career Goal: ${data.careerGoal}\n`;
            context += `Learning Path: ${data.learningPath}\n`;

            const activePhase = data.phases?.find(
              (p) => p.status === "active"
            );
            if (activePhase) {
              context += `Active Phase: ${activePhase.title}\n`;
              const activeModule = activePhase.modules.find(
                (m) => m.module_status !== "completed"
              );
              context += `Active Module: ${
                activeModule ? activeModule.name : "Phase Review"
              }\n`;
            }
          }
          // Don't set contextReady yet, wait for reflections
        },
        (err) => console.error("Roadmap context error:", err)
      );

      // --- B. Get Last 3 Reflections ---
      const reflectionsColRef = collection(
        db,
        "users",
        userId,
        "reflections"
      );

      const q = query(
        reflectionsColRef,
        orderBy("timestamp", "desc")
      );

      try {
        const snapshot = await getDocs(q);
        const latestReflections: Reflection[] = snapshot.docs
          .slice(0, 3)
          .map((d) => d.data() as Reflection);

        if (latestReflections.length > 0) {
          context += `\n--- LATEST REFLECTIONS (Max 3) ---\n`;
          latestReflections.forEach((r, index) => {
            const dateObj = new Date(r.updatedAt); // Convert string to Date
            const formattedDate = dateObj.toLocaleDateString();
            context += `Reflection ${
              index + 1
            } (${formattedDate}): ${r.content.substring(
              0,
              150
            )}...\n`;
          });
        }
      } catch (err) {
        console.error("Reflections context error:", err);
      }

      setContextString(context);
      setContextReady(true);

      // Cleanup function returns the roadmap unsubscribe function
      return () => unsubscribeRoadmap();
    };

    aggregateContext();
  }, [userId]);

  // --- 3. Auto-scroll to bottom of chat ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // --- 4. System Prompt Definition ---
  const getSystemPrompt = useCallback(() => {
    return `You are the **AI Learning Coach**, a highly supportive, knowledgeable, and proactive mentor. Your goal is to guide the user in their career path by leveraging their current learning status and reflections.
        
        **RULES:**
        1. **Context First:** Use the provided USER CONTEXT (Roadmap and Reflections) to personalize your response.
        2. **Grounding:** Use Google Search for up-to-date information, real-world examples, or specific technical details. Always include sources.
        3. **Tone:** Encouraging, informative, and professional. Use markdown formatting (bold, lists) to improve readability.
        4. **Actionable Advice:** Every response should either answer the user's question directly or offer an actionable next step, relevant resource, or challenge.
        5. **Initialization:** When the chat is empty, provide a welcoming message and suggest ways to start the conversation based on the context (e.g., "Ask me about your active module," or "Should we review your latest reflection?").

${contextString}

End of Context. Respond to the user's query.`;
  }, [contextString]);

  // --- 5. Handle User Submission ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputMessage.trim();
    if (!query || isThinking || !contextReady) return;

    setInputMessage("");
    const userMessage: ChatMessage = { role: "user", text: query };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const systemPrompt = getSystemPrompt();
      const { text, sources } = await generateContentWithRetry(
        systemPrompt,
        query
      );

      const coachMessage: ChatMessage = {
        role: "model",
        text: text,
        sources: sources,
      };
      setChatHistory((prev) => [...prev, coachMessage]);
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage: ChatMessage = {
        role: "model",
        text: "I ran into an issue connecting with the learning network. Please try again in a moment.",
        isError: true,
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  // --- Initial Greeting Message ---
  useEffect(() => {
    if (contextReady && chatHistory.length === 0) {
      setChatHistory([
        {
          role: "model",
          text: `Welcome! I'm your AI Learning Coach. I've reviewed your current roadmap and recent reflections.
                
**How can I help you today?**

Here are some things you can ask me:
1.  *What's the most important skill in my active module?*
2.  *Can you give me a practical challenge based on my latest reflection?*
3.  *What should I focus on next to achieve my career goal?*
4.  *Explain a concept from my current learning path.*`,
        },
      ]);
    }
  }, [contextReady, chatHistory.length]);

  // --- RENDER LOGIC ---

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="flex items-center p-4 bg-white shadow-md border-b border-indigo-200">
        <Bot className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-xl font-bold text-gray-800">
          AI Learning Coach
        </h1>
      </header>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4">
        {chatHistory.map((msg, index) => (
          <ChatMessageBubble key={index} message={msg} />
        ))}
        {isThinking && (
          <div className="flex justify-start mb-4">
            <div className="p-4 bg-white text-gray-600 rounded-xl rounded-tl-none shadow-lg border border-gray-200 flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2 text-indigo-600" />
              <span className="text-sm">Coach is thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <footer className="p-4 bg-white shadow-inner border-t border-gray-200">
        {!contextReady && (
          <div className="text-center p-2 text-sm text-indigo-600 font-medium">
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            Gathering context from your roadmap and reflections...
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask your coach for personalized guidance or a challenge..."
            rows={1}
            className="flex-1 p-3 border border-gray-300 rounded-xl resize-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            disabled={isThinking || !contextReady}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={
              isThinking ||
              !contextReady ||
              inputMessage.trim().length === 0
            }
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-md transition duration-150 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isThinking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default AICoachChat;
