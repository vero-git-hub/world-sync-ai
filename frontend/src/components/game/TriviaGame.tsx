import React, { useState, useEffect } from "react";
import "../../styles/components/home/dashboard/TriviaGame.css";

const API_URL = "/api/trivia";

const TriviaGame: React.FC = () => {
    const [question, setQuestion] = useState<string>("");
    const [options, setOptions] = useState<string[]>([]);
    const [questionId, setQuestionId] = useState<string>("");
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const fetchQuestion = async () => {
        setLoading(true);
        console.log("🔄 Fetching new trivia question...");

        try {
            const response = await fetch(`${API_URL}/question`);
            console.log("✅ Received response from server:", response);

            if (!response.ok) {
                throw new Error(`❌ Failed to load question. Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("📊 Question data received:", data);

            if (!data.options || data.options.length === 0) {
                throw new Error("⚠️ No options available in question data.");
            }

            setQuestion(data.question);
            setOptions(data.options);
            setQuestionId(data.id);
            setFeedback("");
            setSelectedAnswer("");

            setTimeout(() => setLoading(false), 300);
        } catch (error) {
            console.error("🚨 Error fetching trivia question:", error);
            setFeedback("⚠️ Error loading question. Try again later.");
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!selectedAnswer || !questionId) {
            console.error("🚨 Error: questionId or selectedAnswer is missing!", {
                questionId,
                selectedAnswer
            });
            setFeedback("⚠️ Something went wrong. Try again.");
            return;
        }

        console.log("📤 Sending answer to server...", { questionId, userAnswer: selectedAnswer });

        try {
            const response = await fetch(`${API_URL}/answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questionId, userAnswer: selectedAnswer }),
            });

            console.log("✅ Received response from server:", response);

            if (!response.ok) {
                throw new Error(`❌ Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("📊 Answer response data:", data);

            setFeedback(data.reply);
        } catch (error) {
            console.error("🚨 Error checking answer:", error);
            setFeedback("⚠️ Error checking answer. Please try again.");
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    return (
        <div className="trivia-widget">
            <h2>MLB Trivia ⚾</h2>

            {loading ? (
                <p className="loading">Loading question...</p>
            ) : (
                <>
                    <p>{question}</p>
                    <div className="trivia-options">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                className={`trivia-option ${selectedAnswer === option ? "selected" : ""}`}
                                onClick={() => {
                                    console.log("🟢 Selected answer:", option);
                                    setSelectedAnswer(option);
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <button
                className="submit-btn"
                onClick={submitAnswer}
                disabled={!selectedAnswer || loading}
            >
                Submit
            </button>

            {feedback && <p className="trivia-feedback">{feedback}</p>}

            <button className="next-question-btn" onClick={fetchQuestion} disabled={loading}>
                Next Question
            </button>
        </div>
    );
};

export default TriviaGame;