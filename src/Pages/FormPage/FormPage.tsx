
import React, { useState, useRef, useEffect, StrictMode, ChangeEvent } from "react";
import "./FormPage.css";
import Carousel from "../../Components/Carousel/Carousel";
import { useLocation } from "react-router-dom";
import ProgressBar from '../../Components/ProgressBar/ProgressBar';
import SectionComponent from "../../Components/Section/Section.tsx";
import Section from "../../Model/Section-Model.tsx";
import Input from "../../Model/Input-Model.tsx";
                 
class dataObject {      
  sections: Section[];      
  constructor(sections: Section[]) {      
    this.sections = sections;      
  }      
  public push_section(newSections: Section) {      
    this.sections.push(newSections);      
  }      
  public remove_sections(toRemove: Section) {      
    this.sections = this.sections.filter((cur) => cur !== toRemove);      
  }      
  public copy() {      
    return new dataObject(this.sections);      
  }      
}      


const FormPage = () => {
  // @ts-expect-error : setForm is going to be used when linked to db
  // eslint-disable-next-line
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

  const location = useLocation();
  const files: File[] = location.state.data;
  const [uploadStarted, startUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  // @ts-expect-error : has to be used to prompt user when error
  // eslint-disable-next-line
  const [fetchError, setError] = useState<Error | null>(null);
  const [urls, setUrls] = useState<
    {
      url: string;
      title: string;
    }[]
  >([]);

  const [data, setData] = useState<dataObject>(
    new dataObject([
      new Section("Company information", "company", [
        new Input("name", form.company_name),
        new Input("address", form.company_address),
        new Input("website", form.company_website),
        new Input("phone_number", form.company_phone_number),
      ]),
      new Section("Manufacturer information", "manufacturer", [
        new Input("name", form.manufacturer_name),
        new Input("address", form.manufacturer_address),
        new Input("website", form.manufacturer_website),
        new Input("phone_number", form.manufacturer_phone_number),
      ]),
      new Section("Fertiliser information", "fertiliser", [
        new Input("name", form.fertiliser_name),
        new Input("registration_number", form.fertiliser_registration_number),
        new Input("lot_number", form.fertiliser_lot_number),
        new Input("npk", form.fertiliser_npk),
        new Input("precautionary_fr", form.fertiliser_precautionary_fr),
        new Input("precautionary_en", form.fertiliser_precautionary_en),
        new Input("instructions_fr", form.fertiliser_instructions_fr),
        new Input("instructions_en", form.fertiliser_instructions_en),
        new Input("ingredients_fr", form.fertiliser_ingredients_fr),
        new Input("ingredients_en", form.fertiliser_ingredients_en),
        new Input("specifications_fr", form.fertiliser_specifications_fr),
        new Input("specifications_en", form.fertiliser_specifications_en),
        new Input("cautions_fr", form.fertiliser_cautions_fr),
        new Input("cautions_en", form.fertiliser_cautions_en),
        new Input("recommendation_fr", form.fertiliser_recommendation_fr),
        new Input("recommendation_en", form.fertiliser_recommendation_en),
        new Input("first_aid_fr", form.fertiliser_first_aid_fr),
        new Input("first_aid_en", form.fertiliser_first_aid_en),
        new Input("warranty_fr", form.fertiliser_warranty_fr),
        new Input("warranty_en", form.fertiliser_warranty_en),
        new Input("guaranteed_analysis", form.fertiliser_guaranteed_analysis),
        new Input(
          "nutrient_in_guaranteed_analysis",
          form.nutrient_in_guaranteed_analysis,
        ),
        new Input(
          "percentage_in_guaranteed_analysis",
          form.percentage_in_guaranteed_analysis,
        ),
        new Input("weight", form.fertiliser_weight),
        new Input("density", form.fertiliser_density),
        new Input("volume", form.fertiliser_volume),
        new Input(
          "label_all_other_text_fr",
          form.fertiliser_label_all_other_text_fr,
        ),
        new Input("all_other_text_fr_1", form.all_other_text_fr_1),
        new Input("all_other_text_fr_2", form.all_other_text_fr_2),
        new Input(
          "label_all_other_text_en",
          form.fertiliser_label_all_other_text_en,
        ),
        new Input("all_other_text_en_1", form.all_other_text_en_1),
        new Input("all_other_text_en_2", form.all_other_text_en_2),
      ]),
    ]),
  );

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const modals: {
    label: string;
    ref: React.MutableRefObject<HTMLDivElement | null>;
  }[] = [];

  const textareas: {
    label: string;
    ref: React.MutableRefObject<HTMLTextAreaElement | null>;
  }[] = [];

  data.sections.forEach((sectionInfo) => {
    sectionInfo.inputs.forEach((inputInfo) => {
      // eslint-disable-next-line
      const modal = useRef<HTMLDivElement | null>(null);
      modals.push({
        label: sectionInfo.label + inputInfo.label,
        ref: modal,
      });
      // eslint-disable-next-line
      const textarea = useRef<HTMLTextAreaElement | null>(null);
      textareas.push({
        label: sectionInfo.label + inputInfo.label,
        ref: textarea,
      });
    });
  });

  
   
        //Need to be modified to "approve" but color dont work 
    const handleClick_Modify = (inputInfo: any) => () => {    
      console.log('Approved: ', inputInfo.label);  
      setIsActive(true);      
      inputInfo.state = 'approved';      
      inputInfo.disabled = false;
      inputInfo.approved = true;  
      setData(data.copy());      
      setTimeout(() => setIsActive(false), 400);      
    };  

      //Need to be modified to "modified" but color dont work
    const handleClick_Approve = (inputInfo: any) => () => {   
      console.log('modified: ', inputInfo.label);  
      setIsActive(true);      
      inputInfo.state = 'modified';      
      inputInfo.disabled = true;
      inputInfo.approved = false;  
      setData(data.copy());      
      setTimeout(() => setIsActive(false), 400);      
    };    


  const sectionFactory = (sectionInfo: Section) => {
    return <></>
  };

  const api_url = "http://127.0.0.1:5000";

  const poll_analyze = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    const data = await (
      await fetch(api_url + "/analyze", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers":
            "Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale",
          "Access-Control-Allow-Methods": "GET, POST",
        },
        body: formData,
      })
    ).json();
    return data;
  };

  useEffect(() => {
    const tmpUrls: { url: string; title: string }[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          tmpUrls.push({
            url: e!.target!.result as string,
            title: file.name,
          });
        };
        reader.onloadend = () => setUrls(tmpUrls);
        reader.readAsDataURL(file);
      });

    console.log(process.env);
    if (process.env.REACT_APP_ACTIVATE_USING_JSON == "true") {
      fetch("/answer.json").then((res) =>
        res.json().then((response) => {
          data.sections.forEach((section) => {
            section.inputs.forEach((input) => {
              input.value =
                typeof response[section.label + "_" + input.label] == "string"
                  ? response[section.label + "_" + input.label]
                  : "";
            });
          });
          setData(data.copy());
          setLoading(false);
          console.log("just before update");
          document.querySelectorAll("textarea").forEach((elem) => {
            const nativeTAValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype,
              "value",
            )!.set;
            const event = new Event("change", { bubbles: true });
            nativeTAValueSetter!.call(elem, elem.value + " ");
            elem.dispatchEvent(event);
            nativeTAValueSetter!.call(elem, elem.value.slice(0, -1));
            elem.dispatchEvent(event);
          });
        }),
      );
    } else {
      
      if (!uploadStarted) {
        startUpload(true);
        poll_analyze()
          .then((response) => {
            data.sections.forEach((section) => {
              section.inputs.forEach((input) => {
                input.value =
                  typeof response[section.label + "_" + input.label] ==
                  "string"
                    ? response[section.label + "_" + input.label]
                    : "";
              });
            });
            setData(data.copy());
            setLoading(false);
            console.log("just before update");
            document.querySelectorAll("textarea").forEach((elem) => {
              const nativeTAValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                "value",
              )!.set;
              const event = new Event("change", { bubbles: true });
              nativeTAValueSetter!.call(elem, elem.value + " ");
              elem.dispatchEvent(event);
              nativeTAValueSetter!.call(elem, elem.value.slice(0, -1));
              elem.dispatchEvent(event);
            });
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            console.log(e);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
      
    const handleTextareaSelection = (parent: Section, inputInfo: Input, event: ChangeEvent<HTMLTextAreaElement>) => {  
      inputInfo.value = event.target.value;   
      
      if (!inputInfo.approved) {
        inputInfo.state ="non-modified"
      }
      else if(inputInfo.approved){  
        inputInfo.state = 'approved';  

      } else if(inputInfo.value.length == 0){  //To be modified
        inputInfo.state = 'empty'; 

      }  else {  
        inputInfo.state = 'modified';  
      }
      assessInputState(inputInfo);
      
      setData(data.copy());  
    };  

    //To modify when we add buttons to the form
    const assessInputState = (input: any) => {  
      return input;
  };  
  
const inputStates = data.sections.flatMap((section) =>   
  section.inputs.filter(input=>input.value.length>0).map((input) => ({  
        state: assessInputState(input).state,  
        label: `${section.label}-${input.label}`,
      })
  )
);
/**
 *  
 */
const validateFormInputs = () => {  
  console.log('Validating form inputs... ');
  let allApproved = true;  
  // Itérer à travers chaque section et chaque input pour vérifier et mettre à jour l'état d'approbation  
  data.sections.forEach((section) => {  
    section.inputs.forEach((input) => {  
      if(input.approved){
        input.cssClass = ' '.trim();
      }
      else if (!input.approved) {  
        allApproved = false;  
        input.cssClass = 'input-error'
      }
    });  
  });  
  setData(data.copy()); // Mettre à jour l'état pour refléter les changements  
  return allApproved;  
};    
    

  useEffect(() => {
    textareas.forEach((textareaObj) => {
      if (textareaObj.ref.current) {
        resizeTextarea(textareaObj.ref.current);
      }
    });
  }, [textareas]);


  return (
    <StrictMode>
      <div className="formPage-container">
        <div className="pic-container">
          <Carousel imgs={urls}></Carousel>
        </div>
        <div className="data-container">
          {loading ? (
            <div className={`loader-container-form ${loading ? "active" : ""}`}>
              <div className="spinner"></div>
              <p>
                Votre fichier est en cours d'analyse Your file is being analyzed
              </p>
            </div>
          ) : (
            <div>
              {[...data.sections].map((sectionInfo: Section) => {
                return <SectionComponent sectionInfo={sectionInfo} textareas={textareas} modals={modals} propagateChange={()=>{}}></SectionComponent>
              })}
               <button className='button' onClick={validateFormInputs}>Submit</button>  
            </div>
          )}
        </div>
        {!loading?(
        <div className="progress-wrapper">    
          <ProgressBar sections={inputStates} />    
        </div>
        ):(<></>)}
      </div>
    </StrictMode>
  );
};

export default FormPage;
