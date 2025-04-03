import { useState, useEffect, useRef } from 'react';
import get_data from "./needs"
interface Message {
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  user_id: string;
  user_name?: string;
}

export default function ConflictResolution() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState('');
  const [userId] = useState(`user_${Math.random().toString(36).substring(7)}`);
  const [userName, setUserName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  // Connect to WebSocket
  const connectToRoom = () => {
    if (!roomId.trim() || !userName.trim()) {
      setError('Please enter both room ID and your name');
      return;
    }

    setError(null);
    const got_data = get_data("else")
    const socketUrl = `${got_data}${roomId}/${userId}/${encodeURIComponent(userName)}`;
    
    try {
      ws.current = new WebSocket(socketUrl);
      
      ws.current.onopen = () => {
        setIsConnected(true);
        setMessages(prev => [...prev, {
          type: 'system',
          content: `Connected to room ${roomId}`,
          timestamp: new Date().toISOString(),
          user_id: 'system'
        }]);
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data) as Message;
        setMessages(prev => [...prev, message]);
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        setMessages(prev => [...prev, {
          type: 'system',
          content: 'Disconnected from room',
          timestamp: new Date().toISOString(),
          user_id: 'system'
        }]);
      };

      ws.current.onerror = (error) => {
        setError('Connection error. Please try again.');
        console.error('WebSocket error:', error);
      };

    } catch (err) {
      setError('Failed to connect. Please check your URL.');
      console.error(err);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!inputMessage.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    ws.current.send(JSON.stringify({
      type: 'message',
      content: inputMessage
    }));
    setInputMessage('');
  };

  // Request mediation
  const requestMediation = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    ws.current.send(JSON.stringify({
      type: 'request_mediation'
    }));
  };

  // Disconnect
  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Conflict Resolution Mediation</h1>
        
        {!isConnected ? (
          <div className="bg-white/10 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2">Room ID</label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 border border-white/20"
                  placeholder="Enter room ID"
                />
              </div>
              <div>
                <label className="block mb-2">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 border border-white/20"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <button
              onClick={connectToRoom}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
            >
              Join Room
            </button>
            {error && <p className="mt-2 text-red-400">{error}</p>}
          </div>
        ) : (
          <>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="bg-green-500 w-2 h-2 rounded-full inline-block mr-2"></span>
                  <span>Connected to room: {roomId}</span>
                </div>
                <button
                  onClick={disconnect}
                  className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700 transition"
                >
                  Leave Room
                </button>
              </div>

              <div className="h-96 overflow-y-auto mb-4 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.user_id === userId ? 'justify-end' : 
                      msg.user_id === 'ai_mediator' ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        msg.user_id === userId ? 'bg-blue-600' :
                        msg.user_id === 'ai_mediator' ? 'bg-purple-600' :
                        msg.user_id === 'system' ? 'bg-gray-600' : 'bg-indigo-600'
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1">
                        {msg.user_name || 
                         (msg.user_id === 'ai_mediator' ? 'Mediator' : 
                          msg.user_id === 'system' ? 'System' : 'Unknown')}
                      </div>
                      <p>{msg.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 p-2 rounded bg-white/10 border border-white/20"
                  placeholder="Type your message..."
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                  Send
                </button>
                <button
                  onClick={requestMediation}
                  className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
                  title="Request AI mediation"
                >
                  Mediate
                </button>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <h2 className="font-semibold mb-2">Participants</h2>
              <p>User: {userName}</p>
              <p className="text-sm text-white/70">
                Share the room ID with others to invite them
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}