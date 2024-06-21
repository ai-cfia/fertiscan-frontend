class Input {
  label: string;
  value: string;
  id: string;
  disabled: boolean;
  property: string;

  constructor(
    label: string,
    value: string,
    id: string,
    disabled = false,
    property = "default",
  ) {
    this.label = label;
    this.value = value;
    this.id = id;
    this.disabled = disabled;
    this.property = property;
  }
}

export default Input;
