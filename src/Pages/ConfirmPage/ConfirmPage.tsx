import { useEffect, useState } from "react";
import Carousel from "../../Components/Carousel/Carousel";
import { useLocation, useNavigate } from "react-router-dom";
import SectionComponent from "../../Components/Section/Section.tsx";
import Section from "../../Model/Section-Model.tsx";
import "./ConfirmPage.css";


const ConfirmPage = () => {
    const location = useLocation();
    const data = location.state.data;
    const [urls, setUrls] = useState<
    {
      url: string;
      title: string;
    }[]
  >(location.state.urls);
    

    const renderSection = (section: Section) => (
        <div key={section.label}>
            <h2>{section.label}</h2>
            <ul className="data-infos">
                {section.inputs.map((input) => (
                    <li key={input.id}>
                        <b>{input.label}:</b> {input.value}
                    </li>
                ))}
            </ul>
        </div>
    );


    return (
        <div className="confirm-page-container">
            <h1 id="confirm-title">Confirmation Page</h1>
            <Carousel imgs={urls} />
            <div className="confirm-container">
              {data.sections.map((section:Section) => renderSection(section))}
              <div className="button-container">
                  <button onClick={() => console.log('Cancel')}>Cancel</button>
                  <button onClick={() => console.log('Confirm')}>Confirm</button>
              </div>
            </div>
        </div>
    );
};

export default ConfirmPage;
