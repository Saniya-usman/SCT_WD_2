import React, {  useEffect, useRef, useState } from "react";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
const [isDark, setIsDark] = useState(true);


  const intervalRef = useRef(null);
    const lapEndRef = useRef(null);
useEffect(() => {
  return () => clearInterval(intervalRef.current)
}, [])

useEffect(() => {
  const savedLaps = localStorage.getItem("laps");

  if (savedLaps) {
    setLaps(JSON.parse(savedLaps));
  }
}, []);
useEffect(() => {
  localStorage.setItem("laps", JSON.stringify(laps));
}, [laps]);

useEffect(() => {
  lapEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [laps]);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
  };

  const stop = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTime(0);
    setLaps([]);
    localStorage.removeItem("laps");
  };

  const lap = () => {
    if (!isRunning) return;
    setLaps((prev) => [...prev, time]);
  };

  const formatTime = (t = time) => {
  const minutes = Math.floor(t / 60000)
  const seconds = Math.floor((t / 1000) % 60)
  const ms = Math.floor((t % 1000) / 10)

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(2, "0")}`
};

  // Circle logic
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = (time % 60000) / 60000;
  const strokeDashoffset = circumference - progress * circumference;

  const fastestLap = laps.length > 0 ? Math.min(...laps) : null;
  const slowestLap = laps.length > 0 ? Math.max(...laps) : null;
  
  const toggleTheme = () => {
  setIsDark(prev => !prev);
};
  return (
    <div
  className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
    isDark
      ? "bg-gradient-to-br from-[#530d28] via-[#7d113a] to-[#A53860] text-white"
      : "bg-gradient-to-br from-white/80 via-pink-50 to-pink-100 border-pink-200 text-black"
  }`}
>
   <div className="bubbles">
  {[...Array(25)].map((_, i) => (
    <span
      key={i}
      className="bubble"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${6 + Math.random() * 6}s`,
        width: `${6 + Math.random() * 6}px`,
        height: `${6 + Math.random() * 6}px`,
        background: "rgba(239, 136, 173, 0.25)",
      }}
    />
  ))}
</div>



      {/* Glass Card */}
      <div
  className={`backdrop-blur-lg p-8 rounded-3xl shadow-2xl border w-[350px] text-center transition-all duration-500 ${
    isDark
      ? "bg-white/10 border-white/20 text-white"
      : "bg-white border-gray-300 text-black"
  }`}
>
    
       <button
  onClick={toggleTheme}
  className={`mb-4 px-4 py-2 rounded-full border transition hover:scale-105 ${
    isDark
      ? "border-white/30 text-white"
      : "border-gray-300 text-black"
  }`}
>
  {isDark ? "🌙 " : "☀️ "}
</button>
        <h1 className="text-2xl font-bold mb-6">Stopwatch</h1>

        {/* Circle Timer */}
        <div className="relative flex items-center justify-center mb-6">
          <svg width="220" height="220">
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke={isDark ? "#ffffff20" : "#00000015"}
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke={isDark ? "#EF88AD" : "#A53860"}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 110 110)"
            />
          </svg>

          <span className="absolute text-3xl font-mono">
            {formatTime()}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <button
  onClick={start}
  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#A53860] to-[#EF88AD] text-white font-medium shadow-md hover:shadow-pink-300/10 hover:scale-105 transition-all duration-300"
>
  Start
</button>

          <button
  onClick={stop}
  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#670D2F] to-[#A53860] text-white font-medium shadow-md hover:shadow-pink-400/10 hover:scale-105 transition-all duration-300"
>
  Stop
</button>

          <button
  onClick={lap}
  disabled={!isRunning}
  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#EF88AD] to-[#A53860] text-white font-medium shadow-md hover:shadow-pink-400/10 hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:scale-100"
>
  Lap
</button>

          <button
  onClick={reset}
  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#3A0519] to-[#670D2F] text-white font-medium shadow-md hover:shadow-red-400/30 hover:scale-105 transition-all duration-300"
>
  Reset
</button>
        </div>

        {/* Lap List */}
        <div className="max-h-40 overflow-y-auto space-y-2 scrollbar-hide">
          {laps.map((lap, index) => {
  const isFastest = lap === fastestLap;
  const isSlowest = lap === slowestLap;

  return (
    <div
      key={index}
      className="flex justify-between px-4 py-2 rounded-lg border border-white/20"
    >
      <span
        className={`${
          isFastest
            ? "text-green-400 font-semibold"
            : isSlowest
            ? "text-red-400 font-semibold"
            : isDark ? "text-white" : "text-black"
             
        }`}
      >
        Lap {index + 1} {isFastest && "⚡"} {isSlowest && "🐢"}
      </span>

      <span
        className={`${
          isFastest
            ? "text-green-400"
            : isSlowest
            ? "text-red-400"
            : isDark ? "text-white" : "text-black"
        }`}
      >
        {formatTime(lap)}
      </span>
    </div>
  );
})}   
    <div ref={lapEndRef} />
 </div>

      </div>
    </div>
  );
};

export default Stopwatch;