import { BilingualField, LabelData, Quantity } from "@/types/types";
import {
  FertiscanDbMetadataInspectionValue,
  InspectionResponse,
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
        name: { value: data.organizations?.[0]?.name ?? "", verified: false },
        address: {
          value: data.organizations?.[0]?.address ?? "",
          verified: false,
        },
        website: {
          value: data.organizations?.[0]?.website ?? "",
          verified: false,
        },
        phoneNumber: {
          value: data.organizations?.[0]?.phone_number ?? "",
          verified: false,
        },
      },
      {
        name: { value: data.organizations?.[1]?.name ?? "", verified: false },
        address: {
          value: data.organizations?.[1]?.address ?? "",
          verified: false,
        },
        website: {
          value: data.organizations?.[1]?.website ?? "",
          verified: false,
        },
        phoneNumber: {
          value: data.organizations?.[1]?.phone_number ?? "",
          verified: false,
        },
      },
    ],
    baseInformation: {
      name: { value: data.fertiliser_name ?? "", verified: false },
      registrationNumber: {
        value: data.registration_number?.[0]?.identifier ?? "",
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

export function mapInspectionToLabelData(
  inspection: InspectionResponse,
): LabelData {
  const v = inspection.verified ?? false;
  return {
    organizations: (inspection.organizations ?? []).map((org) => ({
      name: { value: org.name ?? "", verified: v },
      address: { value: org.address ?? "", verified: v },
      website: { value: org.website ?? "", verified: v },
      phoneNumber: { value: org.phone_number ?? "", verified: v },
    })),
    baseInformation: {
      name: { value: inspection.product.name ?? "", verified: v },
      registrationNumber: {
        value:
          inspection.product.registration_numbers?.[0]?.registration_number ??
          "",
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
      inspection.ingredients?.en,
      inspection.ingredients?.fr,
      v,
    ),
    confirmed: inspection.verified ?? false,
    inspectionId: inspection.inspection_id,
    comment: inspection.inspection_comment ?? "",
  };
}

export function mapLabelDataToLabelDataInput(
  labelData: LabelData,
): LabelDataInput {
  return {
    organizations: (labelData.organizations || []).map((org) => ({
      name: org.name?.value,
      address: org.address?.value,
      website: org.website?.value,
      phone_number: org.phoneNumber?.value,
    })),
    fertiliser_name: labelData.baseInformation.name.value,
    registration_number: [
      {
        identifier: labelData.baseInformation.registrationNumber.value,
      },
    ],
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
  return {
    inspection_comment: labelData.comment,
    verified: labelData.confirmed,
    organizations: labelData.organizations?.map((org) => ({
      name: org.name?.value,
      address: org.address?.value,
      website: org.website?.value,
      phone_number: org.phoneNumber?.value,
    })),
    product: {
      name: labelData.baseInformation.name.value,
      registration_numbers: [
        {
          registration_number:
            labelData.baseInformation.registrationNumber.value,
        },
      ],
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
          unit: labelData.baseInformation.density.quantities?.[0]?.unit || null,
        },
        volume: {
          value:
            Number(labelData.baseInformation.volume.quantities?.[0]?.value) ||
            null,
          unit: labelData.baseInformation.volume.quantities?.[0]?.unit || null,
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
    ingredients: {
      en: labelData.ingredients.map((i) => ({
        name: i.en,
        value: Number(i.value),
        unit: i.unit,
      })),
      fr: labelData.ingredients.map((i) => ({
        name: i.fr,
        value: Number(i.value),
        unit: i.unit,
      })),
    },
    inspection_id: labelData.inspectionId,
  };
}
