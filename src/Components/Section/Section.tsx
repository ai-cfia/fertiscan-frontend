import React from "react";
import Input from "../../Model/Input-Model";
import Section from "../../Model/Section-Model";
import InputComponent from "../Input/Input";

interface sectionPorps {
  sectionInfo: Section;
  imgs: { title: string; url: string }[];
  propagateChange: (section: Section) => void;
  onModalStateChange: (isOpen: boolean) => void;
}

const SectionComponent: React.FC<sectionPorps> = ({
  sectionInfo,
  imgs,
  propagateChange,
  onModalStateChange,
}) => {
  const handleInputChange = (newInfo: Input) => {
    sectionInfo.inputs.find((cur) => cur.label == newInfo.label)!.value =
      newInfo.value;
    propagateChange(sectionInfo);
  };
  const handleModalStateChange = (isOpen: boolean) => {
    onModalStateChange(isOpen);
  };

  return (
    <div className={sectionInfo.label + "-container data-section"}>
      <h1 className="title underlined">{sectionInfo.title}</h1>
      {[...sectionInfo.inputs].map((inputInfo: Input, key: number) => {
        return (
          <InputComponent
            key={key}
            inputInfo={inputInfo}
            parent={sectionInfo}
            imgs={imgs}
            propagateChange={handleInputChange}
            onModalStateChange={handleModalStateChange}
          />
        );
      })}
    </div>
  );
};

export default SectionComponent;
