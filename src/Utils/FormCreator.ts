import Data from "../Model/Data-Model";
import Input from "../Model/Input-Model";
import Section from "../Model/Section-Model";
import i18n from "../i18n";

const t = i18n.t;

export const FertiliserForm = () =>
  new Data([
    new Section(t("compagnieHeader"), "company", [
      new Input(t("name"), "company_name"),
      new Input(t("address"), "company_address"),
      new Input(t("website"), "company_website"),
      new Input(t("phone_number"), "company_phone_number"),
    ]),
    new Section(t("manufacturerHeader"), "manufacturer", [
      new Input(t("name"), "manufacturer_name"),
      new Input(t("address"), "manufacturer_address"),
      new Input(t("website"), "manufacturer_website"),
      new Input(t("phone_number"), "manufacturer_phone_number"),
    ]),
    new Section(t("productHeader"), "fertiliser", [
      new Input(t("name"), "fertiliser_name"),
      new Input(t("registrationNumber"), "registration_number"),
      new Input(t("lotNumber"), "lot_number"),
      new Input(t("weight"), "weight"),
      new Input(t("density"), "density"),
      new Input(t("volume"), "volume"),
      new Input(t("npk"), "npk"),
      new Input(t("warranty"), "warranty"),
      new Input(t("cautions_en"), "cautions_en"),
      new Input(t("cautions_fr"), "cautions_fr"),
      new Input(t("instructions_en"), "instructions_en"),
      new Input(t("instructions_fr"), "instructions_fr"),
      new Input(t("micronutrients_en"), "micronutrients_en"),
      new Input(t("micronutrients_fr"), "micronutrients_fr"),
      new Input(t("ingredients_en"), "ingredients_en"),
      new Input(t("ingredients_fr"), "ingredients_fr"),
      new Input(t("specifications_en"), "specifications_en"),
      new Input(t("specifications_fr"), "specifications_fr"),
      new Input(t("firstAid_en"), "first_aid_en"),
      new Input(t("firstAid_fr"), "first_aid_fr"),
      new Input(t("guaranteedAnalysis"), "guaranteed_analysis"),
    ]),
  ]);

// eslint-disable-next-line
export const populateFromJSON = (form: Data, data: any) => {
  form.sections.forEach((section) => {
    section.inputs.forEach((input) => {
      if (typeof data[input.id] == "string") {
        input.value = [data[input.id]];
      } else if (
        Array.isArray(data[input.id]) &&
        typeof data[input.id][0] == "string"
      ) {
        input.value = data[input.id];
        input.isAlreadyTable = true;
      } else if (
        Array.isArray(data[input.id]) &&
        typeof data[input.id][0] == "object"
      ) {
        input.value = data[input.id];
        input.isInputObjectList = true;
      } else if (typeof data[input.id] == "object" && data[input.id] != null) {
        input.value = [data[input.id]];
        input.isInputObjectList = true;
      }
    });
  });
  // for state update the function must return a new object
  return form.copy();
};
