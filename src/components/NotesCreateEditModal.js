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
    tag,
    setTag,
    closeModal,
    addOrEditNote,
    deleteNote,
}) => {
    if(!isOpen) return null;
    // Formatting for Creating or Editing a note
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
            {/* Note title */}
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter Title"
              className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Note body with toolbar */}
            <ReactQuill
              type="text"
              value={newNote}
              onChange={setNewNote}
              rows="10"
              placeholder="Enter Note"
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  [{ 'align': [] }],
                  ['link'],
                ],
              }}
              className="w-full p-4 mb-4 rounded bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Selecting a tag */}
            <h3 className="text-1xl mb-2">Select a Tag</h3>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Empty"> </option>
              <option value="Tag1">Tag1</option>
              <option value="Tag2">Tag2</option>
              <option value="Tag3">Tag3</option>
              
            </select>

            {/* Deleting a note */}
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
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
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