import Input from "../../Model/Input-Model";
import Section from "../../Model/Section-Model";
import { useTranslation } from "react-i18next";
import "./Label.css";


interface LabelProps {
    sections: Section[];
}

const Label = ({sections}: LabelProps ) => {
    const {t} = useTranslation();

    const renderInput = (inputInfo: Input) => {
        if (inputInfo.isAlreadyTable) {
          return renderListInput(inputInfo);
        } else if (inputInfo.isInputObjectList) {
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
      );

      return (
        <div id={inputInfo.id} className="object-input">
          <table>
            <colgroup>
              <col span={1} style={{ width: "40%" }} />
              <col span={1} style={{ width: "20%" }} />
              <col span={1} style={{ width: "15%" }} />
            </colgroup>
            <thead>
              {keys.map((key, index) => {
                return <th key={index}>{key}</th>;
              })}
            </thead>
            <tbody>
              {inputInfo.value.map((_obj, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <p>
                        {
                          (inputInfo.value[index] as { [key: string]: string })[
                            keys[0]
                          ]
                        }
                      </p>
                    </td>
                    <td>
                      <p>
                        {
                          (inputInfo.value[index] as { [key: string]: string })[
                            keys[1]
                          ]
                        }
                      </p>
                    </td>
                    <td>
                      <p>
                        {
                          (inputInfo.value[index] as { [key: string]: string })[
                            keys[2]
                          ]
                        }
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    };
  
    const renderSection = (section: Section) => {
      const sectionClass = section.label ? `section-${section.label}` : '';
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
 

}

export default Label;