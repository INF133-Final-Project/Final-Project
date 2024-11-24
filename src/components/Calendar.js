import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate }) => {
  return (
    <div className="flex justify-between items-center bg-gray-100 px-1 py-2 rounded-md">
      <button
        className="bg-orange-400 text-white text-xs px-2 py-1 rounded hover:bg-orange-500 transition duration-200"
        onClick={() => onNavigate("PREV")}
      >
        Back
      </button>

      <span className="font-bold text-orange-800 text-2xl">{label}</span>

      <button
        className="bg-orange-400 text-white text-xs px-2 py-1 rounded hover:bg-orange-500 transition duration-200"
        onClick={() => onNavigate("NEXT")}
      >
        Next
      </button>
    </div>
  );
};

const eventStyleGetter = (event) => {
  let backgroundColor;

  // Set background color based on priority
  switch (event.priority) {
    case "High":
      backgroundColor = event.completed ? "#d1d1d1" : "#f87171"; // Gray if completed
      break;
    case "Med":
      backgroundColor = event.completed ? "#d1d1d1" : "#60a5fa";
      break;
    case "Low":
      backgroundColor = event.completed ? "#d1d1d1" : "#fde047";
      break;
    default:
      backgroundColor = event.completed ? "#d1d1d1" : "#d1d5db";
  }

  return {
    style: {
      backgroundColor,
      textDecoration: event.completed ? "line-through" : "none", // Strikethrough if completed
      color: "#111827", // Text color
    },
  };
};

const CustomCalendar = ({ isSplit }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Save the clicked event information
    setIsEventModalOpen(true); // Open modal
  };

  const getBorderColor = (priority, completed) => {
    if (!completed) {
      switch (priority) {
        case "High":
          return "border-red-500";
        case "Med":
          return "border-blue-500";
        case "Low":
          return "border-yellow-500";
        default:
          return "border-gray-500";
      }
    } else {
      return "border-gray-400";
    }
  };

  useEffect(() => {
    if (isEventModalOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    }
  }, [isEventModalOpen]);

  useEffect(() => {
    if (user) {
      const eventsRef = collection(db, "users", user.uid, "todos");
      const eventsQuery = query(eventsRef);

      const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
        const firebaseEvents = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.text, // Title to display on the calendar
            start: new Date(data.start), // Start date and time
            end: new Date(data.end), // End date and time
            priority: data.priority, // Add priority
            completed: data.completed, // Add completion status
            allDay: false, // Set false if not an all-day event
          };
        });
        setEvents(firebaseEvents);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <>
      <div className="p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "70vh", margin: "10px" }}
          defaultView={isSplit ? "day" : "month"}
          views={["month", "week", "day"]}
          selectable
          popup
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
          components={{
            toolbar: CustomToolbar, // Apply custom toolbar
          }}
        />
      </div>
      {isEventModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-gray-300 p-6 rounded-lg shadow-lg w-3/4 sm:w-1/2 text-center border-t-8 border-b-8 transform transition-all duration-700 ${
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            } ${getBorderColor(
              selectedEvent.priority,
              selectedEvent.completed
            )}`}
          >
            <h2 className="text-2xl font-semibold mb-4">
              {selectedEvent.title}
            </h2>
            <p>
              <strong>Start:</strong>{" "}
              {new Date(selectedEvent.start).toLocaleString()}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {new Date(selectedEvent.end).toLocaleString()}
            </p>
            <p>
              <strong>Priority:</strong> {selectedEvent.priority}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedEvent.completed ? "Completed" : "Not Completed"}
            </p>
            <button
              onClick={() => {
                setIsAnimating(false);
                setTimeout(() => setIsEventModalOpen(false), 700);
              }}
              className="mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomCalendar;
