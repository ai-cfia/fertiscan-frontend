export interface Inspection {
  cautions: {
    en: string[];
    fr: string[];
  };
  company: {
    address: string | null;
    id: string | null;
    name: string | null;
    phone_number: string | null;
    website: string | null;
  };
  first_aid: {
    en: string[];
    fr: string[];
  };
  guaranteed_analysis: {
    edited: boolean;
    name: string | null;
    unit: string | null;
    value: number | null;
  }[];
  ingredients: {
    en: {
      edited: boolean;
      name: string | null;
      unit: string | null;
      value: string | null;
    }[];
    fr: {
      edited: boolean;
      name: string | null;
      unit: string | null;
      value: string | null;
    }[];
  };
  inspection_id: string | null;
  instructions: {
    en: string[];
    fr: string[];
  };
  manufacturer: {
    address: string | null;
    id: string | null;
    name: string | null;
    phone_number: string | null;
    website: string | null;
  };
  micronutrients: {
    en: {
      edited: boolean;
      name: string | null;
      unit: string | null;
      value: number | null;
    }[];
    fr: {
      edited: boolean;
      name: string | null;
      unit: string | null;
      value: number | null;
    }[];
  };
  product: {
    k: number | null;
    label_id: string | null;
    lot_number: string | null;
    metrics: {
      density: {
        edited: boolean;
        unit: string | null;
        value: number | null;
      };
      volume: {
        edited: boolean;
        unit: string | null;
        value: number | null;
      };
      weight: {
        edited: boolean;
        unit: string | null;
        value: number | null;
      }[];
    };
    n: number | null;
    name: string | null;
    npk: string | null;
    p: number | null;
    registration_number: string | null;
    warranty: string | null;
  };
  specifications: {
    en: {
      edited: boolean;
      ph: number | null;
      solubility: number | null;
      humidity: number | null;
    }[];
    fr: {
      edited: boolean;
      ph: number | null;
      solubility: number | null;
      humidity: number | null;
    }[];
  };
  verified: boolean;
}

export function emptyInspection() {
  return {
    cautions: {
      en: [],
      fr: [],
    },
    company: {
      address: "",
      id: "",
      name: "",
      phone_number: "",
      website: "",
    },
    first_aid: {
      en: [],
      fr: [],
    },
    guaranteed_analysis: [],
    ingredients: {
      en: [],
      fr: [],
    },
    inspection_id: "",
    instructions: {
      en: [],
      fr: [],
    },
    manufacturer: {
      address: "",
      id: "",
      name: "",
      phone_number: "",
      website: "",
    },
    micronutrients: {
      en: [
        {
          edited: false,
          name: "",
          unit: "",
          value: null,
        },
      ],
      fr: [
        {
          edited: false,
          name: "",
          unit: "",
          value: null,
        },
      ],
    },
    product: {
      k: null,
      label_id: "",
      lot_number: "",
      metrics: {
        density: {
          edited: false,
          unit: "",
          value: null,
        },
        volume: {
          edited: false,
          unit: "",
          value: null,
        },
        weight: [
          {
            edited: false,
            unit: "",
            value: null,
          },
        ],
      },
      n: null,
      name: "",
      npk: "",
      p: null,
      registration_number: "",
      warranty: "",
    },
    specifications: {
      en: [
        {
          edited: false,
          ph: null,
          solubility: null,
          humidity: null,
        },
      ],
      fr: [
        {
          edited: false,
          ph: null,
          solubility: null,
          humidity: null,
        },
      ],
    },
    verified: false,
  };
}

export default Inspection;
