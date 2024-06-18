class Input {
    [x: string]: string | boolean;  
    label: string;        
    value: string;     
    approved: boolean = false;
    state: string;      
    disable:boolean = false; 
    cssClass: string = '';
    constructor( label: string, value: string,  state: string = 'empty', approved = false, disable = true) {           
      this.label = label;        
      this.value = value;        
      this.state = state;
      this.approved = approved;
      this.disable = disable;
    }        
  }  

export default Input;