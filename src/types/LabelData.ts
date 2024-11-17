import Organization, {
  DEFAULT_ORGANIZATION,
  TEST_ORGANIZATION,
} from "./Organization";

export type LabelData = {
  organizations: Organization[];
};

export const DEFAULT_LABEL_DATA: LabelData = {
  organizations: [DEFAULT_ORGANIZATION],
};

export const TEST_LABEL_DATA: LabelData = {
  organizations: [TEST_ORGANIZATION, TEST_ORGANIZATION],
};
