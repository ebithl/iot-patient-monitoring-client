import React, { useState } from "react";

const getRiskColor = (risk) => {
  switch (risk) {
    case "low":
      return "bg-green-400";
    case "medium":
      return "bg-yellow-400";
    case "high":
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
};

const PatientTile = ({ patient, isSelected, onSelect }) => {

return (
<div className={`w-[173px] h-[73px] rounded-lg border p-2 flex flex-col justify-between shadow-sm cursor-pointer transition ${isSelected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200"}`} onClick={() => onSelect(patient.id)}>

  <div className="flex justify-between items-center text-[12px] font-semibold">
    <div>{patient.name} ({patient.gender[0]}, {patient.age})</div>
    <div className={`w-3 h-3 rounded-full ${getRiskColor(patient.risk)}`}></div>
  </div>

  <div className="grid grid-cols-5 justify-between items-center gap-[2px] mt-1">
    {["HR", "SpO2", "RR", "BP", "Temp"].map((key) => (
      <div
        key={key}
        className="w-[35px] h-[30px] bg-gray-50 rounded flex flex-col items-center justify-between p-[2px]"
      >
        <div className="text-[7px] font-bold truncate max-w-full">
          {patient.vitals?.[key] ?? "--"}
        </div>
        <div className="text-[7px] text-gray-500">{key}</div>
      </div>
    ))}
  </div>
</div>
);

};

export default PatientTile;
