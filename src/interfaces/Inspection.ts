export interface Value {
  value: number | null;
  unit: string | null;
  edited: boolean;
}

export interface NamedValue extends Value {
  name: string | null;
}

export interface LocalizedValues {
  en: NamedValue[];
  fr: NamedValue[];
}

export interface LocalizedSubLabel {
  en: string[];
  fr: string[];
}

export interface Metrics {
  weight: Value[];
  volume: Value;
  density: Value;
}

export interface ProductInformation {
  name: string | null;
  label_id: string | null;
  registration_number: string | null;
  lot_number: string | null;
  metrics: Metrics;
  npk: string | null;
  warranty: string | null;
  n: number | null;
  p: number | null;
  k: number | null;
}

export interface OrganizationInformation {
  id: string | null;
  name: string | null;
  address: string | null;
  website: string | null;
  phone_number: string | null;
}

export interface Title {
  en: string | null;
  fr: string | null;
}

export interface GuaranteedAnalysis {
  title: Title;
  en: NamedValue[];
  fr: NamedValue[];
}

export default interface Inspection {
  inspection_id: string | null;
  verified: boolean;
  company: OrganizationInformation;
  manufacturer: OrganizationInformation;
  product: ProductInformation;
  cautions: LocalizedSubLabel;
  instructions: LocalizedSubLabel;
  ingredients: LocalizedValues;
  inspection_comment: string | null;
  guaranteed_analysis: GuaranteedAnalysis;
}

export const createDefaultValue = (): Value => ({
  value: null,
  unit: null,
  edited: false,
});

export const createDefaultNamedValue = (): NamedValue => ({
  name: null,
  value: null,
  unit: null,
  edited: false,
});

export const createDefaultTitle = (): Title => ({
  en: null,
  fr: null,
});

export const createDefaultInspection = (): Inspection => ({
  inspection_id: null,
  verified: false,
  company: {
    id: null,
    name: null,
    address: null,
    website: null,
    phone_number: null,
  },
  manufacturer: {
    id: null,
    name: null,
    address: null,
    website: null,
    phone_number: null,
  },
  product: {
    name: null,
    label_id: null,
    registration_number: null,
    lot_number: null,
    metrics: {
      weight: [createDefaultValue()],
      volume: createDefaultValue(),
      density: createDefaultValue(),
    },
    npk: null,
    warranty: null,
    n: null,
    p: null,
    k: null,
  },
  cautions: { en: [], fr: [] },
  instructions: { en: [], fr: [] },
  ingredients: {
    en: [createDefaultNamedValue()],
    fr: [createDefaultNamedValue()],
  },
  guaranteed_analysis: {
    title: createDefaultTitle(),
    en: [createDefaultNamedValue()],
    fr: [createDefaultNamedValue()],
  },
  inspection_comment: null,
});
