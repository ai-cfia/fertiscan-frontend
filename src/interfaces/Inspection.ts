interface Inspection {
  "cautions": {
    "en": string[],
    "fr": string[],
  },
  "company": {
    "address": string|null,
    "id": string|null,
    "name": string|null,
    "phone_number": string|null,
    "website": string|null,
  },
  "first_aid": {
    "en": string[],
    "fr": string[],
  },
  "guaranteed_analysis": {
    "edited": boolean,
    "name": string|null,
    "unit": string|null,
    "value": number|null,
  }[],
  "ingredients": {
    "en": {
      "edited": boolean,
      "name": string|null,
      "unit": string|null,
      "value": string|null,
    }[],
    "fr":{
      "edited": boolean,
      "name": string|null,
      "unit": string|null,
      "value": string|null
    }[],
  },
  "inspection_id": string|null,
  "instructions": {
    "en": string[],
    "fr": string[]
  },
  "manufacturer": {
    "address": string|null,
    "id": string|null,
    "name": string|null,
    "phone_number": string|null,
    "website": string|null
  },
  "micronutrients": {
    "en": string[],
    "fr": string[]
  },
  "product": {
    "k": number|null,
    "label_id": string|null,
    "lot_number": string|null,
    "metrics": {
      "density": {
        "edited": boolean,
        "unit": string|null,
        "value": number|null
      },
      "volume": {
        "edited": boolean,
        "unit": string|null,
        "value": number|null
      },
      "weight": {
        "edited": boolean,
        "unit": string|null,
        "value": number|null
      }[]
    },
    "n": number|null,
    "name": string|null,
    "npk": string|null,
    "p": number|null,
    "registration_number": string|null,
    "warranty": string|null
  },
  "specifications": {
    "en": string[],
    "fr": string[]
  },
  "verified": boolean
}


export default Inspection;
