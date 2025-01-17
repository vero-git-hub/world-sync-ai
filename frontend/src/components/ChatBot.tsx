import React, { useState } from 'react';
import "../styles/components/ChatBot.css";

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
    const [input, setInput] = useState("");

    const handleSendMessage = () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput("");

        setTimeout(() => {
            setMessages([...newMessages, { text: "I'm still learning. Ask me anything about MLB!", sender: "bot" }]);
        }, 1000);
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Ask about MLB..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBot;