export enum FieldStatus {
  Verified = "verified",
  Unverified = "unverified",
  Error = "error",
}

type Field = {
  value: string;
  status: FieldStatus;
  errorMessage: string | null;
};

export default Field;
