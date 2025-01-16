import { BilingualField, LabelData, Quantity } from "@/types/types";
import {
  FertiscanDbMetadataInspectionValue,
  Inspection,
  InspectionUpdate,
  LabelDataInput,
  LabelDataOutput,
  NutrientValue,
  PipelineInspectionValue,
} from "./backend";

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
    confirmed: false,
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
    confirmed: inspection.verified ?? false,
    inspection_id: inspection.inspection_id,
    comment: inspection.inspection_comment ?? "",
  };
}

export function mapLabelDataToLabelDataInput(
  labelData: LabelData,
): LabelDataInput {
  const org0 = labelData.organizations?.[0] || {};
  const org1 = labelData.organizations?.[1] || {};

  return {
    company_name: org0.name?.value,
    company_address: org0.address?.value,
    company_website: org0.website?.value,
    company_phone_number: org0.phoneNumber?.value,
    manufacturer_name: org1.name?.value,
    manufacturer_address: org1.address?.value,
    manufacturer_website: org1.website?.value,
    manufacturer_phone_number: org1.phoneNumber?.value,
    fertiliser_name: labelData.baseInformation.name.value,
    registration_number: labelData.baseInformation.registrationNumber.value,
    lot_number: labelData.baseInformation.lotNumber.value,
    weight:
      labelData.baseInformation.weight.quantities?.map((q) => ({
        value: Number(q.value) || null,
        unit: q.unit || null,
      })) || [],
    density: {
      value:
        Number(labelData.baseInformation.density.quantities?.[0]?.value) ||
        null,
      unit: labelData.baseInformation.density.quantities?.[0]?.unit || null,
    },
    volume: {
      value:
        Number(labelData.baseInformation.volume.quantities?.[0]?.value) || null,
      unit: labelData.baseInformation.volume.quantities?.[0]?.unit || null,
    },
    npk: labelData.baseInformation.npk.value,
    guaranteed_analysis_en: {
      title: labelData.guaranteedAnalysis.titleEn.value,
      is_minimal: labelData.guaranteedAnalysis.isMinimal.value,
      nutrients: labelData.guaranteedAnalysis.nutrients.map((n) => ({
        nutrient: n.en,
        value: Number(n.value),
        unit: n.unit,
      })),
    },
    guaranteed_analysis_fr: {
      title: labelData.guaranteedAnalysis.titleFr.value,
      is_minimal: labelData.guaranteedAnalysis.isMinimal.value,
      nutrients: labelData.guaranteedAnalysis.nutrients.map((n) => ({
        nutrient: n.fr,
        value: Number(n.value),
        unit: n.unit,
      })),
    },
    cautions_en: labelData.cautions.map((c) => c.en),
    cautions_fr: labelData.cautions.map((c) => c.fr),
    instructions_en: labelData.instructions.map((i) => i.en),
    instructions_fr: labelData.instructions.map((i) => i.fr),
    ingredients_en: labelData.ingredients.map((i) => ({
      nutrient: i.en,
      value: Number(i.value),
      unit: i.unit,
    })),
    ingredients_fr: labelData.ingredients.map((i) => ({
      nutrient: i.fr,
      value: Number(i.value),
      unit: i.unit,
    })),
  };
}

export function mapLabelDataToInspectionUpdate(
  labelData: LabelData,
): InspectionUpdate {
  const org0 = labelData.organizations?.[0] || {};
  const org1 = labelData.organizations?.[1] || {};

  return {
    inspection_comment: labelData.comment,
    verified: labelData.confirmed,
    company: {
      name: org0.name?.value,
      address: org0.address?.value,
      website: org0.website?.value,
      phone_number: org0.phoneNumber?.value,
    },
    manufacturer: {
      name: org1.name?.value,
      address: org1.address?.value,
      website: org1.website?.value,
      phone_number: org1.phoneNumber?.value,
    },
    product: {
      name: labelData.baseInformation.name.value,
      registration_number: labelData.baseInformation.registrationNumber.value,
      lot_number: labelData.baseInformation.lotNumber.value,
      npk: labelData.baseInformation.npk.value,
      metrics: {
        weight: labelData.baseInformation.weight.quantities.map((q) => ({
          value: Number(q.value),
          unit: q.unit,
        })),
        density: {
          value:
            Number(labelData.baseInformation.density.quantities?.[0]?.value) ||
            null,
          unit: labelData.baseInformation.density.quantities?.[0]?.unit,
        },
        volume: {
          value:
            Number(labelData.baseInformation.volume.quantities?.[0]?.value) ||
            null,
          unit: labelData.baseInformation.volume.quantities?.[0]?.unit,
        },
      },
    },
    cautions: {
      en: labelData.cautions.map((c) => c.en),
      fr: labelData.cautions.map((c) => c.fr),
    },
    instructions: {
      en: labelData.instructions.map((i) => i.en),
      fr: labelData.instructions.map((i) => i.fr),
    },
    guaranteed_analysis: {
      title: {
        en: labelData.guaranteedAnalysis.titleEn.value,
        fr: labelData.guaranteedAnalysis.titleFr.value,
      },
      is_minimal: labelData.guaranteedAnalysis.isMinimal.value,
      en: labelData.guaranteedAnalysis.nutrients.map((n) => ({
        name: n.en,
        value: Number(n.value),
        unit: n.unit,
      })),
      fr: labelData.guaranteedAnalysis.nutrients.map((n) => ({
        name: n.fr,
        value: Number(n.value),
        unit: n.unit,
      })),
    },
  };
}
