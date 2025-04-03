import { useState } from 'react';
import get_data from "./needs"

interface Message {
  text: string;
  timestamp: string;
  isAI: boolean;
}

export default function Meditation() {
  const [inputMessage, setInputMessage] = useState('');
  const [showChatLog, setShowChatLog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>([
    {
      text: "Hello!  Come, Let's have a chat",
      timestamp: new Date().toLocaleString(),
      isAI: true
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setError(null);
    const userMessage = inputMessage;
    setInputMessage('');

    // Add user message to UI immediately
    const newUserMessage: Message = {
      text: userMessage,
      timestamp: new Date().toLocaleString(),
      isAI: false,
    };
    setChatLog(prev => [...prev, newUserMessage].slice(-50));

    try {
      setIsLoading(true);
      
      // Convert to Cohere-compatible format
      const cohereHistory = chatLog.map(msg => ({
        role: msg.isAI ? "CHATBOT" : "USER",
        message: msg.text
      }));
      const myapi = get_data("api"); 
      const response = await fetch(`${myapi}/chat/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          user_message: userMessage,
          chat_history: cohereHistory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "API request failed");
      }

      const data = await response.json();
      const aiResponse: Message = {
        text: data.response,
        timestamp: new Date().toLocaleString(),
        isAI: true,
      };
      setChatLog(prev => [...prev, aiResponse].slice(-50));

    } catch (error) {
      console.error("API Error:", error);
      setError(error instanceof Error ? error.message : "Request failed");
      
      const errorMessage: Message = {
        text: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date().toLocaleString(),
        isAI: true,
      };
      setChatLog(prev => [...prev, errorMessage].slice(-50));
    } finally {
      setIsLoading(false);
    }
  };
return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowChatLog(!showChatLog)}
              className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              {showChatLog ? 'Hide Chat Log' : 'Show Chat Log'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-6 flex-col md:flex-row">
            <div className={`flex-1 ${showChatLog ? 'md:w-1/2' : 'w-full'}`}>
              <div className="h-96 flex items-center justify-center mb-8">
                {isLoading ? (
                  <div className="animate-pulse">Thinking...</div>
                ) : (
                  <p className="text-3xl font-light text-center animate-fade-in">
                    {chatLog.length > 0 ? chatLog[chatLog.length - 1].text : 'Welcome to your meditation session'}
                  </p>
                )}
              </div>

              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </div>

            {showChatLog && (
              <div className="md:w-1/2 bg-white/10 rounded-lg p-4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Chat History</h2>
                <div className="space-y-4">
                  {chatLog.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.isAI ? 'bg-purple-800' : 'bg-indigo-700'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs text-gray-300 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}