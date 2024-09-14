export class Input {
  label: string;
  value: string[] | { [key: string]: string }[];
  id: string;
  disabled: boolean;
  property: string;
  isAlreadyTable: boolean;
  isInputObjectList: boolean;
  fieldsToAvoidDisplaying: string[];

  constructor(
    label: string,
    id: string,
    value: string[] | { [key: string]: string }[] = [],
    disabled = false,
    property = "default",
    isAlreadyTable = false,
    isInputObjectList = false,
    fieldsToAvoidDisplaying = ["edited"],
  ) {
    this.label = label;
    this.id = id;
    this.disabled = disabled;
    this.property = property;
    this.value = value;
    this.isAlreadyTable = isAlreadyTable;
    this.isInputObjectList = isInputObjectList;
    this.fieldsToAvoidDisplaying = fieldsToAvoidDisplaying;
  }
}

export default Input;
