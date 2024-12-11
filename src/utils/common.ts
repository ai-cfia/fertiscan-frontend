import { VerifiedField } from "@/types/types";
import { AxiosError } from "axios";

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
