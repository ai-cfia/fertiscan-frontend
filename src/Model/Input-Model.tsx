class Input {
  label: string;
  value: string;
  id: string;
  disabled: boolean;

  constructor(
    label: string,
    value: string,
    parent_label: string,
    disabled = false,
  ) {
    this.label = label;
    this.value = value;
    this.id = parent_label + "-" + this.label;
    this.disabled = disabled;
  }
}

export default Input;
