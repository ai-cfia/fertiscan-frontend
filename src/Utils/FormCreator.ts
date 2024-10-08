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
      new Input(t("cautions_en"), "cautions.en"),
      new Input(t("cautions_fr"), "cautions.fr"),
      new Input(t("instructions_en"), "instructions.en"),
      new Input(t("instructions_fr"), "instructions.fr"),
      new Input(t("ingredients_en"), "ingredients.en"),
      new Input(t("ingredients_fr"), "ingredients.fr"),
    ]),
    new Section(t("guaranteedAnalysis"), "guaranteed_analysis_fr", [
      // new Input(t("title"), "guaranteed_analysis.title"),
      new Input(t("title_en"), "guaranteed_analysis.title.en"),
      new Input(t("title_fr"), "guaranteed_analysis.title.fr"),
      new Input(t("guaranteedAnalysis_en"), "guaranteed_analysis.en"),
      new Input(t("guaranteedAnalysis_fr"), "guaranteed_analysis.fr"),
    ]),
    new Section(t("inspection_comment"), "inspection_comment", [
      new Input(t("addComment"), "inspection_comment"),
    ]),
  ]);

const access_from_str = (obj: Inspection, path: string) => {
  // eslint-disable-next-line
  // @ts-ignore
  return path.split(".").reduce((acc, part) => acc[part], obj);
};

// eslint-disable-next-line
const put_in_obj = (obj: Inspection, path: string, value: any) => {
  const parts = path.split(".");
  const last = parts.pop() as string;
  const target = parts.reduce((acc, part) => {
    // eslint-disable-next-line
    // @ts-ignore
    if (!acc[part]) {
      // eslint-disable-next-line
      // @ts-ignore
      acc[part] = {};
    }
    // eslint-disable-next-line
    // @ts-ignore
    return acc[part];
  }, obj);
  // eslint-disable-next-line
  // @ts-ignore
  target[last] = value;
};

// eslint-disable-next-line
export const populateFromJSON = (form: Data, data: Inspection) => {
  form.sections.forEach((section) => {
    section.inputs.forEach((input) => {
      const value = access_from_str(data, input.id);
      if (typeof value == "string") {
        input.value = [value];
      } else if (Array.isArray(value)) {
        if (value.length == 0) {
          input.isAlreadyTable = true;
          input.value = [""];
        } else if (typeof value[0] == "string") {
          input.value = value;
          input.isAlreadyTable = true;
        } else if (typeof value[0] == "object") {
          input.value = value;
          input.isInputObjectList = true;
        }
      } else if (typeof value == "object") {
        // eslint-disable-next-line
        // @ts-ignore
        input.value = [value];
      }
    });
  });
  // for state update the function must return a new object
  return form.copy();
};

export const createInspectionFromData = (
  data: Data,
  inspection: Inspection,
) => {
  data.sections.forEach((section) => {
    section.inputs.forEach((input) => {
      if (input.isAlreadyTable) {
        put_in_obj(inspection, input.id, input.value);
      } else if (input.isInputObjectList) {
        put_in_obj(inspection, input.id, input.value);
      } else {
        put_in_obj(inspection, input.id, input.value[0]);
      }
    });
  });
  return inspection;
};
