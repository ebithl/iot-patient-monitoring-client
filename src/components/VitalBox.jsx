const VitalBox = ({ label, value, unit, isCritical }) => {
  return (
    <div
      className={`w-20 h-10 rounded-md flex flex-col items-center justify-center text-xs font-medium 
        ${isCritical ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-100'}`}
    >
      <div>
        {value}
      </div>
      <div className="text-[10px]">{label}</div>
    </div>
  );
};

export default VitalBox;