import React from "react";
import CustomCalendar from "../components/Calendar";
import CustomClock from "../components/Clock";
import CustomWeather from "../components/Weather";

/**
 * Overview.js - This component serves as the main overview page for the application.
 *
 * Features:
 * - Integrates and displays key widgets: CustomClock, CustomWeather, and CustomCalendar.
 * - Adapts the layout for desktop and mobile views using responsive design principles.
 * - Provides a split-view toggle for a customizable user experience.
 * - Customizes the layout of the widgets dynamically based on the `isSplit` prop.
 * - Ensures accessibility and optimized rendering for both small and large screens.
 */
const Overview = ({ isSplit }) => {
  return (
    <div className="flex flex-col justify-start w-full h-screen overflow-auto">
      {/* Desktop View */}
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

      {/* Mobile View */}
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
