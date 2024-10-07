import Input from "../../Model/Input-Model";
import Section from "../../Model/Section-Model";
import { useTranslation } from "react-i18next";
import "./Label.css";

interface LabelProps {
  sections: Section[];
}

const Label = ({ sections }: LabelProps) => {
  const { t } = useTranslation();

  const renderInput = (inputInfo: Input) => {
    if (inputInfo.isAlreadyTable) {
      return renderListInput(inputInfo);
    } else if (
      inputInfo.isInputObjectList ||
      (Array.isArray(inputInfo.value) &&
        typeof inputInfo.value[0] == "object" &&
        inputInfo.value[0] != null)
    ) {
      return renderObjectInput(inputInfo);
    } else {
      return inputInfo.value as unknown as string;
    }
  };

  const renderListInput = (inputInfo: Input) => {
    return (
      <ul>
        {inputInfo.value.map((value, index) => (
          <li key={index}>{value as string}</li>
        ))}
      </ul>
    );
  };

  const renderObjectInput = (inputInfo: Input) => {
    const keys = Object.keys(
      (inputInfo.value as { [key: string]: string }[])[0],
    ).filter((key) => !inputInfo.fieldsToAvoidDisplaying.includes(key));

    return (
      <div id={inputInfo.id} className="object-input">
        <table>
          {keys.length == 3 && (
            <colgroup>
              <col span={1} style={{ width: "45%" }} />
              <col span={1} style={{ width: "35%" }} />
              <col span={1} style={{ width: "10%" }} />
              <col span={1} style={{ width: "10%" }} />
            </colgroup>
          )}
          {keys.length == 2 && (
            <colgroup>
              <col span={1} style={{ width: "55%" }} />
              <col span={1} style={{ width: "35%" }} />
              <col span={1} style={{ width: "10%" }} />
            </colgroup>
          )}
          <thead>
            {keys.map((key, index) => {
              return <th key={index}>{key}</th>;
            })}
          </thead>
          <tbody>
            {inputInfo.value.map((_obj, index) => {
              return (
                <tr key={index}>
                  {keys.map((_, keyIndex) => {
                    return (
                      <td>
                        <p>
                          {
                            (
                              inputInfo.value[index] as {
                                [key: string]: string;
                              }
                            )[keys[keyIndex]]
                          }
                        </p>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSection = (section: Section) => {
    const sectionClass = section.label ? `section-${section.label}` : "";
    return (
      <div key={section.label} className={` ${sectionClass}`.trim()}>
        <h2>{t(section.title)}</h2>
        <ul className="data-infos">
          {section.inputs.map((input) => (
            <li key={input.id}>
              <b>{input.label}:</b> {renderInput(input)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="label-container">
      {sections.map((section) => renderSection(section))}
    </div>
  );
};

export default Label;
