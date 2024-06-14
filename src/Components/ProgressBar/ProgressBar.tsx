import './ProgressBar.css';    
  
const ProgressBar = ({ sections }: { sections: any[] }) => {    
  console.log(sections)
  return (    
    <div className="progress-bar-vertical">    
      {sections.map((section, sec_index) => (
            <div    
              key={`${sec_index}`}    
              className={`section ${section.state}`}  
              style={{    
                borderTopLeftRadius: sec_index === 0 ? '15px' : '0',    
                borderTopRightRadius: sec_index === 0 ? '15px' : '0',    
                borderBottomLeftRadius: sec_index === sections.length ? '15px' : '0',    
                borderBottomRightRadius: sec_index === sections.length ? '15px' : '0',    
                borderBottom: sec_index === sections.length ? 'none' : '2px solid ',   
                height: "60px",   
                backgroundColor: section.state === 'modified' ? 'yellow' :   
                                section.state === 'non-modified' ? 'red' :
                                section.state === 'approved' ? 'green' :   
                                'gainsboro',  
              }}    
            ></div>
        )
      )}    
    </div>    
  );    
};    
  
export default ProgressBar;    
