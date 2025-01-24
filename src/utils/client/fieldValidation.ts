import { LabelData, VerifiedField } from "@/types/types";

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

export const isAllVerified = (labelData: LabelData): boolean => {
  const isOrganizationsVerified = labelData.organizations.every((org) =>
    checkFieldRecord(org),
  );
  const isBaseInformationVerified = checkFieldRecord(labelData.baseInformation);
  const isCautionsVerified = checkFieldArray(labelData.cautions);
  const isInstructionsVerified = checkFieldArray(labelData.instructions);
  const isGuaranteedAnalysisVerified =
    checkFieldRecord({
      titleEn: labelData.guaranteedAnalysis.titleEn,
      titleFr: labelData.guaranteedAnalysis.titleFr,
      isMinimal: labelData.guaranteedAnalysis.isMinimal,
    }) && checkFieldArray(labelData.guaranteedAnalysis.nutrients);
  const isIngredientsVerified = checkFieldArray(labelData.ingredients);
  return (
    isOrganizationsVerified &&
    isBaseInformationVerified &&
    isCautionsVerified &&
    isInstructionsVerified &&
    isGuaranteedAnalysisVerified &&
    isIngredientsVerified
  );
};
