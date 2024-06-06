import React, { useState, useRef, ChangeEvent } from 'react';      
import './FormPage.css';      
import Modal from '../../Components/Modal/Modal';      
import openIcon from '../../assets/dot-menu.svg';      
import Carousel from '../../Components/Carousel/Carousel';      
import ProgressBar from '../../Components/ProgressBar/ProgressBar';   
import editIcon from "../../assets/edit1.svg";
import acceptIcon from "../../assets/acceptIcon.svg";
  
class dataObject {      
  sections: section[];      
  constructor(sections: section[]) {      
    this.sections = sections;      
  }      
  public push_section(newSections: section) {      
    this.sections.push(newSections);      
  }      
  public remove_sections(toRemove: section) {      
    this.sections = this.sections.filter((cur) => cur !== toRemove);      
  }      
  public copy() {      
    return new dataObject(this.sections);      
  }      
}      
class section {      
  title: string;      
  label: string;      
  inputs: input[];     
  constructor(title: string, label: string, inputs: input[]) {      
    this.title = title;      
    this.label = label;      
    this.inputs = inputs;    
  }      
  public push_input(newInput: input) {      
    this.inputs.push(newInput);      
  }      
  public remove_input(toRemove: input) {      
    this.inputs = this.inputs.filter((cur) => cur !== toRemove);      
  }      
}      
class input {
  [x: string]: string | boolean;        
  type: string;        
  label: string;        
  value: string;     
  approved: boolean = false;
  state: string;      
  disable:boolean = false; 
  cssClass: string = '';
  constructor(type: string, label: string, value: string,  state: string = 'empty', approved = false, disable = true) {        
    this.type = type;       
    this.label = label;        
    this.value = value;        
    this.state = state;
    this.approved = approved;
    this.disable = disable;
  }        
}    
  
const FormPage = () => {      
  const [form, setForm] = useState({      
    company_name: 'a',      
    company_address: '',      
    company_website: '',      
    company_phone_number: '',      
    manufacturer_name: '',      
    manufacturer_address: '',      
    manufacturer_website: '',      
    manufacturer_phone_number: '',      
    fertiliser_name: '',      
    fertiliser_registration_number: '',      
    fertiliser_lot_number: '',      
    fertiliser_npk: '',      
    fertiliser_precautionary_fr: 'a',      
    fertiliser_precautionary_en: '',      
    fertiliser_instructions_fr: '',      
    fertiliser_instructions_en: '',      
    fertiliser_ingredients_fr: '',      
    fertiliser_ingredients_en: '',      
    fertiliser_specifications_fr: '',      
    fertiliser_specifications_en: '',      
    fertiliser_cautions_fr: '',      
    fertiliser_cautions_en: '',      
    fertiliser_recommendation_fr: '',      
    fertiliser_recommendation_en: '',      
    fertiliser_first_aid_fr: '',      
    fertiliser_first_aid_en: '',      
    fertiliser_warranty_fr: '',      
    fertiliser_warranty_en: '',      
    fertiliser_danger_fr: '',      
    fertiliser_danger_en: '',      
    fertiliser_guaranteed_analysis: '',      
    nutrient_in_guaranteed_analysis: '',      
    percentage_in_guaranteed_analysis: '',      
    fertiliser_weight: '',      
    fertiliser_density: '',      
    fertiliser_volume: '',      
    fertiliser_label_all_other_text_fr: '',      
    all_other_text_fr_1: '',      
    all_other_text_fr_2: '',      
    fertiliser_label_all_other_text_en: '',      
    all_other_text_en_1: '',      
    all_other_text_en_2: '',      
  });      
  
  const [data, setData] = useState(new dataObject([      
    new section('Company information', 'company', [      
      new input('input', 'name', form.company_name),      
      new input('input', 'address', form.company_address),      
      new input('input', 'website', form.company_website),  
      new input('input', 'phone number', form.company_phone_number),  
    ]),  
    new section('Manufacturer information', 'manufacturer', [  
      new input('input', 'name', form.manufacturer_name),  
      new input('input', 'address', form.manufacturer_address),  
      new input('input', 'website', form.manufacturer_website),  
      new input('input', 'phone number', form.manufacturer_phone_number),  
    ]),  
    new section('Fertilizer information', 'fertilizer', [  
      new input('textarea', 'precautionary fr', form.fertiliser_precautionary_fr),  
      new input('textarea', 'precautionary en', form.fertiliser_precautionary_en),  
    ]),  
  ]));  
  
  const modals: { label: string, modal: React.MutableRefObject<HTMLDivElement | null> }[] = [];  
  
  const urls = [  
    {  
      url: 'https://clipground.com/images/square-clipart-image-9.png',  
      title: 'blue',  
    },  
    {  
      url: 'https://th.bing.com/th/id/R.831df2b352f211506b6f5e96fe495e3b?rik=kOhAG2Zaz45WMg&riu=http%3a%2f%2ffc06.deviantart.net%2ffs13%2ff%2f2007%2f040%2fb%2f7%2fPhoto__Large_red_square_by_TheLastDanishPastry.png&ehk=TxXfjnmu6TwpRkPtzi7u1X%2fHbjCBDARquCvl7J1a%2b58%3d&risl=&pid=ImgRaw&r=0',  
      title: 'red',  
    },  
    {  
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Solid_green.svg',  
      title: 'green',  
    },  
  ];  
  
  data.sections.forEach((sectionInfo) => {  
    sectionInfo.inputs.forEach((inputInfo) => {  
      const modal = useRef<HTMLDivElement | null>(null);  
      modals.push({  
        label: sectionInfo.label + inputInfo.label,  
        modal: modal,  
      });  
    });  
  });  
  const [isActive, setIsActive] = useState(false);

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
  const inputFactory = (parent: section, inputInfo: input) => {  
    return (  
      <div className="input-container" key={parent.label + '-' + inputInfo.label}>  
        <label htmlFor={parent.label + '-' + inputInfo.label}>  
          {parent.label.charAt(0).toUpperCase() + parent.label.slice(1)} {inputInfo.label} :  
        </label>  
        <div className="textbox-container">  
        <textarea    
          id={parent.label + '-' + inputInfo.label}    
          value={inputInfo.value}    
          onChange={(event) => {    
            inputInfo.value = event.target.value;    
            setData(data.copy());    
            handleTextareaSelection(parent, inputInfo, event);    
          }}    
          disabled={!inputInfo.disabled}  
          onSelect={(event) => {  
            inputInfo.haveBeenModified = true ? false : true;  
          }}  
          className={`text-box ${inputInfo.cssClass}`}    
          rows={inputInfo.type === 'input' ? 1 : 3}    
      />  
          {[...inputInfo.value.matchAll(new RegExp('\n', 'g'))].length >= (inputInfo.type === 'input' ? 1 : 3) && (  
            <img  
              src={openIcon}  
              alt="Ouvrir l'overlay"  
              className="open-icon"  
              onClick={() => {  
                modals.find(modalObj => modalObj.label === parent.label + inputInfo.label)?.modal.current?.classList.add('active');  
              }}  
            />  
          )}  
        <div className="button-container">  
        <button  
            className={`button ${isActive ? "active" : ""}`}  
            onClick={handleClick_Modify(inputInfo)}>  
          <img src={acceptIcon} alt="Modifier" width="20" height="20" />  
        </button>   
        <button  
          className={`button ${isActive ? "active" : ""}`}  
          onClick={handleClick_Approve(inputInfo)}>  
          <img src={editIcon} alt="Modifier" width="20" height="20" />  
        </button>  

      </div>  
          <Modal  
            toRef={modals.find(modalObj => modalObj.label === parent.label + inputInfo.label)!.modal}  
            text={inputInfo.value}  
            handleTextChange={(event) => {  
              inputInfo.value = event.target.value.toString();  
              setData(data.copy());  
            }}  
            close={() => modals.find(modalObj => modalObj.label === parent.label + inputInfo.label)?.modal?.current?.classList.remove('active')}  
          />  
        </div>  
      </div>  
    );  
  };  
  
  const sectionFactory = (sectionInfo: section) => {  
    return (  
      <div className={sectionInfo.label + '-container data-section'} key={sectionInfo.label}>  
        <h1 className="title underlined">{sectionInfo.title}</h1>  
        {sectionInfo.inputs.map(inputInfo => inputFactory(sectionInfo, inputInfo))}  
      </div>  
    );  
  };  
      
    const handleTextareaSelection = (parent: section, inputInfo: input, event: ChangeEvent<HTMLTextAreaElement>) => {  
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
  section.inputs.map((input) => ({  
    state: assessInputState(input).state,  
    title: `${section.title} - ${input.label}`,  
  }))  
);

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
  
    
return (    
  <div className="formPage-container" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gridGap: '1rem', alignItems: 'start' }}>    
      <div style={{ display: 'flex', gridColumn: '1 / span 1' }}>  
          <div className="pic-container">    
              <Carousel imgs={urls}></Carousel>    
          </div>    
          <div className="content-container">    
              <div className="data-container">    
                  {data.sections.map((sectionInfo) => sectionFactory(sectionInfo))}    
              </div>  
              <button className='button' onClick={validateFormInputs}>Submit</button>  
          </div>  
      </div>  
      <div style={{ position: 'sticky', top: 0, zIndex:"-2", gridColumn: '2 / span 1' }}>    
          <ProgressBar sections={inputStates} />    
      </div>   
  </div>    
);
};  
   
export default FormPage;  