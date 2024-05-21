import React, { useState } from "react";
import "./Modal.css"
import closeIcon from "../../assets/close_icon.png";
interface ModalProps{
    text: string;
    handleTextChange: (event: { target: { value: React.SetStateAction<string>;}; })=> void;
    close: ()=>void;
}

const Modal: React.FC<ModalProps>=({text, handleTextChange, close})=>{
    const [isEditing, setIsEditing] = useState(false); // Added state for edit mode

    const handleOverlayTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>)=>{
        text = event.target.value;
        handleTextChange(event);
    };

    const handleOverlayClick = (event: React.MouseEvent<HTMLElement>)=>{
        const element = event!.target as HTMLElement
        console.log(event);
        if(element.className == "overlay"|| element.className == "close-icon"){
            close();
        };
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing); // Toggle edit mode
    };

    return(
        <div className="overlay" onClick={handleOverlayClick}>
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
    )
}

export default Modal;