import './ProgressBar.css';

const ProgressBar = ({ sections }: { sections: any[] }) => {
  return (
    <div className="progress-bar-vertical">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`section ${section.state}`}
          style={{
            borderTopLeftRadius: index === 0 ? '15px' : '0',
            borderTopRightRadius: index === 0 ? '15px' : '0',
            borderBottomLeftRadius: index === sections.length - 1 ? '15px' : '0',
            borderBottomRightRadius: index === sections.length - 1 ? '15px' : '0',
            borderBottom: index === sections.length - 1 ? 'none' : '2px solid white',
          }}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
