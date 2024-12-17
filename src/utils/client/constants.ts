import { LabelData } from "@/types/types";

export const VERIFIED_LABEL_DATA: LabelData = {
  organizations: [
    {
      name: { value: "", verified: true },
      address: { value: "", verified: true },
      website: { value: "", verified: true },
      phoneNumber: { value: "", verified: true },
    },
  ],
  baseInformation: {
    name: { value: "", verified: true },
    registrationNumber: { value: "", verified: true },
    lotNumber: { value: "", verified: true },
    npk: { value: "", verified: true },
    weight: {
      verified: true,
      quantities: [{ value: "", unit: "" }],
    },
    density: {
      verified: true,
      quantities: [{ value: "", unit: "" }],
    },
    volume: {
      verified: true,
      quantities: [{ value: "", unit: "" }],
    },
  },
  cautions: [{ en: "", fr: "", value: "", unit: "", verified: true }],
  instructions: [{ en: "", fr: "", value: "", unit: "", verified: true }],
  guaranteedAnalysis: {
    titleEn: { value: "", verified: true },
    titleFr: { value: "", verified: true },
    isMinimal: { value: false, verified: true },
    nutrients: [{ en: "", fr: "", value: "", unit: "", verified: true }],
  },
  ingredients: [{ en: "", fr: "", value: "", unit: "", verified: true }],
};
