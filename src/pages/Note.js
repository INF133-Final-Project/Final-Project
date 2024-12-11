import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import { db, auth } from "../firebaseConfig";
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
import NotesCreateEditModal from "../components/NotesCreateEditModal";


const Note = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [lastEdited, setLastEdited] = useState("");
  const [tag, setTag] = useState("Tag1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  const [user] = useAuthState(auth);
  
  const openModal = (index = null) => {
    if (index !== null) {
      const note = notes[index];
      setNewTitle(note.title);
      setNewNote(note.noteText);
      setLastEdited(note.edit);
      setTag(note.tag);
      setEditIndex(index);
    } else {
      setNewTitle("");
      setNewNote("");
      setLastEdited("");
      setTag("");
      setEditIndex(null);
    }
    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 0);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsModalOpen(false), 700);
  };

  const closeErrorModal = () => {
    setErrorModal(false);
  };

  const addOrEditNote = async () => {
    if(newTitle.trim() && newNote.trim() && lastEdited && user) {
      const currentStamp = Date.now();

      const noteData = {
        title: newTitle,
        text: newNote,
        edit: currentStamp,
        tag,
      };

      if(editIndex !== null) {
        const noteRef = doc(
          db,
          "users",
          user.uid,
          "notes",
          notes[editIndex].id
        );
        await updateDoc(noteRef, noteData);
      } else {
        await addDoc(collection(db, "users", user.uid, "notes"), noteData);
      }
      closeModal();
      
    } else {
      setErrorModal({ isOpen: true, message: "Please fill in all fields."});
    }
  };

  const deleteNote = async () => {
    if (editIndex !== null && user) {
      const noteRef = doc(db, "users", user.uid, "notes", notes[editIndex].id);
      await deleteDoc(noteRef);

      closeModal();
    }
  };

  const getBorderColor = (tag) => {
    switch (tag) {
      case "Tag1":
        return "border-red-500";
      case "Tag2":
        return "border-blue-500";
      case "Tag3":
        return "border-yellow-500";
      default:
        return "border-gray-500";
    }
  };

  const getFontColor = (tag) => {
    switch (tag) {
      case "Tag1":
        return "text-red-500";
      case "Tag2":
        return "text-blue-500";
      case "Tag3":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    if (user) {
      const notesRef = collection(db, "users", user.uid, "notes");
      const notesQuery = query(notesRef, orderBy("edit", "desc")); // order by last edited

      const unsubscribe = onSnapshot(
        notesQuery,
        (snapshot) => {
          const updatedNotes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotes(updatedNotes);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching notes: ", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

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
      <h1 className="text-4xl font-black mt-10 mb-5 text-white">Notes List</h1>

      <div className="w-full max-w-2xl mb-5 h-full overflow-y-auto">
        {notes.length > 0 ? (
          <ul className="space-y-4">
            {notes.map((note, index) => {
              const lastEdited = new Date(note.edit).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <li
                key={index}
                onClick={() => openModal(index)}
                className={`bg-gray-100 p-3 rounded-md shadow-md flex flex-col border-r-8 ${getBorderColor(
                  note.tag
                )} cursor-pointer hover:bg-gray-300 transition duration-200`}
                >
                <div className="flex items-center">
                    <div className="flex flex-col ml-2 flex-grow">
                      <span style={{fontWeight: 'bold'}}>
                        {note.title}
                      </span>
                      <span>
                        {note.text}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 ">
                        {lastEdited}/{" "}
                        <span
                          className={`font-bold ${getFontColor(
                            note.tag
                          )} `}
                        >
                          {note.tag}
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
            No notes yet!!
          </p>
        )}

      </div>

      <button
        onClick={() => openModal()}
        className="fixed bottom-8 right-8 bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-5 rounded-full shadow-lg transition duration-300"
      >
        <span className="inline sm:hidden">+</span>
        <span className="hidden sm:inline">+ Create</span>
      </button>

      <NotesCreateEditModal
        isOpen={isModalOpen}
        isAnimating={isAnimating}
        editIndex={editIndex}
        newNote={newNote}
        setNewNote={setNewNote}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        lastEdited={lastEdited}
        setLastEdited={setLastEdited}
        tag={tag}
        setTag={setTag}
        closeModal={closeModal}
        addOrEditNote={addOrEditNote}
        deleteNote={deleteNote}
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

export default Note;