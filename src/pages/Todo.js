import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import TodoCreateAndEditModal from "../components/TodoCreateAndEditModal";
import ErrorModal from "../components/ErrorModal";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { PlusIcon } from "@heroicons/react/24/outline";

const Todo = () => {
  const [todos, setTodos] = useState([]); // Stores the list of tasks
  const [newTodo, setNewTodo] = useState(""); // Stores the text for a new or edited task
  const [startDate, setStartDate] = useState(""); // Stores the start date of a task
  const [endDate, setEndDate] = useState(""); // Stores the end date of a task
  const [priority, setPriority] = useState("Low"); // Stores the priority of a task
  const [isModalOpen, setIsModalOpen] = useState(false); // Tracks the state of the task modal
  const [isAnimating, setIsAnimating] = useState(false); // Controls animation for the modal
  const [editIndex, setEditIndex] = useState(null); // Tracks the index of the task being edited
  const [loading, setLoading] = useState(true); // Tracks the loading state
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" }); // Tracks the state of the error modal

  const [user] = useAuthState(auth); // Tracks the authenticated user

  /**
   * Opens the modal for creating or editing a task.
   * index - The index of the task to edit (null for creating a new task).
   */
  const openModal = (index = null) => {
    if (index !== null) {
      const todo = todos[index];
      setNewTodo(todo.text);
      setStartDate(todo.start);
      setEndDate(todo.end);
      setPriority(todo.priority);
      setEditIndex(index);
    } else {
      setNewTodo("");
      setStartDate("");
      setEndDate("");
      setPriority("Low");
      setEditIndex(null);
    }
    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 0);
  };

  /**
   * Closes the modal with an animation.
   */
  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsModalOpen(false), 700);
  };

  /**
   * Closes the error modal.
   */
  const closeErrorModal = () => {
    setErrorModal(false);
  };

  /**
   * Adds a new task or updates an existing one in Firestore.
   */
  const addOrEditTodo = async () => {
    if (newTodo.trim() && startDate && endDate && user) {
      if (new Date(startDate) > new Date(endDate)) {
        setErrorModal({
          isOpen: true,
          message: "End time must be after the start time.",
        });
        return;
      }

      const todoData = {
        text: newTodo,
        start: startDate,
        end: endDate,
        priority,
        completed: false,
      };

      if (editIndex !== null) {
        const todoRef = doc(
          db,
          "users",
          user.uid,
          "todos",
          todos[editIndex].id
        );
        await updateDoc(todoRef, todoData); // Update an existing task
      } else {
        await addDoc(collection(db, "users", user.uid, "todos"), todoData); // Add a new task
      }
      closeModal();
    } else {
      setErrorModal({ isOpen: true, message: "Please fill in all fields." });
    }
  };

  /**
   * Deletes a task from Firestore.
   */
  const deleteTodo = async () => {
    if (editIndex !== null && user) {
      const todoRef = doc(db, "users", user.uid, "todos", todos[editIndex].id);
      await deleteDoc(todoRef);
      // setTodos((prevTodos) =>
      //   prevTodos.filter((_, index) => index !== editIndex)
      // );
      closeModal();
    }
  };

  /**
   * Toggles the completion status of a task.
   * index - The index of the task to toggle.
   */
  const toggleComplete = async (index) => {
    const updatedTodos = [...todos];
    const todo = updatedTodos[index];
    todo.completed = !todo.completed;

    if (user) {
      const todoRef = doc(db, "users", user.uid, "todos", todo.id);
      await updateDoc(todoRef, { completed: todo.completed }); // Update the completed status in Firestore
    }

    // setTodos(updatedTodos);
  };

  /**
   * Returns the border color for a task based on its priority.
   * priority - The priority of the task.
   * strings - The corresponding border color class.
   */
  const getBorderColor = (priority) => {
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
  };

  /**
   * Returns the font color for a task based on its priority.
   * priority - The priority of the task.
   * strings - The corresponding font color class.
   */
  const getFontColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500";
      case "Med":
        return "text-blue-500";
      case "Low":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  /**
   * Fetches tasks from Firestore and listens for updates.
   */
  useEffect(() => {
    if (user) {
      const todosRef = collection(db, "users", user.uid, "todos");
      const todosQuery = query(todosRef, orderBy("start")); // order by start time!

      const unsubscribe = onSnapshot(
        todosQuery,
        (snapshot) => {
          const updatedTodos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodos(updatedTodos); // Update the tasks state with the fetched data
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching todos: ", error);
          setLoading(false);
        }
      );

      return () => unsubscribe(); // Cleanup the listener on unmount
    }
  }, [user]);

  // Display a loading spinner while tasks are being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg bg-gray-400 mx-3 mt-5 text-gray-900 px-4 "
      style={{ height: "calc(100vh - 4.5rem)" }}
    >
      {/* <h1 className="text-4xl font-black mt-10 mb-5 text-white">Tasks List</h1> */}

      <div className="w-full max-w-2xl mb-5 h-full overflow-y-auto mt-16">
        {todos.length > 0 ? (
          <ul className="space-y-4">
            {todos.map((todo, index) => {
              const startDate = new Date(todo.start).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              const endDate = new Date(todo.end).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <li
                  key={index}
                  onClick={() => openModal(index)}
                  className={`bg-gray-100 p-3 rounded-md shadow-md flex flex-col border-r-8 ${getBorderColor(
                    todo.priority
                  )} cursor-pointer hover:bg-gray-300 transition duration-200`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleComplete(index)}
                      className="appearance-none h-5 w-5 border-2 border-gray-400 rounded-full checked:bg-orange-400 transition duration-200 mr-3 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex flex-col ml-2 flex-grow">
                      <span
                        className={`${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                        style={{
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                          maxWidth: "100%",
                        }}
                      >
                        {todo.text}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 ">
                        {startDate} ~ {endDate} |{" "}
                        <span
                          className={`font-bold ${getFontColor(
                            todo.priority
                          )} `}
                        >
                          {todo.priority}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center font-bold text-white mt-20">
            No tasks yet!!
          </p>
        )}
      </div>

      <button
        onClick={() => openModal()}
        className="fixed bottom-8 right-8 bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-3 rounded-full shadow-lg transition duration-300"
      >
        <span className="inline md:hidden">
          <PlusIcon className="w-6 h-6" strokeWidth={3} />
        </span>
        <span className="hidden md:inline">+ Create</span>
      </button>
      <TodoCreateAndEditModal
        isOpen={isModalOpen}
        isAnimating={isAnimating}
        editIndex={editIndex}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        priority={priority}
        setPriority={setPriority}
        closeModal={closeModal}
        addOrEditTodo={addOrEditTodo}
        deleteTodo={deleteTodo}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        closeErrorModal={closeErrorModal}
        isError={true}
      />
    </div>
  );
};

export default Todo;
