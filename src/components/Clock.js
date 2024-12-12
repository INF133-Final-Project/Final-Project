import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const Clock = () => {
  // State to store the current time, formatted as hh:mm:ss A
  const [currentTime, setCurrentTime] = useState(dayjs().format("hh:mm:ss A"));

  // Effect hook to update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      // Update the current time state every second
      setCurrentTime(dayjs().format("h:mm:ss A"));
    }, 1000); // Update every one second

    return () => clearInterval(timer); // Clear the timer when the component unmounts
  }, []);

  // State to store the current date, formatted as "Month Day, Year"
  const [currentDate, setCurrentDate] = useState(
    dayjs().format("MMMM D, YYYY")
  );

  // Effect hook to update the date every second (though this can be optimized)
  useEffect(() => {
    const date = setInterval(() => {
      // Update the current date state every second
      setCurrentDate(dayjs().format("MMMM D, YYYY"));
    }, 1000); // Update every one second

    return () => clearInterval(date); // Clear the timer when the component unmounts
  }, []);

  return (
    <div className="font-bold text-white">
      {/* Display the current date */}
      <div className="text-xl">{currentDate}</div>
      {/* Display the current time */}
      <div className="text-4xl">{currentTime}</div>
    </div>
  );
};

export default Clock;
