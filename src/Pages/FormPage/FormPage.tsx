import React, { useState, useRef } from "react";
import "./FormPage.css";
import Modal from "../../Components/Modal/Modal";

import openIcon from "../../assets/dot-menu.png";
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
  type: string;
  label: string;
  value: string;
  constructor(type: string, label: string, value: string) {
    this.type = type;
    this.label = label;
    this.value = value;
  }
}

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
        new input("input", "name", form.company_name),
        new input("input", "address", form.company_name),
      ]),
      new section("Manufacturer information", "manufacturer", [
        new input("input", "name", form.manufacturer_name),
      ]),
      new section("Fertilizer information", "fertilizer", [
        new input(
          "textarea",
          "precautionary fr",
          form.fertiliser_precautionary_fr,
        ),
      ]),
    ]),
  );

  const modals: {
    label: string;
    modal: React.MutableRefObject<HTMLDivElement | null>;
  }[] = [];

  data.sections.forEach((sectionInfo) => {
    sectionInfo.inputs.forEach((inputInfo) => {
      if (inputInfo.type === "textarea") {
        const modal = useRef<HTMLDivElement | null>(null);
        modals.push({
          label: sectionInfo.label + inputInfo.label,
          modal: modal,
        });
      }
    });
  });

  const inputFactory = (parent: section, inputInfo: input) => {
    if (inputInfo.type == "input") {
      return (
        <div className="input-container">
          <label htmlFor={parent.label + "-" + inputInfo.label}>
            {parent.label.charAt(0).toUpperCase() + parent.label.slice(1)}{" "}
            {inputInfo.label} :
          </label>
          <input
            type="text"
            className={parent.label + "-info"}
            id={parent.label + "-" + inputInfo.label}
            value={inputInfo.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              inputInfo.value = event.target.value;
              setData(data.copy());
            }}
          ></input>
        </div>
      );
    } else if (inputInfo.type == "textarea") {
      return (
        <div className="input-container">
          <label htmlFor={parent.label + "-" + inputInfo.label}>
            {parent.label.charAt(0).toUpperCase() + parent.label.slice(1)}{" "}
            {inputInfo.label} :
          </label>
          <div className="textbox-container">
            <textarea
              value={inputInfo.value}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                inputInfo.value = event.target.value;
                setData(data.copy());
              }}
              className="text-box"
            />
            {inputInfo.value.length > 100 && (
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
                    ?.modal.current?.classList.add("active");
                }}
              />
            )}
            <Modal
              toRef={
                modals.find(
                  (modalObj) =>
                    modalObj.label === parent.label + inputInfo.label,
                )!.modal
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
                  ?.modal.current!.classList.remove("active")
              }
            />
          </div>
        </div>
      );
    }
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
        <Carousel></Carousel>
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
