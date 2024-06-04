import React, { useState, useRef } from "react";
import "./FormPage.css";
import Modal from "../../Components/Modal/Modal";
import openIcon from "../../assets/dot-menu.svg";
import Carousel from "../../Components/Carousel/Carousel";



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
  label: string;
  value: string;
  constructor(label: string, value: string) {
    this.label = label;
    this.value = value;
  }
}


const MAX_CHAR_IN_ROW = 37;

const FormPage = () => {
  const [form, setForm] = useState({
    company_name: "a",
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
    fertiliser_precautionary_fr: "a",
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

  const [data, setData] = useState<dataObject>(
    new dataObject([
      new section("Company information", "company", [
        new input( "name", form.company_name),
        new input( "address", form.company_name),
      ]),
      new section("Manufacturer information", "manufacturer", [
        new input("name", form.manufacturer_name),
      ]),
      new section("Fertilizer information", "fertilizer", [
        new input(
          "precautionary fr",
          form.fertiliser_precautionary_fr,
        ),
      ]),
    ]),
  );

  const modals: {
    label: string;
    ref: React.MutableRefObject<HTMLDivElement | null>;
  }[] = [];
  const textareas:{
    label:string;
    ref: React.MutableRefObject<HTMLTextAreaElement | null>;
  }[] = [];

  const urls = [{
      url:"https://clipground.com/images/square-clipart-image-9.png",
      title:"blue"
    },
    {
      url:"https://th.bing.com/th/id/R.831df2b352f211506b6f5e96fe495e3b?rik=kOhAG2Zaz45WMg&riu=http%3a%2f%2ffc06.deviantart.net%2ffs13%2ff%2f2007%2f040%2fb%2f7%2fPhoto__Large_red_square_by_TheLastDanishPastry.png&ehk=TxXfjnmu6TwpRkPtzi7u1X%2fHbjCBDARquCvl7J1a%2b58%3d&risl=&pid=ImgRaw&r=0",
      title:"red"
    },
    {
      url:"https://upload.wikimedia.org/wikipedia/commons/2/29/Solid_green.svg",
      title:"green"
    }
  ]
  data.sections.forEach((sectionInfo) => {
    sectionInfo.inputs.forEach((inputInfo) => {
      const modal = useRef<HTMLDivElement | null>(null);
      modals.push({
        label: sectionInfo.label + inputInfo.label,
        ref: modal,
      });
      const textarea = useRef<HTMLTextAreaElement | null>(null);
      textareas.push({
        label: sectionInfo.label + inputInfo.label,
        ref: textarea,
      })
    });
  });


  const inputFactory = (parent: section, inputInfo: input) => {
      return (
        <div className="input-container">
          <label htmlFor={parent.label + "-" + inputInfo.label}>
            {parent.label.charAt(0).toUpperCase() + parent.label.slice(1)}{" "}
            {inputInfo.label} :
          </label>
          <div className="textbox-container">
            <textarea
              ref={textareas.find(obj=>obj.label==parent.label+inputInfo.label)?.ref}
              value={inputInfo.value}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                const current = event.target as HTMLTextAreaElement
                {/* 
                  - first we count the number line break 
                  - then for each piece of text (separated by a line break)
                      we check if this piece is too long for a line
                */}
                let shown_lines = current.value.split('\n').length+
                  current.value.split('\n')
                    .map(line=>Math.floor(line.length/MAX_CHAR_IN_ROW))
                    .reduce((sum,current)=>sum+current)
                
                if( shown_lines < current.rows && current.rows > 1 ){
                  current.rows--;
                }
                if( shown_lines > current.rows && current.rows<3 ){
                  current.rows++;
                }
                inputInfo.value = event.target.value;
                setData(data.copy());
              }}
              className="text-box"
              rows={1}
            />
            {/* same as shown_lines */}
            {inputInfo.value.split('\n').length+inputInfo.value.split('\n').map(line=>Math.floor(line.length/MAX_CHAR_IN_ROW)).reduce((sum,current)=>sum+current) > 3 && (
              <img
                src={openIcon}
                alt="Ouvrir l'overlay"
                className="open-icon"
                onClick={() => {
                  modals
                    .find(
                      (modalObj) =>
                        modalObj.label === parent.label + inputInfo.label,
                    )
                    ?.ref.current?.classList.add("active");
                }}
              />
            )}
            <Modal
              toRef={
                modals.find(
                  (modalObj) =>
                    modalObj.label === parent.label + inputInfo.label,
                )!.ref
              }
              text={inputInfo.value}
              handleTextChange={(event: {
                target: { value: React.SetStateAction<string> };
              }) => {
                inputInfo.value = event.target.value.toString();
                setData(data.copy());
              }}
              close={() =>
                modals
                  .find(
                    (modalObj) =>
                      modalObj.label === parent.label + inputInfo.label,
                  )
                  ?.ref.current!.classList.remove("active")
              }
            />
          </div>
        </div>
      );
  };

  const sectionFactory = (sectionInfo: section) => {
    return (
      <div className={sectionInfo.label + "-container data-section"}>
        <h1 className="title underlined">{sectionInfo.title}</h1>
        {[...sectionInfo.inputs].map((inputInfo: input) => {
          return inputFactory(sectionInfo, inputInfo);
        })}
      </div>
    );
  };

  return (
    <div className="formPage-container">
      <div className="pic-container">
        <Carousel imgs={urls}></Carousel>
      </div>
      <div className="data-container">
        {[...data.sections].map((sectionInfo: section) => {
          return sectionFactory(sectionInfo);
        })}
      </div>
    </div>
  );
};

export default FormPage;
