import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const API_URL = "/api/ai/chat/mlb";

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userToken = localStorage.getItem("token");

    useEffect(() => {
        if (!hasInteracted) {
            setMessages([
                {
                    text: "👋 Hi there! 🤖 Ask me about MLB or general questions, and I will respond to you! ⚾\n\n![Gemini Chat](/images/friendly-robot.webp)",
                    sender: "bot"
                }
            ]);
        }
    }, [hasInteracted]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        let newMessages;
        if (!hasInteracted) {
            setHasInteracted(true);
            newMessages = [{ text: input, sender: "user" }];
        } else {
            newMessages = [...messages, { text: input, sender: "user" }];
        }

        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Failed to fetch response");
            }

            setMessages([...newMessages, { text: data.reply, sender: "bot" }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages([...newMessages, { text: "⚠️ Error: Unable to get response.", sender: "bot" }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-widget">
            <div className="chat-window">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    ))}
                    {loading && <div className="chat-message bot">⏳ Thinking...</div>}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Ask about MLB..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={loading}
                />
                <button onClick={handleSendMessage} disabled={loading}>Send</button>
            </div>
        </div>
    );
};

export default ChatBot;