import React, { useState, useEffect, useRef } from 'react';

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  sender: User;
  text: string;
  timestamp: Date;
}

interface Resolution {
  id: string;
  title: string;
  status: 'ongoing' | 'resolved' | 'pending';
  participants: User[];
  description: string;
}

export default function Chat() {
  const [currentUser, setCurrentUser] = useState<User>({id: '1', name: 'User'});
  const [view, setView] = useState<'list' | 'chat' | 'new-resolution'>('list');
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentResolution, setCurrentResolution] = useState<Resolution | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample data - replace with API calls
  useEffect(() => {
    const sampleResolutions: Resolution[] = [
      {
        id: '1',
        title: 'Team Project',
        status: 'ongoing',
        participants: [
          {id: '1', name: 'User'},
          {id: '2', name: 'Alice'},
          {id: '3', name: 'Bob'}
        ],
        description: 'Discussion about the new project'
      }
    ];
    setResolutions(sampleResolutions);
  }, []);

  const openChat = (resolution: Resolution) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket(`ws://localhost:8000/ws/${resolution.id}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      setCurrentResolution(resolution);
      setView('chat');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    const message = {
      id: Date.now().toString(),
      sender: currentUser,
      text: newMessage,
      timestamp: new Date()
    };

    socketRef.current.send(JSON.stringify(message));
    setNewMessage('');
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {view === 'list' && (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Resolution Processes</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resolutions.map((resolution) => (
              <div key={resolution.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{resolution.title}</h2>
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    resolution.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    resolution.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {resolution.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{resolution.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {resolution.participants.length} participants involved
                </p>
                <button
                  onClick={() => openChat(resolution)}
                  className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700"
                >
                  Continue
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'chat' && currentResolution && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow h-[80vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">{currentResolution.title}</h2>
            <button 
              onClick={() => setView('list')}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to list
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 ${message.sender.id === currentUser.id ? 'text-right' : 'text-left'}`}
              >
                <div className={`inline-block p-3 rounded-lg ${
                  message.sender.id === currentUser.id 
                    ? 'bg-indigo-100 text-indigo-900' 
                    : 'bg-gray-200 text-gray-900'
                }`}>
                  <div className="font-medium">{message.sender.name}</div>
                  <div>{message.text}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-r-lg px-4 hover:bg-indigo-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}