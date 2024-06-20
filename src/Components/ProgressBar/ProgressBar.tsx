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

  useEffect(() => {
    // eslint-disable-next-line
    const unsubApprove = FormClickActions.on(
      "ApproveClick",
      (inputInfo: Input) => {
        sec
          .find((elem) => elem.label == inputInfo.id)!
          .ref.current!.className = "section approved";
        inputInfo.property = "approved";
      },
    );
    // eslint-disable-next-line
    const unsubModify = FormClickActions.on(
      "ModifyClick",
      (inputInfo: Input) => {
        sec
          .find((elem) => elem.label == inputInfo.id)!
          .ref.current!.className = "section modified";
        inputInfo.property = "modified";
      },
    );
    // eslint-disable-next-line
    // When the input is rejected because he is not in the good format ex: email, adress, etc
    const unsubRejected = FormClickActions.on(
      "Rejected",
      (inputInfo: Input) => {
        console.log("rejected");
        console.log(inputInfo.id)
        // remove all classes and add section and rejected
        sec
          .find((elem) => elem.label == inputInfo.id)!
          .ref.current!.className = "section rejected";
        inputInfo.property = "rejected";
      },
    );
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
          onClick={() => give_focus(section)}
          key={`${sec_index}`}
          className={`section `}
          ref={sec.find((elem) => elem.label == section.label)!.ref}
          style={{
            borderTopLeftRadius: sec_index === 0 ? "15px" : "0",
            borderTopRightRadius: sec_index === 0 ? "15px" : "0",
            borderBottomLeftRadius:
              sec_index === sections.length - 1 ? "15px" : "0",
            borderBottomRightRadius:
              sec_index === sections.length - 1 ? "15px" : "0",
            borderBottom:
              sec_index === sections.length - 1 ? "none" : "2px solid ",
            height: `${(window.innerHeight-140) / sections.length}px`,
            cursor: "pointer",
          }}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
