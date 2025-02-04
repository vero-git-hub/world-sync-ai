import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../../styles/components/game/TriviaGame.css";
import API from "../../api.ts";

const TriviaGame: React.FC = () => {
    const [question, setQuestion] = useState<string>("");
    const [options, setOptions] = useState<string[]>([]);
    const [questionId, setQuestionId] = useState<string>("");
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
    const [answered, setAnswered] = useState<boolean>(false);

    const userToken = localStorage.getItem("token");

    const fetchQuestion = async () => {
        setLoading(true);
        setGameStarted(true);
        setCorrectAnswer(null);
        setSelectedAnswer(null);
        setFeedback("");
        setAnswered(false);

        try {
            const response = await API.get<{ question: string; options: string[]; id: string; correctAnswer: string }>(
                "/trivia/question",
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (!response.data.options || response.data.options.length === 0) {
                throw new Error("No options available in question data.");
            }

            setQuestion(response.data.question);
            setOptions(response.data.options);
            setQuestionId(response.data.id);
            setCorrectAnswer(response.data.correctAnswer);

            setTimeout(() => setLoading(false), 300);
        } catch (error) {
            console.error("Error fetching trivia question:", error);
            setFeedback("⚠️ Error loading question. Try again later.");
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!selectedAnswer || !questionId) {
            setFeedback("⚠️ Please select an answer first!");
            return;
        }

        try {
            const response = await API.post<{ reply: string }>(
                "/trivia/answer",
                { questionId, userAnswer: selectedAnswer },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            setFeedback(response.data.reply);
            setAnswered(true);
        } catch (error) {
            console.error("Error checking answer:", error);
            setFeedback("⚠️ Error checking answer. Please try again.");
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    return (
        <div className="trivia-widget">
            {!gameStarted ? (
                <>
                    <h2 className="trivia-header">MLB Trivia ⚾</h2>
                    <img src="/images/futuristic-robot.webp" alt="Trivia Game" className="trivia-image" />
                    <p className="trivia-intro-text">
                        Ready to test your MLB knowledge? 🌟
                        <br />
                        Click "Start Trivia" to begin!
                    </p>
                    <button className="start-trivia-btn" onClick={fetchQuestion}>
                        Start Trivia
                    </button>
                </>
            ) : loading ? (
                <p className="loading">Loading question...</p>
            ) : (
                <>
                    <p className="trivia-question">{question}</p>
                    <div className="trivia-options">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                className={`trivia-option 
                                    ${answered
                                    ? option === correctAnswer
                                        ? "correct"
                                        : option === selectedAnswer
                                            ? "incorrect"
                                            : ""
                                    : option === selectedAnswer
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => setSelectedAnswer(option)}
                                disabled={answered}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div className="trivia-feedback">
                            <div className="trivia-feedback-content">
                                <ReactMarkdown>{feedback}</ReactMarkdown>
                            </div>
                        </div>
                    )}

                    <div className="trivia-actions">
                        <button className="submit-btn" onClick={submitAnswer} disabled={!selectedAnswer || loading || !!feedback}>
                            Submit
                        </button>
                        <button className="next-question-btn" onClick={fetchQuestion} disabled={loading}>
                            Next Question
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TriviaGame;