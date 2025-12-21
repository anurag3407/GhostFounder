'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconDatabase, 
  IconSend, 
  IconRefresh,
  IconUser,
  IconRobot,
  IconCode,
  IconTable,
  IconCopy,
  IconCheck,
  IconSparkles,
  IconHistory
} from '@tabler/icons-react';

export default function DataSpecterPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat history
    fetchChatHistory();
    
    // Initial greeting
    setMessages([{
      role: 'assistant',
      content: "👻 I am the Data Specter, your database oracle. Ask me anything about your data in plain English, and I shall conjure the answers from the shadows of your database.",
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      const res = await fetch('/api/agents/data-specter');
      if (res.ok) {
        const data = await res.json();
        setChatHistory(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agents/data-specter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          query: data.generatedQuery,
          results: data.results,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `❌ ${data.error || 'An error occurred while processing your request.'}`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Failed to connect to the Data Specter. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const loadConversation = (conversation) => {
    setMessages(conversation.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })));
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "👻 Chat cleared. What secrets shall we uncover from your database?",
      timestamp: new Date()
    }]);
  };

  const exampleQueries = [
    "Show me all users who signed up this month",
    "What's our total revenue for Q1?",
    "Find the top 5 products by sales",
    "How many active subscriptions do we have?"
  ];

  return (
    <div className="min-h-screen flex">
      {/* Chat History Sidebar */}
      <div className="w-64 bg-ghost-dark/50 border-r border-white/10 p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-6">
          <IconHistory className="w-5 h-5 text-ghost-blue" />
          <h3 className="font-semibold text-white">Chat History</h3>
        </div>
        
        {chatHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">No previous conversations</p>
        ) : (
          <div className="space-y-2">
            {chatHistory.slice(0, 10).map((conv, i) => (
              <button
                key={conv._id || i}
                onClick={() => loadConversation(conv)}
                className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <p className="text-sm text-gray-400 truncate">{conv.title || 'Untitled'}</p>
                <p className="text-xs text-gray-600">
                  {new Date(conv.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-green/5 flex items-center justify-center border border-neon-green/30">
                <IconDatabase className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Data Specter</h1>
                <p className="text-gray-400 text-sm">Natural Language Database Queries</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <IconRefresh className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                    <IconRobot className="w-5 h-5 text-neon-green" />
                  </div>
                )}
                
                <div className={`max-w-2xl ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-ghost-blue/20 border border-ghost-blue/30' 
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Generated Query */}
                    {message.query && (
                      <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <IconCode className="w-4 h-4" />
                            Generated Query
                          </span>
                          <button
                            onClick={() => copyToClipboard(message.query, `query-${i}`)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            {copied === `query-${i}` ? (
                              <IconCheck className="w-4 h-4 text-green-500" />
                            ) : (
                              <IconCopy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                        <code className="text-sm text-neon-green font-mono">
                          {message.query}
                        </code>
                      </div>
                    )}
                    
                    {/* Results Table */}
                    {message.results && message.results.length > 0 && (
                      <div className="mt-4 overflow-x-auto">
                        <div className="flex items-center gap-2 mb-2">
                          <IconTable className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {message.results.length} result{message.results.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              {Object.keys(message.results[0]).map(key => (
                                <th key={key} className="text-left py-2 px-3 text-gray-400 font-medium">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {message.results.slice(0, 10).map((row, rowI) => (
                              <tr key={rowI} className="border-b border-white/5">
                                {Object.values(row).map((value, colI) => (
                                  <td key={colI} className="py-2 px-3 text-gray-300">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {message.results.length > 10 && (
                          <p className="text-xs text-gray-500 mt-2">
                            Showing 10 of {message.results.length} results
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <span className="text-xs text-gray-600 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-lg bg-ghost-blue/20 flex items-center justify-center flex-shrink-0">
                    <IconUser className="w-5 h-5 text-ghost-blue" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
                <IconSparkles className="w-5 h-5 text-neon-green animate-pulse" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Example Queries */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-gray-500 text-sm mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((query, i) => (
                <button
                  key={i}
                  onClick={() => setInput(query)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-white/10">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your data in plain English..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-green/50 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-neon-green text-black font-semibold rounded-xl hover:bg-neon-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <IconSend className="w-5 h-5" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
