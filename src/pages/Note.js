import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
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
import { Input } from "postcss";
import { BsSearch } from "react-icons/bs";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [lastEdited, setLastEdited] = useState("");
  const [tag, setTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  const [user] = useAuthState(auth);

  const openModal = (index = null) => {
    // Opening a previously existing note
    if (index !== null) {
      const note = notes[index];
      setNewTitle(note.title);
      setNewNote(note.text || "");
      setLastEdited(note.edit || Date.now());
      setTag(note.tag);
      setEditIndex(index);
    }

    // Creating a new note
    else {
      setNewTitle("");
      setNewNote("");
      setLastEdited(Date.now());
      setTag("");
      setEditIndex(null);
    }
    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 0);
  };

  // closing the right side of the page
  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsModalOpen(false), 700);
  };
  // closing the error modal
  const closeErrorModal = () => {
    setErrorModal(false);
  };

  // creating or editing an existing note
  const addOrEditNote = async () => {
    // if the user has filled in all fields
    if (newTitle.trim() && newNote.trim() && lastEdited && user) {
      // grab the time the user pressed "Confirm"
      const currentStamp = Date.now();
      //update the title, text, last edited, and tag information
      const noteData = {
        title: newTitle,
        text: newNote,
        edit: currentStamp,
        tag,
      };

      if (editIndex !== null) {
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
      setErrorModal({ isOpen: true, message: "Please fill in all fields." });
    }
  };

  // deleting a note
  const deleteNote = async () => {
    if (editIndex !== null && user) {
      const noteRef = doc(db, "users", user.uid, "notes", notes[editIndex].id);
      await deleteDoc(noteRef);

      closeModal();
    }
  };

  // function that filters through the notes by title
  function handleSearch() {
    if (searchQuery === "") {
      setFilteredNotes(notes);
    } else {
      const filterBySearch = notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filterBySearch);
    }
  }

  // sets the border of the note to the color of the tag
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

  // sets the tag to the color corresponding to it
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
      <h1 className="text-4xl font-black mt-10 mb-5 text-white"></h1>
      <div className="w-full max-w-2xl mb-5 h-auto y-auto">
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes"
            style={{ flex: 1, marginRight: "8px" }}
          ></input>
          <BsSearch
            onClick={handleSearch}
            style={{ cursor: "pointer", marginRight: "8px" }}
          />
        </div>
        <div>
          {filteredNotes.map((note) => {
            const originalIndex = notes.findIndex((n) => n.id === note.id);
            const newDate = new Date(note.edit).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <li
                key={note.id}
                onClick={() => openModal(originalIndex)}
                className={`w-full max-w-2xl mb-5 bg-gray-100 p-3 rounded-md shadow-md flex flex-col border-r-8 ${getBorderColor(
                  note.tag
                )} cursor-pointer hover:bg-gray-300 transition duration-200`}
              >
                <div className="flex items-center">
                  <div className="flex flex-col ml-2 flex-grow">
                    <span style={{ fontWeight: "bold" }}>{note.title}</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(note.text),
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {newDate} |{" "}
                      <span className={`font-bold ${getFontColor(note.tag)}`}>
                        {note.tag}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-2xl mb-5 h-full overflow-y-auto">
        {notes.length > 0 ? (
          <ul className="space-y-4">
            {notes.map((note, index) => {
              const lastEdited = new Date(note.edit).toLocaleString("en-US", {
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
                    note.tag
                  )} cursor-pointer hover:bg-gray-300 transition duration-200`}
                >
                  <div className="flex items-center">
                    <div className="flex flex-col ml-2 flex-grow">
                      <span style={{ fontWeight: "bold" }}>{note.title}</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(note.text),
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1 ">
                        {lastEdited} |{" "}
                        <span
                          className={`font-bold ${getFontColor(note.tag)} `}
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
        className="fixed bottom-8 right-8 bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-full shadow-lg transition duration-300"
      >
        <span className="inline sm:hidden">
          <PlusIcon className="w-6 h-6" strokeWidth={3} />
        </span>
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
