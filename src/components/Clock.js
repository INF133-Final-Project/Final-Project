import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().format("hh:mm:ss A"));

  useEffect(() => {
    const timer = setInterval(() => {
      
      setCurrentTime(dayjs().format("hh:mm:ss A"));
    }, 1000); // Update every one sec

    return () => clearInterval(timer); // clear timer when unmount
  }, []);

  const [currentDate, setCurrentDate] = useState(dayjs().format("MMMM D, YYYY"));

  useEffect(() => {
    const date = setInterval(() => {
      
      setCurrentDate(dayjs().format("MMMM D, YYYY"));
    }, 1000); // Update every one sec

    return () => clearInterval(date); // clear timer when unmount
  }, []);

  return (
    <div className="text-4xl font-bold text-white">
      <div>{currentTime}</div>
      <div>{currentDate}</div>
    </div>
  );
};

export default Clock;
