import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatPanel from "./components/ChatPanel";
import VitalBox from './components/VitalBox';
import PatientTile from './components/PatientTile';

const App = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [chatHistory, setChatHistory] = useState({});
  const [chatMode, setChatMode] = useState("patient"); // "patient" or "general"
  const [selectedPatient, setSelectedPatient] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    //const socket = io("http://localhost:5000");
    //const socket = io(`${backendUrl}`, {transports: ['websocket']});
    const socket = io(`${backendUrl}`);
    socket.on("vitals_update", (data) => {
      console.log("Realtime data received", data);
      setPatients((prev) =>
        prev.map((p) => (p.id === data.id ? { ...p, vitals: data.vitals, risk: data.risk } : p))
      );
    });    
    
    const fetchPatients = async () => {
      try {
        //const response = await fetch("http://localhost:5000/patients");
        const response = await fetch(`${backendUrl}/patients`);
        const data = await response.json();
        setPatients(data);
        if (data.length > 0) {
          setSelectedPatientId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
    
    //return () => socket.disconnect();
    
    return () => {
      socket.off("vitals_update");
    };    
    
  }, []);


const getRiskColor = (risk) => {
  switch (risk) {
    case "low": return 'bg-green-500'; // Low
    case "medium": return 'bg-yellow-400'; // Moderate
    case "high": return 'bg-red-500'; // High
    default: return 'bg-gray-400';
  }
};  

const riskColors = {
  low: "bg-green-500",
  medium: "bg-yellow-400",
  high: "bg-orange-500",
  critical: "bg-red-600",
};  

  const handlePatientChange = (patientId) => {
    //setSelectedPatientId(patientId);
    setSelectedPatientId(patientId || "");  // empty string = global
  };



const sendMessage = async (message) => {
  const isGlobal = chatMode === "general";
  const newMessage = { role: "user", content: message };
  const historyKey = isGlobal ? "global" : selectedPatientId;
  const currentHistory = chatHistory[historyKey] || [];

  // Update chatHistory immediately with the user message
  setChatHistory((prev) => ({
    ...prev,
    [historyKey]: [...currentHistory, newMessage],
  }));

  try {
    const selectedPatient = patients.find((p) => p.id === selectedPatientId);
    //const response = await fetch("http://localhost:5000/cdsa", {
    const response = await fetch(`${backendUrl}/cdsa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...currentHistory, newMessage],
        ...(isGlobal
          ? { patients }
          : {
              patient: {
                id: selectedPatientId,
                name: selectedPatient.name,
                vitals: selectedPatient.vitals,
                history: selectedPatient.history,
              },
            }),
      }),
    });

    const result = await response.json();
    const aiMessage = { role: "assistant", content: result.message };

    setChatHistory((prev) => ({
      ...prev,
      [historyKey]: [...(prev[historyKey] || []), aiMessage],
    }));
  } catch (error) {
    console.error("Error in sendMessage:", error);
  }
};



  return (
    <div className="flex h-screen">

      <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-5 gap-1 p-1">
              {patients.map(patient => (
                  <PatientTile key={patient.id} patient={patient} isSelected={patient.id === selectedPatientId} onSelect={setSelectedPatientId} />
              ))}
          </div>
      </div>
      
<ChatPanel
  patients={patients}
  selectedPatientId={selectedPatientId}
  onPatientChange={handlePatientChange}
  messages={
    (chatHistory[chatMode === "patient" ? selectedPatientId : "global"] || []).map((msg) => ({
      sender: msg.role === "user" ? "user" : "ai",
      text: msg.content,
    }))
  }
  onSendMessage={sendMessage}
  chatMode={chatMode}
  setChatMode={setChatMode}
/>
      
      
    </div>
  );
};

export default App;
