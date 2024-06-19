import Input from "./Input-Model";

class Section {
  title: string;
  label: string;
  inputs: Input[];
  constructor(title: string, label: string, inputs: Input[]) {
    this.title = title;
    this.label = label;
    this.inputs = inputs;
  }
  public push_input(newInput: Input) {
    this.inputs.push(newInput);
  }
  public remove_input(toRemove: Input) {
    this.inputs = this.inputs.filter((cur) => cur !== toRemove);
  }
}

export default Section;
