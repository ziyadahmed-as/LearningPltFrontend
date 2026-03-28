import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

export default function FatraAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Fatra AI, your learning assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let response = "I'm still learning about that topic! You can find more details in our Course Catalog.";
      if (input.toLowerCase().includes('help')) {
        response = "Sure! I can help you find courses, manage your dashboard, or explain how Fatra Academy works. What do you need?";
      } else if (input.toLowerCase().includes('course')) {
        response = "We have a wide range of courses from Entrance Exam prep to Advanced Programming. Check out the 'Courses' page for the full list!";
      } else if (input.toLowerCase().includes('admin')) {
        response = "The Admin Dashboard is where site structure and user approvals are managed. You can toggle taxonomies and review course submissions there.";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  // Open chat from external events (if we add global listeners)
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-fatra-ai', handleOpenChat);
    return () => window.removeEventListener('open-fatra-ai', handleOpenChat);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          className="fatra-chat-trigger fade-in"
          onClick={() => setIsOpen(true)}
          title="Chat with Fatra AI"
        >
          <div className="trigger-pulse"></div>
          <Bot size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fatra-chat-window slide-up">
          <header className="fatra-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="fatra-ai-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Fatra AI</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="online-indicator"></span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>Online & Ready</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <Minimize2 size={18} />
              </button>
            </div>
          </header>

          <div className="fatra-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`fatra-msg-wrapper ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                 <div className="fatra-msg-bubble">
                    {msg.content}
                 </div>
              </div>
            ))}
            {isTyping && (
              <div className="fatra-msg-wrapper assistant">
                <div className="fatra-msg-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="fatra-chat-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask Fatra AI anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
