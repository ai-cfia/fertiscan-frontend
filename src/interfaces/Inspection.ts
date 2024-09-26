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

export interface Specification {
  humidity: number | null;
  ph: number | null;
  solubility: number | null;
  edited: boolean;
}

export interface LocalizedSpecifications {
  en: Specification[];
  fr: Specification[];
}

export interface OrganizationInformation {
  id: string | null;
  name: string | null;
  address: string | null;
  website: string | null;
  phone_number: string | null;
}
export interface GuaranteedAnalysis {
  title: string | null;
  nutrients: NamedValue[];
}

export default interface Inspection {
  inspection_id: string | null;
  verified: boolean;
  company: OrganizationInformation;
  manufacturer: OrganizationInformation;
  product: ProductInformation;
  cautions: LocalizedSubLabel;
  instructions: LocalizedSubLabel;
  micronutrients: LocalizedValues;
  ingredients: LocalizedValues;
  specifications: LocalizedSpecifications;
  first_aid: LocalizedSubLabel;
  inspection_comment: string | null;
  guaranteed_analysis_fr: GuaranteedAnalysis;
  guaranteed_analysis_en: GuaranteedAnalysis;
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

export const createDefaultSpecification = (): Specification => ({
  humidity: null,
  ph: null,
  solubility: null,
  edited: false,
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
  micronutrients: {
    en: [createDefaultNamedValue()],
    fr: [createDefaultNamedValue()],
  },
  ingredients: {
    en: [createDefaultNamedValue()],
    fr: [createDefaultNamedValue()],
  },
  specifications: {
    en: [createDefaultSpecification()],
    fr: [createDefaultSpecification()],
  },
  first_aid: { en: [], fr: [] },
  guaranteed_analysis_fr: {
    title: null,
    nutrients: [createDefaultNamedValue()],
  },
  guaranteed_analysis_en: {
    title: null,
    nutrients: [createDefaultNamedValue()],
  },
  inspection_comment: null,
});
