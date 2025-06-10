import React, { useState } from "react";

const ChatPanel = ({
  patients,
  selectedPatientId,
  onPatientChange,
  messages,
  onSendMessage,
  chatMode,
  setChatMode,
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="w-[400px] h-full border-l border-gray-300 flex flex-col bg-gray-50 shadow-lg">
      <div className="p-4 border-b bg-white space-y-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Chat Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="chatMode"
                value="patient"
                checked={chatMode === "patient"}
                onChange={() => setChatMode("patient")}
              />
              Patient-specific
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="chatMode"
                value="general"
                checked={chatMode === "general"}
                onChange={() => setChatMode("general")}
              />
              General
            </label>
          </div>
        </div>

        {chatMode === "patient" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => onPatientChange(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-100 text-right self-end ml-auto"
                : "bg-gray-200 text-left self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md"
          placeholder={
            chatMode === "patient"
              ? `Message about ${patients.find((p) => p.id === selectedPatientId)?.name || ""}`
              : "Ask general questions (e.g. critical patients)"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={chatMode === "patient" && !selectedPatientId}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
