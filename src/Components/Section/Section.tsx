import React from "react";
import Input from "../../Model/Input-Model";
import Section from "../../Model/Section-Model";
import InputComponent from "../Input/Input";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Section.css";

interface sectionPorps {
  sectionInfo: Section;
  imgs: { title: string; url: string }[];
  propagateChange: (section: Section) => void;
  isLoading: boolean;
}

const SectionComponent: React.FC<sectionPorps> = ({
  sectionInfo,
  imgs,
  propagateChange,
  isLoading,
}) => {
  const handleInputChange = (newInfo: Input) => {
    sectionInfo.inputs.find((cur) => cur.label == newInfo.label)!.value =
      newInfo.value;
    propagateChange(sectionInfo);
  };
  if (isLoading) {
    // When loading, display skeleton loaders
    return (
      <div className={`${sectionInfo.label}-container data-section`}>
        <h1 className="title underlined">
          <Skeleton className="h1-skeleton" />
        </h1>
        {[...sectionInfo.inputs].map((inputInfo: Input, key: number) => {
          return (
            <InputComponent
              key={key}
              inputInfo={inputInfo}
              imgs={imgs}
              propagateChange={handleInputChange}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    );
  }
  return (
    <div className={sectionInfo.label + "-container data-section"}>
      <h1 className="title underlined">{sectionInfo.title}</h1>
      {[...sectionInfo.inputs].map((inputInfo: Input, key: number) => {
        return (
          <InputComponent
            key={key}
            inputInfo={inputInfo}
            imgs={imgs}
            propagateChange={handleInputChange}
            isLoading={isLoading}
          />
        );
      })}
    </div>
  );
};

export default SectionComponent;
