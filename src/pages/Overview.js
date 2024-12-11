import React from "react";
import CustomCalendar from "../components/Calendar";
import CustomClock from "../components/Clock";
import CustomWeather from "../components/Weather";

const Overview = ({ isSplit }) => {
  return (
    <div className="flex flex-col justify-start w-full h-screen overflow-auto">
      <div className="hidden md:block">
        {!isSplit ? (
          <div className="mx-6 mt-4 flex-shrink-0">
            <div className="flex justify-between items-center">
              <CustomClock />
              <CustomWeather isSplit={isSplit} />
            </div>
          </div>
        ) : (
          <div className="mx-6 mt-4 space-y-1 flex-shrink-0">
            <div className="flex justify-between items-center">
              <CustomClock />
              <CustomWeather isSplit={isSplit} />
            </div>
          </div>
        )}
      </div>
      <div className="block md:hidden">
        <div className="mx-6 mt-4 space-y-1 flex-shrink-0">
          <div className="flex justify-between items-center">
            <CustomClock />
            <CustomWeather isSplit={isSplit} />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg mx-5 mb-3 mt-1 flex-grow">
        <div>
          <CustomCalendar isSplit={isSplit} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
