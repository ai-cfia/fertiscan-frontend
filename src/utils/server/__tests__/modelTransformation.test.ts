import { LabelData } from "@/types/types";
import {
  FertiscanDbMetadataInspectionValue,
  InspectionResponse,
  LabelDataOutput,
  NutrientValue,
  PipelineInspectionValue,
} from "../backend";
import {
  mapInspectionToLabelData,
  mapLabelDataOutputToLabelData,
  mapLabelDataToInspectionUpdate,
  mapLabelDataToLabelDataInput,
  quantity,
  verifiedItemPairInspectionValue,
  verifiedItemPairNutrientValue,
  verifiedTranslations,
} from "../modelTransformation";

describe("quantity", () => {
  it("should handle a valid PipelineInspectionValue", () => {
    const val: PipelineInspectionValue = { value: 10, unit: "kg" };
    const result = quantity(val);
    expect(result).toEqual({ value: "10", unit: "kg" });
  });

  it("should return empty strings if val is undefined", () => {
    const result = quantity(undefined);
    expect(result).toEqual({ value: "", unit: "" });
  });

  it("should return empty strings if val is null", () => {
    const result = quantity(null);
    expect(result).toEqual({ value: "", unit: "" });
  });

  it("should convert null value to empty string", () => {
    const val: PipelineInspectionValue = { value: null, unit: "kg" };
    const result = quantity(val);
    expect(result).toEqual({ value: "", unit: "kg" });
  });
});

describe("verifiedTranslations", () => {
  it("should pair up en and fr translations", () => {
    const enList = ["Hello", "Goodbye"];
    const frList = ["Bonjour", "Au revoir"];
    const result = verifiedTranslations(enList, frList);
    expect(result).toEqual([
      { en: "Hello", fr: "Bonjour", verified: false },
      { en: "Goodbye", fr: "Au revoir", verified: false },
    ]);
  });

  it("should handle missing fr translations", () => {
    const enList = ["Hello"];
    const frList = undefined;
    const result = verifiedTranslations(enList, frList);
    expect(result).toEqual([{ en: "Hello", fr: "", verified: false }]);
  });

  it("should return an empty array if enList is undefined", () => {
    const result = verifiedTranslations(undefined, ["Bonjour"]);
    expect(result).toEqual([]);
  });

  it("should handle null arrays gracefully", () => {
    const result = verifiedTranslations(null, null);
    expect(result).toEqual([]);
  });

  it("should handle individual null items", () => {
    const enList = [null, "Hi"];
    const frList = ["Salut", null];
    const result = verifiedTranslations(enList, frList);
    expect(result).toEqual([
      { en: "", fr: "Salut", verified: false },
      { en: "Hi", fr: "", verified: false },
    ]);
  });
});

describe("verifiedItemPairNutrientValue", () => {
  it("should pair up nutrient items correctly", () => {
    const enList: NutrientValue[] = [
      { nutrient: "Nitrogen", value: 10, unit: "%" },
      { nutrient: "Phosphorus", value: 5, unit: "%" },
    ];
    const frList: NutrientValue[] = [
      { nutrient: "Azote", value: 10, unit: "%" },
      { nutrient: "Phosphore", value: 5, unit: "%" },
    ];
    const result = verifiedItemPairNutrientValue(enList, frList);
    expect(result).toEqual([
      { en: "Nitrogen", fr: "Azote", value: "10", unit: "%", verified: false },
      {
        en: "Phosphorus",
        fr: "Phosphore",
        value: "5",
        unit: "%",
        verified: false,
      },
    ]);
  });

  it("should handle null or undefined lists", () => {
    const result = verifiedItemPairNutrientValue(undefined, undefined);
    expect(result).toEqual([]);
  });

  it("should handle items where frList is shorter", () => {
    const enList: NutrientValue[] = [{ nutrient: "Nitrogen", value: 10 }];
    const frList: NutrientValue[] = [];
    const result = verifiedItemPairNutrientValue(enList, frList);
    expect(result).toEqual([
      { en: "Nitrogen", fr: "", value: "10", unit: "", verified: false },
    ]);
  });

  it("should handle null items", () => {
    const enList: NutrientValue[] = [{ nutrient: "", value: null, unit: null }];
    const frList: NutrientValue[] = [{ nutrient: "", value: null, unit: null }];
    const result = verifiedItemPairNutrientValue(enList, frList);
    expect(result).toEqual([
      { en: "", fr: "", value: "", unit: "", verified: false },
    ]);
  });
});

describe("verifiedItemPairInspectionValue", () => {
  it("should pair up inspection items correctly", () => {
    const enList: FertiscanDbMetadataInspectionValue[] = [
      { name: "Fish meal", value: 50, unit: "g" },
      { name: "Bone meal", value: 50, unit: "g" },
    ];
    const frList: FertiscanDbMetadataInspectionValue[] = [
      { name: "Farine de poisson", value: 50, unit: "g" },
      { name: "Farine d'os", value: 50, unit: "g" },
    ];
    const result = verifiedItemPairInspectionValue(enList, frList);
    expect(result).toEqual([
      {
        en: "Fish meal",
        fr: "Farine de poisson",
        value: "50",
        unit: "g",
        verified: false,
      },
      {
        en: "Bone meal",
        fr: "Farine d'os",
        value: "50",
        unit: "g",
        verified: false,
      },
    ]);
  });

  it("should handle null or undefined lists", () => {
    const result = verifiedItemPairInspectionValue(undefined, undefined);
    expect(result).toEqual([]);
  });

  it("should handle items where frList is shorter", () => {
    const enList: FertiscanDbMetadataInspectionValue[] = [
      { name: "Fish meal", value: 50 },
    ];
    const frList: FertiscanDbMetadataInspectionValue[] = [];
    const result = verifiedItemPairInspectionValue(enList, frList);
    expect(result).toEqual([
      { en: "Fish meal", fr: "", value: "50", unit: "", verified: false },
    ]);
  });

  it("should handle null items", () => {
    const enList: FertiscanDbMetadataInspectionValue[] = [
      { name: "", value: null, unit: null },
    ];
    const frList: FertiscanDbMetadataInspectionValue[] = [
      { name: "", value: null, unit: null },
    ];
    const result = verifiedItemPairInspectionValue(enList, frList);
    expect(result).toEqual([
      { en: "", fr: "", value: "", unit: "", verified: false },
    ]);
  });
});

describe("mapLabelDataOutputToLabelData", () => {
  it("should map all data correctly", () => {
    const input: LabelDataOutput = {
      organizations: [
        {
          name: "Company Inc.",
          address: "123 Street",
          website: "http://example.com",
          phone_number: "123-456-7890",
        },
        {
          name: "Mfg Corp.",
          address: "456 Road",
          website: "http://mfg.com",
          phone_number: "987-654-3210",
        },
      ],
      fertiliser_name: "SuperGrow",
      registration_number: [{ identifier: "1234567A", type: null }],
      lot_number: "LOT42",
      npk: "10-5-5",
      weight: [{ value: 20, unit: "kg" }],
      density: { value: 1.2, unit: "g/cm³" },
      volume: { value: 5, unit: "L" },
      cautions_en: ["Keep away from children"],
      cautions_fr: ["Tenir loin des enfants"],
      instructions_en: ["Apply generously", "Water thoroughly"],
      instructions_fr: ["Appliquer généreusement", "Arroser abondamment"],
      guaranteed_analysis_en: {
        title: "Guaranteed Analysis",
        is_minimal: true,
        nutrients: [
          { nutrient: "Nitrogen", value: 10, unit: "%" },
          { nutrient: "Phosphorus", value: 5, unit: "%" },
        ],
      },
      guaranteed_analysis_fr: {
        title: "Analyse Garantie",
        is_minimal: false,
        nutrients: [
          { nutrient: "Azote", value: 10, unit: "%" },
          { nutrient: "Phosphore", value: 5, unit: "%" },
        ],
      },
      ingredients_en: [
        { nutrient: "Fish meal", value: 50, unit: "g" },
        { nutrient: "Bone meal", value: 50, unit: "g" },
      ],
      ingredients_fr: [
        { nutrient: "Farine de poisson", value: 50, unit: "g" },
        { nutrient: "Farine d'os", value: 50, unit: "g" },
      ],
    };

    const result = mapLabelDataOutputToLabelData(input);

    // Organizations
    expect(result.organizations).toHaveLength(2);
    input.organizations!.forEach((org, index) => {
      expect(result.organizations[index].name.value).toBe(org.name);
      expect(result.organizations[index].address.value).toBe(org.address);
      expect(result.organizations[index].website.value).toBe(org.website);
      expect(result.organizations[index].phoneNumber.value).toBe(
        org.phone_number,
      );
    });

    // Base Information
    expect(result.baseInformation.name.value).toBe(input.fertiliser_name);
    expect(result.baseInformation.registrationNumber.value).toBe(
      input.registration_number![0].identifier,
    );
    expect(result.baseInformation.lotNumber.value).toBe(input.lot_number);
    expect(result.baseInformation.npk.value).toBe(input.npk);
    expect(result.baseInformation.weight.quantities).toEqual(
      input.weight!.map((w) => ({ value: w.value!.toString(), unit: w.unit })),
    );
    expect(result.baseInformation.density.quantities).toEqual([
      { value: input.density!.value!.toString(), unit: input.density!.unit },
    ]);
    expect(result.baseInformation.volume.quantities).toEqual([
      { value: input.volume!.value!.toString(), unit: input.volume!.unit },
    ]);

    // Cautions & Instructions
    expect(result.cautions).toEqual(
      input.cautions_en!.map((en, i) => ({
        en,
        fr: input.cautions_fr![i],
        verified: false,
      })),
    );
    expect(result.instructions).toEqual(
      input.instructions_en!.map((en, i) => ({
        en,
        fr: input.instructions_fr![i],
        verified: false,
      })),
    );

    // Guaranteed Analysis
    expect(result.guaranteedAnalysis.titleEn.value).toBe(
      input.guaranteed_analysis_en!.title,
    );
    expect(result.guaranteedAnalysis.titleFr.value).toBe(
      input.guaranteed_analysis_fr!.title,
    );
    expect(result.guaranteedAnalysis.isMinimal.value).toBe(
      input.guaranteed_analysis_en!.is_minimal,
    );
    expect(result.guaranteedAnalysis.nutrients).toEqual(
      input.guaranteed_analysis_en!.nutrients!.map((nutrient, i) => ({
        en: nutrient.nutrient,
        fr: input.guaranteed_analysis_fr!.nutrients![i].nutrient,
        value: nutrient.value!.toString(),
        unit: nutrient.unit,
        verified: false,
      })),
    );

    // Ingredients
    expect(result.ingredients).toEqual(
      input.ingredients_en!.map((ingredient, i) => ({
        en: ingredient.nutrient,
        fr: input.ingredients_fr![i].nutrient,
        value: ingredient.value!.toString(),
        unit: ingredient.unit,
        verified: false,
      })),
    );
  });

  it("should handle missing fields gracefully", () => {
    const input: LabelDataOutput = {};
    const result = mapLabelDataOutputToLabelData(input);

    // Organizations
    expect(result.organizations[0].name.value).toBe("");
    expect(result.organizations[0].address.value).toBe("");
    expect(result.organizations[0].website.value).toBe("");
    expect(result.organizations[0].phoneNumber.value).toBe("");

    expect(result.organizations[1].name.value).toBe("");
    expect(result.organizations[1].address.value).toBe("");
    expect(result.organizations[1].website.value).toBe("");
    expect(result.organizations[1].phoneNumber.value).toBe("");

    // Base Information
    expect(result.baseInformation.name.value).toBe("");
    expect(result.baseInformation.registrationNumber.value).toBe("");
    expect(result.baseInformation.lotNumber.value).toBe("");
    expect(result.baseInformation.npk.value).toBe("");
    expect(result.baseInformation.weight.quantities).toEqual([]);
    expect(result.baseInformation.density.quantities).toEqual([
      { value: "", unit: "" },
    ]);
    expect(result.baseInformation.volume.quantities).toEqual([
      { value: "", unit: "" },
    ]);

    // Cautions, instructions
    expect(result.cautions).toEqual([]);
    expect(result.instructions).toEqual([]);

    // Guaranteed Analysis
    expect(result.guaranteedAnalysis.titleEn.value).toBe("");
    expect(result.guaranteedAnalysis.titleFr.value).toBe("");
    expect(result.guaranteedAnalysis.isMinimal.value).toBe(false);
    expect(result.guaranteedAnalysis.nutrients).toEqual([]);

    // Ingredients
    expect(result.ingredients).toEqual([]);
  });
});

const emptyInspection: InspectionResponse = {
  inspection_id: "",
  inspector_id: null,
  picture_set_id: "",
  inspection_comment: null,
  verified: true,
  organizations: null,
  product: {
    name: null,
    label_id: null,
    lot_number: null,
    metrics: {
      weight: [],
      density: null,
      volume: null,
    },
    npk: null,
    warranty: null,
    n: null,
    p: null,
    k: null,
    verified: null,
    registration_numbers: null,
    record_keeping: null,
  },
  cautions: { en: [], fr: [] },
  instructions: { en: [], fr: [] },
  guaranteed_analysis: {
    title: { en: "", fr: "" },
    is_minimal: false,
    en: [],
    fr: [],
  },
  ingredients: {
    en: [],
    fr: [],
  },
};

describe("mapInspectionToLabelData", () => {
  it("should map all data correctly", () => {
    const input: InspectionResponse = {
      inspection_id: "INS123",
      inspector_id: null,
      picture_set_id: "PIC123",
      inspection_comment: "comment",
      verified: false,
      organizations: [
        {
          name: "Company Inc.",
          address: "123 Street",
          website: "http://example.com",
          phone_number: "123-456-7890",
        },
        {
          name: "Mfg Corp.",
          address: "456 Road",
          website: "http://mfg.com",
          phone_number: "987-654-3210",
        },
      ],
      product: {
        name: "SuperGrow",
        label_id: null,
        lot_number: "LOT42",
        npk: "10-5-5",
        metrics: {
          weight: [{ value: 20, unit: "kg" }],
          density: { value: 1.2, unit: "g/cm³" },
          volume: { value: 5, unit: "L" },
        },
        n: 10,
        p: 5,
        k: null,
        verified: true,
        registration_numbers: [
          {
            registration_number: "1234567A",
            is_an_ingredient: false,
            edited: false,
          },
        ],
        record_keeping: true,
      },
      cautions: {
        en: ["Keep away from children"],
        fr: ["Tenir loin des enfants"],
      },
      instructions: {
        en: ["Apply generously", "Water thoroughly"],
        fr: ["Appliquer généreusement", "Arroser abondamment"],
      },
      guaranteed_analysis: {
        title: { en: "Guaranteed Analysis", fr: "Analyse Garantie" },
        is_minimal: true,
        en: [
          { name: "Nitrogen", value: 10, unit: "%" },
          { name: "Phosphorus", value: 5, unit: "%" },
        ],
        fr: [
          { name: "Azote", value: 10, unit: "%" },
          { name: "Phosphore", value: 5, unit: "%" },
        ],
      },
      ingredients: {
        en: [{ name: "Nitrogen", value: 10, unit: "%" }],
        fr: [{ name: "Azote", value: 10, unit: "%" }],
      },
    };

    const result = mapInspectionToLabelData(input);

    expect(result.organizations.length).toBe(2);

    expect(result.organizations[0].name.value).toBe("Company Inc.");
    expect(result.organizations[0].address.value).toBe("123 Street");
    expect(result.organizations[0].website.value).toBe("http://example.com");
    expect(result.organizations[0].phoneNumber.value).toBe("123-456-7890");

    expect(result.organizations[1].name.value).toBe("Mfg Corp.");
    expect(result.organizations[1].address.value).toBe("456 Road");
    expect(result.organizations[1].website.value).toBe("http://mfg.com");
    expect(result.organizations[1].phoneNumber.value).toBe("987-654-3210");

    expect(result.baseInformation.name.value).toBe("SuperGrow");
    expect(result.baseInformation.registrationNumber.value).toBe("1234567A");
    expect(result.baseInformation.lotNumber.value).toBe("LOT42");
    expect(result.baseInformation.npk.value).toBe("10-5-5");

    expect(result.baseInformation.weight.quantities).toEqual([
      { value: "20", unit: "kg" },
    ]);

    expect(result.baseInformation.density.quantities).toEqual([
      { value: "1.2", unit: "g/cm³" },
    ]);

    expect(result.baseInformation.volume.quantities).toEqual([
      { value: "5", unit: "L" },
    ]);

    expect(result.cautions).toEqual([
      {
        en: "Keep away from children",
        fr: "Tenir loin des enfants",
        verified: false,
      },
    ]);

    expect(result.instructions).toEqual([
      {
        en: "Apply generously",
        fr: "Appliquer généreusement",
        verified: false,
      },
      { en: "Water thoroughly", fr: "Arroser abondamment", verified: false },
    ]);

    expect(result.guaranteedAnalysis.titleEn.value).toBe("Guaranteed Analysis");
    expect(result.guaranteedAnalysis.titleFr.value).toBe("Analyse Garantie");
    expect(result.guaranteedAnalysis.isMinimal.value).toBe(true);

    expect(result.guaranteedAnalysis.nutrients).toEqual([
      { en: "Nitrogen", fr: "Azote", value: "10", unit: "%", verified: false },
      {
        en: "Phosphorus",
        fr: "Phosphore",
        value: "5",
        unit: "%",
        verified: false,
      },
    ]);

    expect(result.ingredients).toEqual([
      { en: "Nitrogen", fr: "Azote", value: "10", unit: "%", verified: false },
    ]);

    expect(result.confirmed).toBe(false);
    expect(result.comment).toBe("comment");
    expect(result.pictureSetId).toBe("PIC123");
  });

  it("should handle missing fields gracefully", () => {
    const result = mapInspectionToLabelData(emptyInspection);
    expect(result.organizations).toEqual([]);
    expect(result.baseInformation.name.value).toBe("");
    expect(result.baseInformation.registrationNumber.value).toBe("");
    expect(result.baseInformation.lotNumber.value).toBe("");
    expect(result.baseInformation.npk.value).toBe("");
    expect(result.baseInformation.weight.quantities).toEqual([]);
    expect(result.baseInformation.density.quantities).toEqual([
      { value: "", unit: "" },
    ]);
    expect(result.baseInformation.volume.quantities).toEqual([
      { value: "", unit: "" },
    ]);
    expect(result.cautions).toEqual([]);
    expect(result.instructions).toEqual([]);
    expect(result.guaranteedAnalysis.titleEn.value).toBe("");
    expect(result.guaranteedAnalysis.titleFr.value).toBe("");
    expect(result.guaranteedAnalysis.isMinimal.value).toBe(false);
    expect(result.guaranteedAnalysis.nutrients).toEqual([]);
    expect(result.ingredients).toEqual([]);
    expect(result.pictureSetId).toBe("");
  });

  it("sets all fields as verified if inspection is verified", () => {
    const result = mapInspectionToLabelData(emptyInspection);
    expect(result.organizations).toEqual([]);
    expect(result.baseInformation.name.verified).toBe(true);
    expect(result.baseInformation.registrationNumber.verified).toBe(true);
    expect(result.baseInformation.lotNumber.verified).toBe(true);
    expect(result.baseInformation.npk.verified).toBe(true);
    expect(result.baseInformation.weight.verified).toBe(true);
    expect(result.baseInformation.density.verified).toBe(true);
    expect(result.baseInformation.volume.verified).toBe(true);
    expect(result.guaranteedAnalysis.titleEn.verified).toBe(true);
    expect(result.guaranteedAnalysis.titleFr.verified).toBe(true);
    expect(result.guaranteedAnalysis.isMinimal.verified).toBe(true);
    expect(result.cautions.every((caution) => caution.verified)).toBe(true);
    expect(
      result.instructions.every((instruction) => instruction.verified),
    ).toBe(true);
    expect(
      result.guaranteedAnalysis.nutrients.every(
        (nutrient) => nutrient.verified,
      ),
    ).toBe(true);
    expect(result.ingredients.every((ingredient) => ingredient.verified)).toBe(
      true,
    );
  });
});

const labelData: LabelData = {
  organizations: [
    {
      name: { value: "Company Inc.", verified: false },
      address: { value: "123 Street", verified: false },
      website: { value: "http://example.com", verified: false },
      phoneNumber: { value: "123-456-7890", verified: false },
    },
    {
      name: { value: "Mfg Corp.", verified: false },
      address: { value: "456 Road", verified: false },
      website: { value: "http://mfg.com", verified: false },
      phoneNumber: { value: "987-654-3210", verified: false },
    },
  ],
  baseInformation: {
    name: { value: "SuperGrow", verified: false },
    registrationNumber: { value: "1234567A", verified: false },
    lotNumber: { value: "LOT42", verified: false },
    npk: { value: "10-5-5", verified: false },
    weight: { quantities: [{ value: "20", unit: "kg" }], verified: false },
    density: {
      quantities: [{ value: "1.2", unit: "g/cm³" }],
      verified: false,
    },
    volume: { quantities: [{ value: "5", unit: "L" }], verified: false },
  },
  guaranteedAnalysis: {
    titleEn: { value: "Guaranteed Analysis", verified: false },
    titleFr: { value: "Analyse Garantie", verified: false },
    isMinimal: { value: true, verified: false },
    nutrients: [
      {
        en: "Nitrogen",
        fr: "Azote",
        value: "10",
        unit: "%",
        verified: false,
      },
      {
        en: "Phosphorus",
        fr: "Phosphore",
        value: "5",
        unit: "%",
        verified: false,
      },
    ],
  },
  cautions: [
    {
      en: "Keep away from children",
      fr: "Tenir loin des enfants",
      verified: false,
    },
  ],
  instructions: [
    {
      en: "Apply generously",
      fr: "Appliquer généreusement",
      verified: false,
    },
    { en: "Water thoroughly", fr: "Arroser abondamment", verified: false },
  ],
  ingredients: [
    {
      en: "Fish meal",
      fr: "Farine de poisson",
      value: "50",
      unit: "g",
      verified: false,
    },
    {
      en: "Bone meal",
      fr: "Farine d'os",
      value: "50",
      unit: "g",
      verified: false,
    },
  ],
  confirmed: false,
  comment: "InspectionResponse passed with minor issues",
  pictureSetId: "PIC123",
};

const emptyLabelData: LabelData = {
  organizations: [],
  baseInformation: {
    name: { value: "", verified: false },
    registrationNumber: { value: "", verified: false },
    lotNumber: { value: "", verified: false },
    npk: { value: "", verified: false },
    weight: { quantities: [], verified: false },
    density: { quantities: [], verified: false },
    volume: { quantities: [], verified: false },
  },
  guaranteedAnalysis: {
    titleEn: { value: "", verified: false },
    titleFr: { value: "", verified: false },
    isMinimal: { value: false, verified: false },
    nutrients: [],
  },
  cautions: [],
  instructions: [],
  ingredients: [],
  confirmed: false,
  comment: "",
};

describe("mapLabelDataToLabelDataInput", () => {
  it("should map all fields correctly", () => {
    const result = mapLabelDataToLabelDataInput(labelData);
    expect(result.organizations).toEqual([
      {
        name: "Company Inc.",
        address: "123 Street",
        website: "http://example.com",
        phone_number: "123-456-7890",
      },
      {
        name: "Mfg Corp.",
        address: "456 Road",
        website: "http://mfg.com",
        phone_number: "987-654-3210",
      },
    ]);
    expect(result.fertiliser_name).toBe("SuperGrow");
    expect(result.registration_number).toEqual([{ identifier: "1234567A" }]);
    expect(result.lot_number).toBe("LOT42");
    expect(result.npk).toBe("10-5-5");
    expect(result.weight).toEqual([{ value: 20, unit: "kg" }]);
    expect(result.density).toEqual({ value: 1.2, unit: "g/cm³" });
    expect(result.volume).toEqual({ value: 5, unit: "L" });
    expect(result.guaranteed_analysis_en).toEqual({
      title: "Guaranteed Analysis",
      is_minimal: true,
      nutrients: [
        { nutrient: "Nitrogen", value: 10, unit: "%" },
        { nutrient: "Phosphorus", value: 5, unit: "%" },
      ],
    });
    expect(result.guaranteed_analysis_fr).toEqual({
      title: "Analyse Garantie",
      is_minimal: true,
      nutrients: [
        { nutrient: "Azote", value: 10, unit: "%" },
        { nutrient: "Phosphore", value: 5, unit: "%" },
      ],
    });
    expect(result.cautions_en).toEqual(["Keep away from children"]);
    expect(result.cautions_fr).toEqual(["Tenir loin des enfants"]);
    expect(result.instructions_en).toEqual([
      "Apply generously",
      "Water thoroughly",
    ]);
    expect(result.instructions_fr).toEqual([
      "Appliquer généreusement",
      "Arroser abondamment",
    ]);
    expect(result.ingredients_en).toEqual([
      { nutrient: "Fish meal", value: 50, unit: "g" },
      { nutrient: "Bone meal", value: 50, unit: "g" },
    ]);
    expect(result.ingredients_fr).toEqual([
      { nutrient: "Farine de poisson", value: 50, unit: "g" },
      { nutrient: "Farine d'os", value: 50, unit: "g" },
    ]);
  });

  it("should handle empty arrays gracefully", () => {
    const result = mapLabelDataToLabelDataInput(emptyLabelData);
    expect(result.organizations).toEqual([]);
    expect(result.fertiliser_name).toBe("");
    expect(result.registration_number).toEqual([{ identifier: "" }]);
    expect(result.lot_number).toBe("");
    expect(result.npk).toBe("");
    expect(result.weight).toEqual([]);
    expect(result.density).toEqual({ value: null, unit: null });
    expect(result.volume).toEqual({ value: null, unit: null });
    expect(result.guaranteed_analysis_en).toEqual({
      title: "",
      is_minimal: false,
      nutrients: [],
    });
    expect(result.guaranteed_analysis_fr).toEqual({
      title: "",
      is_minimal: false,
      nutrients: [],
    });
    expect(result.cautions_en).toEqual([]);
    expect(result.cautions_fr).toEqual([]);
    expect(result.instructions_en).toEqual([]);
    expect(result.instructions_fr).toEqual([]);
    expect(result.ingredients_en).toEqual([]);
    expect(result.ingredients_fr).toEqual([]);
  });
});

describe("mapLabelDataToInspectionUpdate", () => {
  it("should map all fields correctly", () => {
    const result = mapLabelDataToInspectionUpdate(labelData);

    expect(result.inspection_comment).toBe(
      "InspectionResponse passed with minor issues",
    );
    expect(result.verified).toBe(false);
    expect(result.organizations).toEqual([
      {
        name: "Company Inc.",
        address: "123 Street",
        website: "http://example.com",
        phone_number: "123-456-7890",
      },
      {
        name: "Mfg Corp.",
        address: "456 Road",
        website: "http://mfg.com",
        phone_number: "987-654-3210",
      },
    ]);
    expect(result.product).toEqual({
      name: "SuperGrow",
      registration_numbers: [{ registration_number: "1234567A" }],
      lot_number: "LOT42",
      npk: "10-5-5",
      metrics: {
        weight: [{ value: 20, unit: "kg" }],
        density: { value: 1.2, unit: "g/cm³" },
        volume: { value: 5, unit: "L" },
      },
    });
    expect(result.cautions).toEqual({
      en: ["Keep away from children"],
      fr: ["Tenir loin des enfants"],
    });
    expect(result.instructions).toEqual({
      en: ["Apply generously", "Water thoroughly"],
      fr: ["Appliquer généreusement", "Arroser abondamment"],
    });
    expect(result.guaranteed_analysis).toEqual({
      title: { en: "Guaranteed Analysis", fr: "Analyse Garantie" },
      is_minimal: true,
      en: [
        { name: "Nitrogen", value: 10, unit: "%" },
        { name: "Phosphorus", value: 5, unit: "%" },
      ],
      fr: [
        { name: "Azote", value: 10, unit: "%" },
        { name: "Phosphore", value: 5, unit: "%" },
      ],
    });
    expect(result.ingredients).toEqual({
      en: [
        { name: "Fish meal", value: 50, unit: "g" },
        { name: "Bone meal", value: 50, unit: "g" },
      ],
      fr: [
        { name: "Farine de poisson", value: 50, unit: "g" },
        { name: "Farine d'os", value: 50, unit: "g" },
      ],
    });
    expect(result.picture_set_id).toBe("PIC123");
  });

  it("should handle empty arrays gracefully", () => {
    const result = mapLabelDataToInspectionUpdate(emptyLabelData);

    expect(result.inspection_comment).toBe("");
    expect(result.verified).toBe(false);
    expect(result.organizations).toEqual([]);
    expect(result.product).toEqual({
      name: "",
      registration_numbers: [{ registration_number: "" }],
      lot_number: "",
      npk: "",
      metrics: {
        weight: [],
        density: { value: null, unit: null },
        volume: { value: null, unit: null },
      },
    });
    expect(result.cautions).toEqual({ en: [], fr: [] });
    expect(result.instructions).toEqual({ en: [], fr: [] });
    expect(result.guaranteed_analysis).toEqual({
      title: { en: "", fr: "" },
      is_minimal: false,
      en: [],
      fr: [],
    });
    expect(result.ingredients).toEqual({ en: [], fr: [] });
    expect(result.picture_set_id).toBe("");
  });
});
