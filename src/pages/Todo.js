import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  const [user] = useAuthState(auth);

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
    setIsAnimating(true);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsModalOpen(false), 700);
  };

  const closeErrorModal = () => {
    setErrorModal(false);
  };

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
        await updateDoc(todoRef, todoData);
      } else {
        await addDoc(collection(db, "users", user.uid, "todos"), todoData);
      }
      closeModal();
    } else {
      setErrorModal({ isOpen: true, message: "Please fill in all fields." });
    }
  };

  const deleteTodo = async () => {
    if (editIndex !== null && user) {
      const todoRef = doc(db, "users", user.uid, "todos", todos[editIndex].id);
      await deleteDoc(todoRef);
      setTodos((prevTodos) =>
        prevTodos.filter((_, index) => index !== editIndex)
      );
      closeModal();
    }
  };

  const toggleComplete = async (index) => {
    const updatedTodos = [...todos];
    const todo = updatedTodos[index];
    todo.completed = !todo.completed;

    if (user) {
      const todoRef = doc(db, "users", user.uid, "todos", todo.id);
      await updateDoc(todoRef, { completed: todo.completed });
    }

    setTodos(updatedTodos);
  };

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
  useEffect(() => {
    if (user) {
      const todosRef = collection(db, "users", user.uid, "todos");

      const unsubscribe = onSnapshot(
        todosRef,
        (snapshot) => {
          const updatedTodos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodos(updatedTodos);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching todos: ", error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  // useEffect(() => {
  //   const fetchTodos = async () => {
  //     try {
  //       if (user) {
  //         const userTodos = [];
  //         const querySnapshot = await getDocs(
  //           collection(db, "users", user.uid, "todos")
  //         );
  //         querySnapshot.forEach((doc) => {
  //           userTodos.push({ id: doc.id, ...doc.data() });
  //         });
  //         setTodos(userTodos);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchTodos();
  // }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>

      <div className="w-full max-w-2xl mb-6">
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
                  className={`bg-gray-700 p-3 rounded-md shadow-md flex flex-col border-r-8 ${getBorderColor(
                    todo.priority
                  )} cursor-pointer hover:bg-gray-600 transition duration-200`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleComplete(index)}
                      className="appearance-none h-5 w-5 border-2 border-gray-400 rounded-full checked:bg-purple-600 transition duration-200 mr-3 cursor-pointer flex-shrink-0"
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
                      <p className="text-xs text-gray-400 mt-1 ">
                        {startDate} ~ {endDate} /{" "}
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
          <p className="text-center text-gray-400">No todos yet</p>
        )}
      </div>

      <button
        onClick={() => openModal()}
        className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
      >
        + Create
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-700">
          <div
            className={`bg-gray-900 p-6 rounded-lg shadow-lg sm:w-3/4 w-full sm:mx-0 mx-4 text-center transform transition-all duration-700 ${
              isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4">
              {editIndex !== null ? "Edit Todo" : "Add New Todo"}
            </h2>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter Todo"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Low">Low</option>
              <option value="Med">Med</option>
              <option value="High">High</option>
            </select>
            <div className="flex justify-end items-center space-x-2">
              {editIndex !== null && (
                <button
                  onClick={deleteTodo}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-auto "
                >
                  Delete
                </button>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={addOrEditTodo}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {errorModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-red-600 p-6 rounded-lg shadow-lg w-3/4 sm:w-1/2 text-center text-white">
            <h2 className="text-2xl font-semibold mb-4">Error</h2>
            <p>{errorModal.message}</p>
            <button
              onClick={closeErrorModal}
              className="mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
