import React from "react";
import CustomCalendar from "../components/Calendar";
import CustomClock from "../components/Clock";
import CustomWeather from "../components/Weather";

const Overview = ({ isSplit }) => {
  return (
    <div className="flex flex-col justify-center w-full h-screen overflow-auto">
      <div className="mx-6">
        <CustomClock />
        <CustomWeather />
      </div>

      <div className="bg-gray-100 rounded-lg mx-5 my-3">
        <div>
          <CustomCalendar isSplit={isSplit} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
