import Data from "../Model/Data-Model";
import Input from "../Model/Input-Model";
import Section from "../Model/Section-Model";
import i18n from "../i18n";
import Inspection from "../interfaces/Inspection.ts";

const t = i18n.t;

export const FertiliserForm = () =>
  new Data([
    new Section(t("compagnieHeader"), "company", [
      new Input(t("name"), "company.name"),
      new Input(t("address"), "company.address"),
      new Input(t("website"), "company.website"),
      new Input(t("phone_number"), "company.phone_number"),
    ]),
    new Section(t("manufacturerHeader"), "manufacturer", [
      new Input(t("name"), "manufacturer.name"),
      new Input(t("address"), "manufacturer.address"),
      new Input(t("website"), "manufacturer.website"),
      new Input(t("phone_number"), "manufacturer.phone_number"),
    ]),
    new Section(t("productHeader"), "fertiliser", [
      new Input(t("name"), "product.name"),
      new Input(t("registrationNumber"), "product.registration_number"),
      new Input(t("lotNumber"), "product.lot_number"),
      new Input(t("weight"), "product.metrics.weight"),
      new Input(t("density"), "product.metrics.density"),
      new Input(t("volume"), "product.metrics.volume"),
      new Input(t("npk"), "product.npk"),
      new Input(t("warranty"), "product.warranty"),
      new Input(t("cautions_en"), "cautions.en"),
      new Input(t("cautions_fr"), "cautions.fr"),
      new Input(t("instructions_en"), "instructions.en"),
      new Input(t("instructions_fr"), "instructions.fr"),
      new Input(t("micronutrients_en"), "micronutrients.en"),
      new Input(t("micronutrients_fr"), "micronutrients.fr"),
      new Input(t("ingredients_en"), "ingredients.en"),
      new Input(t("ingredients_fr"), "ingredients.fr"),
      new Input(t("specifications_en"), "specifications.en"),
      new Input(t("specifications_fr"), "specifications.fr"),
      new Input(t("firstAid_en"), "first_aid.en"),
      new Input(t("firstAid_fr"), "first_aid.fr"),
      new Input(t("guaranteedAnalysis"), "guaranteed_analysis"),
    ]),
  ]);

const access_from_str = (obj: Inspection, path: string) => {
  // eslint-disable-next-line
  // @ts-ignore
  return path.split(".").reduce((acc, part) => acc[part], obj);
}

// eslint-disable-next-line
export const populateFromJSON = (form: Data, data: Inspection) => {
  form.sections.forEach((section) => {
    section.inputs.forEach((input) => {
      let value = access_from_str(data, input.id);
      console.log(`value of ${input.id} is ${value}`);
      if (typeof value == "string") {
        input.value = value;
      } else if (Array.isArray(value) && value.length === 0) {
        input.value = [""];
        input.isAlreadyTable = true;
      } else if (
        Array.isArray(value) &&
        typeof value[0] == "string"
      ) {
        input.value = value;
        input.isAlreadyTable = true;
      } else if (
        Array.isArray(value) &&
        typeof value[0] == "object"
      ) {
        input.value = value;
        input.isInputObjectList = true;
      } else if (typeof value == "object" && value != null) {
        // @ts-ignore
        input.value = [value];
        input.isInputObjectList = true;
      } else if (input.id == "density" || input.id == "volume") {
        input.value = [
          {
            value: "",
            unit: "",
          },
        ];
        input.isInputObjectList = true;
      }
    });
  });
  // for state update the function must return a new object
  return form.copy();
};
