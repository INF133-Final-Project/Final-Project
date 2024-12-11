import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NotesCreateEditModal = ({
    isOpen,
    isAnimating,
    editIndex,
    newNote,
    setNewNote,
    newTitle,
    setNewTitle,
    lastEdited,
    setLastEdited,
    tag,
    setTag,
    closeModal,
    addOrEditNote,
    deleteNote,
}) => {
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-700">
          <div
            className={`bg-gray-300 p-6 rounded-lg shadow-lg sm:w-1/2 w-3/4 max-w-2xl sm:mx-0 mx-4 text-center transform transition-all duration-700 ${
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4">
              {editIndex !== null ? "Edit Note" : "Add New Note"}
            </h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter Title"
              className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <ReactQuill
              value={newNote}
              onChange={setNewNote}
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  [{ 'align': [] }],
                  ['link'],
                ],
              }}
              className="mb-4"
            />
            
            <textarea
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows = "10"
              placeholder="Enter Note"
              className="w-full p-4 mb-4 rounded bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"

            />
            
            <input
              type="datetime-local"
              value={lastEdited}
              onChange={(e) => setLastEdited(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >


              <option value="Tag1">Tag1</option>
              <option value="Tag2">Tag2</option>
              <option value="Tag3">Tag3</option>
            </select>
            <div className="flex justify-end items-center space-x-2">
              {editIndex !== null && (
                <button
                  onClick={deleteNote}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-auto"
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
                  onClick={addOrEditNote}
                  className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div> 
    );
};

export default NotesCreateEditModal;