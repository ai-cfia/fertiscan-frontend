import './ProgressBar.css';    
  
const ProgressBar = ({ sections }: { sections: any[] }) => {    
  return (    
    <div className="progress-bar-vertical">    
      {[{ state: 'non-evaluated' }, ...sections].map((section, index) => (    
        <div    
          key={index}    
          className={`section ${section.state}`}  
          style={{    
            borderTopLeftRadius: index === 0 ? '15px' : '0',    
            borderTopRightRadius: index === 0 ? '15px' : '0',    
            borderBottomLeftRadius: index === sections.length ? '15px' : '0',    
            borderBottomRightRadius: index === sections.length ? '15px' : '0',    
            borderBottom: index === sections.length ? 'none' : '2px solid ',   
            height: "60px",   
            backgroundColor: section.state === 'modified' ? 'yellow' :   
                            section.state === 'non-modified' ? 'red' :
                            section.state === 'approved' ? 'green' :   
                            'gainsboro',  
          }}    
        ></div>    
      ))}    
    </div>    
  );    
};    
  
export default ProgressBar;    
