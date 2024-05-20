import { useState, ChangeEvent } from "react";
import "./HomePage.css";
import DragDropFileInput from "../../Components/DragDropFileInput/DragDropFileInput";

function HomePage() {
    const [hasPhoto, setHasPhoto] = useState(false);
    const [form, setForm] = useState({
      Compagny_name: '',
      Compagny_address: '',
      Compagny_website: '',
      Compagny_phone_number: '',
      Manufacturer_name: '',
      Manufacturer_address: '',
      Manufacturer_website: '',
      Manufacturer_phone_number: '',
      Fertiliser_name: '',
      Fertiliser_registration_number: '',
      Fertiliser_lot_number: '',
      Fertiliser_NPK: '',
      Fertiliser_precautionary_FR: '',
      Fertiliser_precautionary_EN: '',
      Fertiliser_instructions_FR: '',
      Fertiliser_instructions_EN: '',
      Fertiliser_ingredients_FR: '',
      Fertiliser_ingredients_EN: '',
      Fertiliser_specifications_FR: '',
      Fertiliser_specifications_EN: '',
      Fertiliser_cautions_FR: '',
      Fertiliser_cautions_EN: '',
      Fertiliser_recommendation_FR: '',
      Fertiliser_recommendation_EN: '',
      Fertiliser_first_aid_FR: '',
      Fertiliser_first_aid_EN: '',
      Fertiliser_warranty_FR: '',
      Fertiliser_warranty_EN: '',
      Fertiliser_danger_FR: '',
      Fertiliser_danger_EN: '',
      Fertiliser_guaranteed_analysis: '',
      Nutrient_in_guaranteed_analysis: '',
      Percentage_in_guaranteed_analysis: '',
      Fertiliser_weight: '',
      Fertiliser_density: '',
      Fertiliser_volume: '',
      Fertiliser_label_all_other_text_FR: '',
      all_other_text_FR_1: '',
      all_other_text_FR_2: '',
      Fertiliser_label_all_other_text_EN: '',
      all_other_text_EN_1: '',
      all_other_text_EN_2: '',
    });
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const field = e.target! as HTMLInputElement;
      setForm({ ...form, [field.name]: field.value });
    };
  
    const handlePhotoChange = (files: FileList) => {
      if (files!.length > 0) {
        setHasPhoto(true);
      } else {
        setHasPhoto(false);
      }
    };
  
    return (
      <div className="App">
        <div className="container">
          <h3 className="title">Attach a document</h3>

          <DragDropFileInput sendChange={handlePhotoChange}/>
          <button type="submit" className="cancel-button">
              Cancel
          </button>
        </div>
      </div>
    );
}

export default HomePage;
