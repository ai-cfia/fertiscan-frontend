import './ProgressBar.css';

const ProgressBar = ({ sections }: { sections: any[] }) => {

  const flash=(element: HTMLElement)=> {
    element.style.boxShadow = '0 0 10px 5px white';
    setTimeout(() => {
      element.style.boxShadow = 'none';
    }, 500);
  }
  const give_focus = (section:any) => {
    console.log(section)
    // focus on the selected section
    const element = document.getElementById(section.label);
    if (element) {
      element.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
      element.focus()
      flash(element)
    }
  }




  return (
    <div className="progress-bar-vertical">
      {sections.map((section, sec_index) => (
            <div
              onClick={() => give_focus(section)}
              key={`${sec_index}`}
              className={`section ${section.state}`}
              style={{
                borderTopLeftRadius: sec_index === 0 ? '15px' : '0',
                borderTopRightRadius: sec_index === 0 ? '15px' : '0',
                borderBottomLeftRadius: sec_index === sections.length-1 ? '15px' : '0',
                borderBottomRightRadius: sec_index === sections.length-1 ? '15px' : '0',
                borderBottom: sec_index === sections.length-1 ? 'none' : '2px solid ',
                height: "95px",
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
