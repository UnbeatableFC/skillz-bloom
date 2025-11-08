import { ChatMessage } from "@/types/types";
import { AlertTriangle, Bot, User } from "lucide-react";

// --- Chat Message Bubble Component ---
export const ChatMessageBubble = ({
  message,
}: {
  message: ChatMessage;
}) => (
  <div
    className={`flex ${
      message.role === "user" ? "justify-end" : "justify-start"
    } mb-4`}
  >
    <div
      className={`max-w-3/4 p-4 rounded-xl shadow-lg whitespace-pre-wrap ${
        message.role === "user"
          ? "bg-indigo-600 text-white rounded-br-none"
          : message.isError
          ? "bg-red-100 text-red-800 rounded-tl-none border border-red-300"
          : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
      }`}
    >
      <div className="flex items-center font-bold mb-1">
        {message.role === "user" ? (
          <User className="w-4 h-4 mr-2" />
        ) : (
          <Bot className="w-4 h-4 mr-2 text-indigo-600" />
        )}
        {message.role === "user" ? "You" : "AI Coach"}
      </div>
      <p>{message.text}</p>
      {message.sources && message.sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
          <p className="font-semibold mb-1">Sources:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {message.sources.slice(0, 3).map((source, index) => (
              <li key={index}>
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:text-indigo-700 truncate block"
                  title={source.title}
                >
                  {source.title || new URL(source.uri).hostname}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {message.isError && (
        <div className="mt-2 flex items-center text-xs text-red-600 font-medium">
          <AlertTriangle className="w-4 h-4 mr-1" />
          Chat error. Try again later.
        </div>
      )}
    </div>
  </div>
);
