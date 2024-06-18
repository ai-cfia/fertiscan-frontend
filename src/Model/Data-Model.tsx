import Section from "./Section-Model";

class Data {
  sections: Section[];
  constructor(sections: Section[]) {
    this.sections = sections;
  }
  public push_section(newSections: Section) {
    this.sections.push(newSections);
  }
  public remove_sections(toRemove: Section) {
    this.sections = this.sections.filter((cur) => cur !== toRemove);
  }
  public copy() {
    return new Data(this.sections);
  }
}

export default Data;
