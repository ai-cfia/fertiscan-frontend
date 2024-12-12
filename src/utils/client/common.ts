import {
  BilingualField,
  LabelData,
  Quantity,
  VerifiedField,
} from "@/types/types";
import { AxiosError } from "axios";
import {
  FertiscanDbMetadataInspectionValue,
  Inspection,
  LabelDataOutput,
  NutrientValue,
  PipelineInspectionValue,
} from "../server/backend";

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

export function quantity(
  val?: PipelineInspectionValue | FertiscanDbMetadataInspectionValue | null,
): Quantity {
  return { value: String(val?.value ?? ""), unit: val?.unit ?? "" };
}

export function verifiedTranslations(
  enList?: (string | null)[] | null,
  frList?: (string | null)[] | null,
): BilingualField[] {
  return (enList ?? []).map((en, i) => ({
    en: en ?? "",
    fr: frList?.[i] ?? "",
    verified: false,
  }));
}

export function verifiedItemPairNutrientValue(
  enList?: NutrientValue[] | null,
  frList?: NutrientValue[] | null,
): BilingualField[] {
  return (enList ?? []).map((en, i) => ({
    en: en.nutrient ?? "",
    fr: frList?.[i]?.nutrient ?? "",
    value: String(en.value ?? ""),
    unit: en.unit ?? "",
    verified: false,
  }));
}

export function verifiedItemPairInspectionValue(
  enList?: FertiscanDbMetadataInspectionValue[] | null,
  frList?: FertiscanDbMetadataInspectionValue[] | null,
  verified?: boolean | null,
): BilingualField[] {
  return (enList ?? []).map((en, i) => ({
    en: en?.name ?? "",
    fr: frList?.[i]?.name ?? "",
    value: String(en?.value ?? ""),
    unit: en?.unit ?? "",
    verified: verified ?? false,
  }));
}

export function mapLabelDataOutputToLabelData(
  data: LabelDataOutput,
): LabelData {
  return {
    organizations: [
      {
        name: { value: data.company_name ?? "", verified: false },
        address: { value: data.company_address ?? "", verified: false },
        website: { value: data.company_website ?? "", verified: false },
        phoneNumber: {
          value: data.company_phone_number ?? "",
          verified: false,
        },
      },
      {
        name: { value: data.manufacturer_name ?? "", verified: false },
        address: { value: data.manufacturer_address ?? "", verified: false },
        website: { value: data.manufacturer_website ?? "", verified: false },
        phoneNumber: {
          value: data.manufacturer_phone_number ?? "",
          verified: false,
        },
      },
    ],
    baseInformation: {
      name: { value: data.fertiliser_name ?? "", verified: false },
      registrationNumber: {
        value: data.registration_number ?? "",
        verified: false,
      },
      lotNumber: { value: data.lot_number ?? "", verified: false },
      npk: { value: data.npk ?? "", verified: false },
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
      titleEn: {
        value: data.guaranteed_analysis_en?.title ?? "",
        verified: false,
      },
      titleFr: {
        value: data.guaranteed_analysis_fr?.title ?? "",
        verified: false,
      },
      isMinimal: {
        value: !!data.guaranteed_analysis_en?.is_minimal,
        verified: false,
      },
      nutrients: verifiedItemPairNutrientValue(
        data.guaranteed_analysis_en?.nutrients,
        data.guaranteed_analysis_fr?.nutrients,
      ),
    },
    ingredients: verifiedItemPairNutrientValue(
      data.ingredients_en,
      data.ingredients_fr,
    ),
  };
}

export function mapInspectionToLabelData(inspection: Inspection): LabelData {
  const v = inspection.verified ?? false;
  return {
    organizations: [
      {
        name: { value: inspection.company?.name ?? "", verified: v },
        address: { value: inspection.company?.address ?? "", verified: v },
        website: { value: inspection.company?.website ?? "", verified: v },
        phoneNumber: {
          value: inspection.company?.phone_number ?? "",
          verified: v,
        },
      },
      {
        name: { value: inspection.manufacturer?.name ?? "", verified: v },
        address: { value: inspection.manufacturer?.address ?? "", verified: v },
        website: { value: inspection.manufacturer?.website ?? "", verified: v },
        phoneNumber: {
          value: inspection.manufacturer?.phone_number ?? "",
          verified: v,
        },
      },
    ],
    baseInformation: {
      name: { value: inspection.product.name ?? "", verified: v },
      registrationNumber: {
        value: inspection.product.registration_number ?? "",
        verified: v,
      },
      lotNumber: { value: inspection.product.lot_number ?? "", verified: v },
      npk: { value: inspection.product.npk ?? "", verified: v },
      weight: {
        verified: v,
        quantities: (inspection.product.metrics?.weight ?? []).map(quantity),
      },
      density: {
        verified: v,
        quantities: [quantity(inspection.product.metrics?.density)],
      },
      volume: {
        verified: v,
        quantities: [quantity(inspection.product.metrics?.volume)],
      },
    },
    cautions: (inspection.cautions.en ?? []).map((en, i) => ({
      en: en ?? "",
      fr: inspection.cautions.fr?.[i] ?? "",
      verified: v,
    })),
    instructions: (inspection.instructions.en ?? []).map((en, i) => ({
      en: en ?? "",
      fr: inspection.instructions.fr?.[i] ?? "",
      verified: v,
    })),
    guaranteedAnalysis: {
      titleEn: {
        value: inspection.guaranteed_analysis?.title?.en ?? "",
        verified: v,
      },
      titleFr: {
        value: inspection.guaranteed_analysis?.title?.fr ?? "",
        verified: v,
      },
      isMinimal: {
        value: !!inspection.guaranteed_analysis?.is_minimal,
        verified: v,
      },
      nutrients: verifiedItemPairInspectionValue(
        inspection.guaranteed_analysis?.en,
        inspection.guaranteed_analysis?.fr,
        v,
      ),
    },
    ingredients: verifiedItemPairInspectionValue(
      // TODO: use ingredients once the backend is updated
      inspection.guaranteed_analysis?.en,
      inspection.guaranteed_analysis?.fr,
      v,
    ),
  };
}
