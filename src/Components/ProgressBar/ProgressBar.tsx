import "./ProgressBar.css";
import { FormClickActions } from "../../Utils/EventChannels";
import Input from "../../Model/Input-Model";
import React, { useEffect, useRef } from "react";

const ProgressBar = ({ sections }: { sections: { label: string }[] }) => {
  const sec: {
    label: string;
    ref: React.MutableRefObject<HTMLDivElement | null>;
  }[] = [];

  sections.forEach((section) => {
    sec.push({
      label: section.label,
      // eslint-disable-next-line
      ref: useRef(null),
    });
  });

  const updateProgressBarHeight = () => {
    const totalAvailableHeight = window.innerHeight -140;
    const sectionHeight = `${totalAvailableHeight / (sections.length+0.5)}px`;

    sec.forEach((sectionObj) => {
      const sectionElem = sectionObj.ref.current;
      if (sectionElem) {
        sectionElem.style.height = sectionHeight;
      }
    });
  };

  useEffect(() => {
    //This event is for when the app is resized:
    const resizeHandler = () => updateProgressBarHeight();
    window.addEventListener('resize', resizeHandler);

    resizeHandler();

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  },[sections]);

  useEffect(() => {
    FormClickActions.on("ApproveClick", (inputInfo: Input) => {
      sec.find((elem) => elem.label == inputInfo.id)!.ref.current!.className =
        "section approved";
      inputInfo.property = "approved";
    });
    FormClickActions.on("ModifyClick", (inputInfo: Input) => {
      sec.find((elem) => elem.label == inputInfo.id)!.ref.current!.className =
        "section modified";
      inputInfo.property = "modified";
    });
    FormClickActions.on("Rejected", (inputInfo: Input) => {
      sec.find((elem) => elem.label == inputInfo.id)!.ref.current!.className =
        "section modified";
      inputInfo.property = "modified";
    });
    // When the input is rejected because he is not in the good format ex: email, adress, etc
    FormClickActions.on("Rejected", (inputInfo: Input) => {
      console.log("rejected");
      console.log(inputInfo.id);
      // remove all classes and add section and rejected
      sec.find((elem) => elem.label == inputInfo.id)!.ref.current!.className =
        "section rejected";
      inputInfo.property = "rejected";
    });
    FormClickActions.on("SyncProgress", (inputInfo: Input) => {
      sec.find((elem) => elem.label == inputInfo.id)!.ref.current!.className =
        "section "+inputInfo.property;
    });
    // eslint-disable-next-line
  }, []);

  const flash = (element: HTMLElement) => {
    let color = "black";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      color = "white";
    }
    element.style.boxShadow = "0 0 10px 5px " + color;
    setTimeout(() => {
      element.style.boxShadow = "none";
    }, 500);
  };

  const give_focus = (section: { label: string }) => {
    // focus on the selected section
    const element = document.getElementById(section.label) as HTMLElement;
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      element.focus();
      flash(element);
    }
  };

  return (
    <div className="progress-bar-vertical">
      {sections.map((section, sec_index) => (
        <div
          id={`progress-section-${sec_index}`}
          onClick={() => give_focus(section)}
          key={`${sec_index}`}
          className={`section `}
          ref={sec.find((elem) => elem.label == section.label)!.ref}
          style={{
            height: `${(window.innerHeight - 115) / sections.length+0.5}px`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
