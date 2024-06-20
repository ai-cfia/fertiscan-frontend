class Input {
  label: string;
  value: string;
  id: string;
  disabled: boolean;
  property: string;

  constructor(
    label: string,
    value: string,
    parent_label: string,
    disabled = false,
    property = "default",
  ) {
    this.label = label;
    this.value = value;
    this.id = parent_label + "-" + this.label;
    this.disabled = disabled;
    this.property = property;
  }
}

export default Input;
