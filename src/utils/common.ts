import {
  LabelData,
  Quantity,
  VerifiedField,
  VerifiedTextField,
} from "@/types/types";
import { AxiosError } from "axios";
import {
  LabelDataOutput,
  NutrientValue,
  PipelineInspectionValue,
} from "./server/backend";

export const checkFieldRecord = (
  record: Record<string, VerifiedField>,
  verified: boolean = true,
): boolean => {
  return (
    record &&
    Object.values(record).every((field) => field.verified === verified)
  );
};

export const checkFieldArray = (
  fields: VerifiedField[],
  verified: boolean = true,
): boolean => {
  return fields.every((field) => field.verified === verified);
};

export const processAxiosError = (error: AxiosError) => {
  if (error.response) {
    console.error("Error response:", error.response.data);
    const responseData = error.response.data as { error: string };
    return responseData.error;
  }

  if (error.request) {
    console.error("Error request:", error.request);
    return error.request;
  }

  console.error("Error message:", error.message);
  return error.message;
};

export function verifiedField(value?: string | null): VerifiedTextField {
  return { value: value ?? "", verified: false };
}

export function quantity(val?: PipelineInspectionValue | null): Quantity {
  return { value: String(val?.value ?? ""), unit: val?.unit ?? "" };
}

export function verifiedTranslations(
  enList?: (string | null)[] | null,
  frList?: (string | null)[] | null,
) {
  return (enList ?? []).map((en, i) => ({
    en: en ?? "",
    fr: frList?.[i] ?? "",
    verified: false,
  }));
}

export function verifiedItemPair(
  enList?: NutrientValue[] | null,
  frList?: NutrientValue[] | null,
) {
  return (enList ?? []).map((en, i) => ({
    en: en.nutrient ?? "",
    fr: frList?.[i]?.nutrient ?? "",
    value: String(en.value ?? ""),
    unit: en.unit ?? "",
    verified: false,
  }));
}

export function mapLabelDataOutputToLabelData(
  data: LabelDataOutput,
): LabelData {
  return {
    organizations: [
      {
        name: verifiedField(data.company_name),
        address: verifiedField(data.company_address),
        website: verifiedField(data.company_website),
        phoneNumber: verifiedField(data.company_phone_number),
      },
      {
        name: verifiedField(data.manufacturer_name),
        address: verifiedField(data.manufacturer_address),
        website: verifiedField(data.manufacturer_website),
        phoneNumber: verifiedField(data.manufacturer_phone_number),
      },
    ],
    baseInformation: {
      name: verifiedField(data.fertiliser_name),
      registrationNumber: verifiedField(data.registration_number),
      lotNumber: verifiedField(data.lot_number),
      npk: verifiedField(data.npk),
      weight: {
        verified: false,
        quantities: (data.weight ?? []).map(quantity),
      },
      density: { verified: false, quantities: [quantity(data.density)] },
      volume: { verified: false, quantities: [quantity(data.volume)] },
    },
    cautions: verifiedTranslations(data.cautions_en, data.cautions_fr),
    instructions: verifiedTranslations(
      data.instructions_en,
      data.instructions_fr,
    ),
    guaranteedAnalysis: {
      titleEn: verifiedField(data.guaranteed_analysis_en?.title),
      titleFr: verifiedField(data.guaranteed_analysis_fr?.title),
      isMinimal: {
        value: !!data.guaranteed_analysis_en?.is_minimal,
        verified: false,
      },
      nutrients: verifiedItemPair(
        data.guaranteed_analysis_en?.nutrients,
        data.guaranteed_analysis_fr?.nutrients,
      ),
    },
    ingredients: verifiedItemPair(data.ingredients_en, data.ingredients_fr),
  };
}
