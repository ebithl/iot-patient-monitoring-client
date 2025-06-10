import React, { useState } from "react";
import { getCDSASummary } from "../api/openai";
import ChatBox from "./ChatBox";
import VitalBox from './VitalBox';

function PatientCard({ patient }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

  const handleFetchSummary = async () => {
    setLoading(true);
    const aiSummary = await getCDSASummary(patient);
    setSummary(aiSummary);
    setLoading(false);
  };


  
  return (


<div className={`w-[250px] h-[120px] bg-gray-600 rounded-xl p-2 shadow-md ${getShadowClass(risk)} flex flex-col justify-between`}>


     
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-400 font-semibold">{patient.name} ({(patient.gender).charAt(0).toUpperCase()} {patient.age})</h3>
        {risk !== undefined && (
        <>

          <div
	      className={`w-3 h-3 rounded-full ${getRiskColor(risk)}`}
	      title={`Risk: ${getRiskLabel(risk)}`}
          ></div>
        </>
        )}
      </div>



      <div className="flex justify-between items-center mt-2 px-1 space-x-1">

      
        {patient.vitals && (
          <>

  <VitalBox label="HR" value={patient.vitals.HR} unit="bpm" isCritical={vitals.pulse > 100 || vitals.pulse < 60} />
  <VitalBox label="SpO2" value={patient.vitals.SpO2} unit="%" isCritical={vitals.spo2 < 94} />
  <VitalBox label="RR" value={patient.vitals.RR} unit="rpm" isCritical={vitals.rr > 22 || vitals.rr < 12} />
  <VitalBox label="BP" value={patient.vitals.BP} unit="" isCritical={false /* placeholder */} />         
  <VitalBox label="Temp" value={patient.vitals.temp} unit="°F" isCritical={vitals.temp > 100.4} />
   


            
          </>
        )}
      </div>


    </div>
  );  
  
}

export default PatientCard;
