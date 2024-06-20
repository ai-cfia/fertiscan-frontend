import { useEffect, useState } from "react";
import Carousel from "../../Components/Carousel/Carousel";
import { useLocation, useNavigate } from "react-router-dom";
import SectionComponent from "../../Components/Section/Section.tsx";
import Section from "../../Model/Section-Model.tsx";

const ConfirmPage = () => {
    const location = useLocation();
    const data = location.state.data;
    const [urls, setUrls] = useState<
    {
      url: string;
      title: string;
    }[]
  >([]);
    
  const test = () => {
    data.forEach((file) => {
      return (
        <label key={file.label || file.name}>  {/* Add a key for accessibility */}
          {file.label || file.name}  {/* Display label if available, otherwise filename */}
        </label>
      );
    });
  };
    const renderSection = (section: Section) => (
        <div key={section.label}>
            <h2>{section.label}</h2>
            <ul>
                {section.inputs.map((input) => (
                    <li key={input.id}>
                        <b>{input.label}:</b> {input.value}
                    </li>
                ))}
            </ul>
        </div>
    );

    useEffect(() => {
        // load imgs for the carousel
        const tmpUrls: { url: string; title: string }[] = [];
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            tmpUrls.push({
              url: e!.target!.result as string,
              title: file.name,
            });
          };
          reader.onloadend = () => setUrls(tmpUrls);
          reader.readAsDataURL(file);
        })}, [files]);

    return (
        <div className="confirm-page-container">
            <h1>Confirmation Page</h1>
            {Section.map(renderSection)}
            <div className="button-container">
                <button onClick={() => console.log('Cancel')}>Cancel</button>
                <button onClick={() => console.log('Confirm')}>Confirm</button>
            </div>
        </div>
    );
};

export default ConfirmPage;
