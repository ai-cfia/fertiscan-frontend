export enum FieldStatus {
  Verified = "verified",
  Unverified = "unverified",
  Error = "error",
}

export type Field = {
  value: string;
  status: FieldStatus;
  errorMessage: string | null;
};
