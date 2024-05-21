import React, { useState } from 'react';
import "./Form.css";
import closeIcon from "./assets/close_icon.png";
import openIcon from "./assets/dot-menu.png";
import editIcon from "./assets/edit_icon.png";
import saveIcon from "./assets/save_icon.png";

const TextboxWithOverlay = () => {
  const [text, setText] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Added state for edit mode

  const handleTextChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setText(event.target.value);
  };

  const handleOverlayClick = () => {
    setShowOverlay(false);
  };

  const isTextTooLong = text.length > 100;

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  // Update the text state directly when editing in the overlay
  const handleOverlayTextChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setText(event.target.value);
  };

  return (
    <div className="textbox-container">
      <textarea
        value={text}
        onChange={handleTextChange}
        style={{ width: '300px', height: '100px', resize: 'none' }}
      />
      {isTextTooLong && (
        <img
          src={openIcon}
          alt="Ouvrir l'overlay"
          className="open-icon"
          style={{ position: 'absolute', bottom: '10px', right: '10px' }} // Positioned bottom right
          onClick={() => setShowOverlay(true)}
        />
      )}

      {showOverlay && (
        <div className="overlay">
          <div className="card">
            <img src={closeIcon} alt="Fermer la carte" className="close-icon" onClick={handleOverlayClick} />
            <div className="card-content">
              {isEditing ? (
                <textarea
                  value={text} // Use the current text state value
                  onChange={handleOverlayTextChange} // Update text state here
                  style={{ width: '100%', height: '300px' }}
                />
              ) : (
                <p>{text}</p>
              )}
            </div>
            <div className="card-footer">
              <button onClick={handleEditClick}>
                {isEditing ? 'Enregistrer' : 'Modifier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextboxWithOverlay;
