import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000); // Update every one sec

    return () => clearInterval(timer); // clear timer when unmount
  }, []);
  return <div className="text-4xl font-bold text-white">{currentTime}</div>;
};

export default Clock;
