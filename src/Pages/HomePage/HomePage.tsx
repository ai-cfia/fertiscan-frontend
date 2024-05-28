import React, { useState, ChangeEvent } from "react";
import "./HomePage.css";
import DragDropFileInput from "../../Components/DragDropFileInput/DragDropFileInput";
import FileList from "../../Components/FileList/FileList";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [files, setFiles] = useState<File[]>([]);

const [form, setForm] = useState({
  company_name: "",
  company_address: "",
  company_website: "",
  company_phone_number: "",
  manufacturer_name: "",
  manufacturer_address: "",
  manufacturer_website: "",
  manufacturer_phone_number: "",
  fertiliser_name: "",
  fertiliser_registration_number: "",
  fertiliser_lot_number: "",
  fertiliser_npk: "",
  fertiliser_precautionary_fr: "",
  fertiliser_precautionary_en: "",
  fertiliser_instructions_fr: "",
  fertiliser_instructions_en: "",
  fertiliser_ingredients_fr: "",
  fertiliser_ingredients_en: "",
  fertiliser_specifications_fr: "",
  fertiliser_specifications_en: "",
  fertiliser_cautions_fr: "",
  fertiliser_cautions_en: "",
  fertiliser_recommendation_fr: "",
  fertiliser_recommendation_en: "",
  fertiliser_first_aid_fr: "",
  fertiliser_first_aid_en: "",
  fertiliser_warranty_fr: "",
  fertiliser_warranty_en: "",
  fertiliser_danger_fr: "",
  fertiliser_danger_en: "",
  fertiliser_guaranteed_analysis: "",
  nutrient_in_guaranteed_analysis: "",
  percentage_in_guaranteed_analysis: "",
  fertiliser_weight: "",
  fertiliser_density: "",
  fertiliser_volume: "",
  fertiliser_label_all_other_text_fr: "",
  all_other_text_fr_1: "",
  all_other_text_fr_2: "",
  fertiliser_label_all_other_text_en: "",
  all_other_text_en_1: "",
  all_other_text_en_2: "",
  });


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const field = e.target! as HTMLInputElement;
    setForm({ ...form, [field.name]: field.value });
  };

  const handlePhotoChange = (newFiles: File[]) => {
    if (newFiles!.length > 0) {
      setFiles([...files, ...newFiles]);
    }
  };

  const navigate = useNavigate();
  const Submit = ()=>{
    navigate('/Json',{state:{data:files}})
  }

  return (
    <div className="App">
      <div className="container">
        <DragDropFileInput sendChange={handlePhotoChange} />
        {/*<FileList files={files} />*/}
      </div>
      <button className="submit-btn" type="submit" onClick={Submit}>Submit</button>
    </div>
  );
}

export default HomePage;
