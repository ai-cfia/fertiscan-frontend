import React, { useState } from 'react';
import "./Form.css";
import Modal from '../../Components/Modal/Modal';

import openIcon from "../../assets/dot-menu.png";
import editIcon from "../../assets/edit_icon.png";
import saveIcon from "../../assets/save_icon.png";

const TextboxWithOverlay = () => {


  const [form, setForm] = useState({
    Compagny_name: "",
    Compagny_address: "",
    Compagny_website: "",
    Compagny_phone_number: "",
    Manufacturer_name: "",
    Manufacturer_address: "",
    Manufacturer_website: "",
    Manufacturer_phone_number: "",
    Fertiliser_name: "",
    Fertiliser_registration_number: "",
    Fertiliser_lot_number: "",
    Fertiliser_NPK: "",
    Fertiliser_precautionary_FR: "",
    Fertiliser_precautionary_EN: "",
    Fertiliser_instructions_FR: "",
    Fertiliser_instructions_EN: "",
    Fertiliser_ingredients_FR: "",
    Fertiliser_ingredients_EN: "",
    Fertiliser_specifications_FR: "",
    Fertiliser_specifications_EN: "",
    Fertiliser_cautions_FR: "",
    Fertiliser_cautions_EN: "",
    Fertiliser_recommendation_FR: "",
    Fertiliser_recommendation_EN: "",
    Fertiliser_first_aid_FR: "",
    Fertiliser_first_aid_EN: "",
    Fertiliser_warranty_FR: "",
    Fertiliser_warranty_EN: "",
    Fertiliser_danger_FR: "",
    Fertiliser_danger_EN: "",
    Fertiliser_guaranteed_analysis: "",
    Nutrient_in_guaranteed_analysis: "",
    Percentage_in_guaranteed_analysis: "",
    Fertiliser_weight: "",
    Fertiliser_density: "",
    Fertiliser_volume: "",
    Fertiliser_label_all_other_text_FR: "",
    all_other_text_FR_1: "",
    all_other_text_FR_2: "",
    Fertiliser_label_all_other_text_EN: "",
    all_other_text_EN_1: "",
    all_other_text_EN_2: "",
  });

  /** 
  const handleOverlayClick = () => {
    setShowOverlay(false);
  };
  // Update the text state directly when editing in the overlay
  const handleOverlayTextChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setText(event.target.value);
  };
  */
  return (
    <div className='data-container'>
      {/* ----------     Company section     ---------- */}
      <div className='company-container data-section'>
        <h1 className='title underlined'>Company information</h1>
        <div className='input-container'>
          <label htmlFor='company-name'>Company name :</label>
          <input type='text' 
            className='company-info' id="company-name" 
            value={form.Compagny_name} 
            onChange={(event:React.ChangeEvent<HTMLInputElement>)=>
              form.Compagny_name=event.target.value
            }
          >
          </input>
        </div>
        <div className='input-container'>
          <label htmlFor='company-address'>Company address :</label>
          <input type='text' className='company-info' id="company-address" value={form.Compagny_address}></input>
        </div>
        <div className='input-container'>
          <label htmlFor='company-website'>Company website :</label>
          <input type='text' className='company-info' id="company-website" value={form.Compagny_website}></input>
        </div>
        <div className='input-container'>
          <label htmlFor='company-phone'>Company phone number :</label>
          <input type='text' className='company-info' id="company-phone" value={form.Compagny_phone_number}></input>
        </div>
      </div>

      {/* ----------     Manufacturer section     ---------- */}
      <div className='manufacturer-container data-section'>
        <h1 className='title underlined'>Manufacturer information</h1>
        <div className='input-container'>
          <label htmlFor='manufacturer-name'>Manufacturer name :</label>
          <input type='text' className='manufacturer-info' id="manufacturer-name" value={form.Manufacturer_name}></input>
        </div>
        <div className='input-container'>
          <label htmlFor='manufacturer-address'>Manufacturer address :</label>
          <input type='text' className='manufacturer-info' id="manufacturer-address" value={form.Manufacturer_address}></input>
        </div>
        <div className='input-container'>
          <label htmlFor='manufacturer-website'>Manufacturer website :</label>
          <input type='text' className='manufacturer-info' id="manufacturer-website" value={form.Manufacturer_website}></input>
        </div>
        <div className='input-container'>
          <label htmlFor='manufacturer-phone'>Manufacturer phone number :</label>
          <input type='text' className='manufacturer-info' id="manufacturer-phone" value={form.Manufacturer_phone_number}></input>
        </div>
      </div>
      {/* ----------     Fertiliser section     ---------- */}
      <div className='Fertiliser-container data-section'>
        <h1 className='title underlined'>Fertiliser information</h1>
        <div className='input-container'>
          <label htmlFor='fertiliser-name'>Fertiliser name :</label>
          <input type='text' className='fertiliser-info' id="fertiliser-name" value={form.Fertiliser_name}></input>
        </div>
        <div className='input-container'>
          <label htmlFor='fertiliser-registr_num'>Fertiliser registration number :</label>
          <input type='text' className='fertiliser-info' id="fertiliser-registr_num" value={form.Fertiliser_registration_number}></input>
        </div>
        <div className='input-container'>
          <label htmlFor='fertiliser-lot_number'>Fertiliser lot number :</label>
          <input type='text' className='fertiliser-info' id="fertiliser-lot_number" value={form.Fertiliser_lot_number}></input>
        </div>
        <div className='input-container'>
          <label htmlFor='fertiliser-NPK'>Fertiliser NPK :</label>
          <input type='text' className='fertiliser-info' id="fertiliser-NPK" value={form.Fertiliser_NPK}></input>
        </div>
        <div className='input-container'>
          <label htmlFor='fertiliser-precau_FR'>Fertiliser precautionary FR :</label>
          {/**
          <div className="textbox-container">
            <textarea
              value={text}
              onChange={handleTextChange}
              className='text-box'
            />
            {isTextTooLong && (
              <img
                src={openIcon}
                alt="Ouvrir l'overlay"
                className="open-icon"
                onClick={() => setShowOverlay(true)}
              />
            )}

            {showOverlay && (
              <Modal text={text} handleTextChange={handleOverlayTextChange} close={handleOverlayClick} />
            )}
          </div>
           */}
        </div>
      </div>


      
    </div>
    
  );
};

export default TextboxWithOverlay;
