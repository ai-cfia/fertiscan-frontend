import { Field, FieldStatus } from "./field";

export type Organization = {
  name: Field;
  address: Field;
  website: Field;
  phoneNumber: Field;
};

export const DEFAULT_ORGANIZATION: Organization = {
  name: {
    value: "",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  address: {
    value: "",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  website: {
    value: "",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  phoneNumber: {
    value: "",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
};

export const TEST_ORGANIZATION: Organization = {
  name: {
    value: "GreenGrow Inc.",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  address: {
    value: "123 Green Road, Farmville, State, 12345",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  website: {
    value: "https://www.greengrow.com",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  phoneNumber: {
    value: "123-456-7890",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
};

export type LabelData = {
  organizations: Organization[];
};

export const DEFAULT_LABEL_DATA: LabelData = {
  organizations: [DEFAULT_ORGANIZATION],
};

export const TEST_LABEL_DATA: LabelData = {
  organizations: [TEST_ORGANIZATION, TEST_ORGANIZATION],
};
