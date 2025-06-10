import React, { useState } from "react";

export default function ChatBox({ patient }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("http://localhost:5000/cdsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });
      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.message };
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error getting response from server." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
          key={idx}
          className={`flex ${
          msg.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
          <div
            className={`rounded-xl p-2 max-w-xs text-sm shadow-md ${
              msg.role === "user"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
             }`}
          >
              <span className="block font-semibold mb-1">
               {msg.role === "user" ? "👩‍⚕️ Nurse" : "🤖 AI"}
              </span>
              <span>{msg.content}</span>
            </div>
          </div>
        ))}
      </div>


      <div className="flex items-center gap-2">
        <input
          className="flex-1 border rounded px-3 py-1"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
