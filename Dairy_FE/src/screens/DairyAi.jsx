import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import cowAi5 from '../assetes/Dairy/IMG-20251109-WA0005.png';

const DairyAi = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("Thinking");
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Thinking animation
  useEffect(() => {
    if (!thinking) return;
    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setThinkingText("Thinking" + ".".repeat(dotCount));
    }, 500);
    return () => clearInterval(interval);
  }, [thinking]);

  const submitQuestion = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setThinking(true);

    try {
      const res = await axios.post("http://localhost:4000/api/user/runAi", {
        userMessage,
      });

      // ✅ FIX: correct response handling
      const aiMessage =
        res.data?.response ||
        "🤖 Sorry, I didn’t get that. Please try again.";

      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "ai", text: aiMessage }]);
        setThinking(false);
      }, 1200);

    } catch (error) {
      console.error("Error:", error);
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "⚠️ Server error. Please try again later." },
      ]);
    }
  };

  return (
    <div
      className="container mt-4 p-4"
      style={{
        maxWidth: "700px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)",
        boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
      }}
    >
      <div>
        <img
          src={cowAi5}
          alt="Cow"
          className="position-absolute shrink-image"
          style={{ top: '40px', maxWidth: '100px' }}
        />
        <h3 className="text-center mb-4 fw-bold text-success">
          Gauri Your Dairy Saathi!
        </h3>
      </div>

      {/* Chat Box */}
      <div
        className="p-3 mb-3"
        style={{
          height: "420px",
          overflowY: "auto",
          background: "#fdfdfd",
          borderRadius: "15px",
          border: "1px solid #e0e0e0",
        }}
      >
        {messages.length === 0 && (
          <p className="text-center text-muted mt-5">
            Ask me Anything!
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex ${
              msg.from === "user"
                ? "justify-content-end"
                : "justify-content-start"
            } mb-3`}
          >
            <div
              className={`p-3 rounded-4 shadow-sm ${
                msg.from === "user"
                  ? "bg-success text-white"
                  : "bg-light text-dark border"
              }`}
              style={{
                maxWidth: "75%",
                whiteSpace: "pre-wrap",
                animation: "fadeIn 0.5s ease",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Thinking */}
        {thinking && (
          <div className="d-flex justify-content-start mb-2 fade-in">
            <div
              className="bg-light border text-muted p-2 px-3 rounded-4 shadow-sm"
              style={{
                fontStyle: "italic",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "pulse 1.2s infinite ease-in-out",
              }}
            >
              <span className="spinner-border spinner-border-sm text-success" />
              {thinkingText}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-group">
        <input
          type="text"
          className="form-control border-success rounded-start"
          placeholder="Ask about dairy farming..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitQuestion()}
        />
        <button
          className="btn btn-success px-4 rounded-end"
          onClick={submitQuestion}
        >
          Send
        </button>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.03); }
          }

          .fade-in {
            animation: fadeIn 0.6s ease;
          }
        `}
      </style>
    </div>
  );
};

export default DairyAi;