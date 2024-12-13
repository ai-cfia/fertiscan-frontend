import { VerifiedField } from "@/types/types";

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
