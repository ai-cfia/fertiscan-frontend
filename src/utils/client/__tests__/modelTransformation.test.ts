import {
  FertiscanDbMetadataInspectionValue,
  Inspection,
  LabelDataOutput,
  NutrientValue,
  PipelineInspectionValue,
} from "../../server/backend";
import {
  mapInspectionToLabelData,
  mapLabelDataOutputToLabelData,
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
      company_name: "Company Inc.",
      company_address: "123 Street",
      company_website: "http://example.com",
      company_phone_number: "123-456-7890",
      manufacturer_name: "Mfg Corp.",
      manufacturer_address: "456 Road",
      manufacturer_website: "http://mfg.com",
      manufacturer_phone_number: "987-654-3210",
      fertiliser_name: "SuperGrow",
      registration_number: "REG123",
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
    expect(result.baseInformation.registrationNumber.value).toBe("REG123");
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

describe("mapInspectionToLabelData", () => {
  it("should map all data correctly", () => {
    const input: Inspection = {
      inspection_id: "INS123",
      company: {
        name: "Company Inc.",
        address: "123 Street",
        website: "http://example.com",
        phone_number: "123-456-7890",
      },
      manufacturer: {
        name: "Mfg Corp.",
        address: "456 Road",
        website: "http://mfg.com",
        phone_number: "987-654-3210",
      },
      product: {
        name: "SuperGrow",
        registration_number: "REG123",
        lot_number: "LOT42",
        npk: "10-5-5",
        metrics: {
          weight: [{ value: 20, unit: "kg" }],
          density: { value: 1.2, unit: "g/cm³" },
          volume: { value: 5, unit: "L" },
        },
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
    };

    const result = mapInspectionToLabelData(input);

    expect(result.organizations[0].name.value).toBe("Company Inc.");
    expect(result.organizations[0].address.value).toBe("123 Street");
    expect(result.organizations[0].website.value).toBe("http://example.com");
    expect(result.organizations[0].phoneNumber.value).toBe("123-456-7890");

    expect(result.organizations[1].name.value).toBe("Mfg Corp.");
    expect(result.organizations[1].address.value).toBe("456 Road");
    expect(result.organizations[1].website.value).toBe("http://mfg.com");
    expect(result.organizations[1].phoneNumber.value).toBe("987-654-3210");

    expect(result.baseInformation.name.value).toBe("SuperGrow");
    expect(result.baseInformation.registrationNumber.value).toBe("REG123");
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
      {
        en: "Phosphorus",
        fr: "Phosphore",
        value: "5",
        unit: "%",
        verified: false,
      },
    ]);
  });

  it("should handle missing fields gracefully", () => {
    const input: Inspection = {
      inspection_id: "",
      company: {
        name: "",
        address: "",
        website: "",
        phone_number: "",
      },
      manufacturer: {
        name: "",
        address: "",
        website: "",
        phone_number: "",
      },
      product: {
        name: "",
        registration_number: "",
        lot_number: "",
        npk: "",
        metrics: {
          weight: [],
          density: null,
          volume: null,
        },
      },
      cautions: { en: [], fr: [] },
      instructions: { en: [], fr: [] },
      guaranteed_analysis: {
        title: { en: "", fr: "" },
        is_minimal: false,
        en: [],
        fr: [],
      },
    };
    const result = mapInspectionToLabelData(input);

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

  it("sets all fields as verified if inspection is verified", () => {
    const input: Inspection = {
      inspection_id: "",
      company: {
        name: "",
        address: "",
        website: "",
        phone_number: "",
      },
      manufacturer: {
        name: "",
        address: "",
        website: "",
        phone_number: "",
      },
      product: {
        name: "",
        registration_number: "",
        lot_number: "",
        npk: "",
        metrics: {
          weight: [],
          density: null,
          volume: null,
        },
      },
      cautions: { en: [], fr: [] },
      instructions: { en: [], fr: [] },
      guaranteed_analysis: {
        title: { en: "", fr: "" },
        is_minimal: false,
        en: [],
        fr: [],
      },
      verified: true,
    };
    const result = mapInspectionToLabelData(input);

    // Organizations
    expect(result.organizations[0].name.verified).toBe(true);
    expect(result.organizations[0].address.verified).toBe(true);
    expect(result.organizations[0].website.verified).toBe(true);
    expect(result.organizations[0].phoneNumber.verified).toBe(true);

    expect(result.organizations[1].name.verified).toBe(true);
    expect(result.organizations[1].address.verified).toBe(true);
    expect(result.organizations[1].website.verified).toBe(true);
    expect(result.organizations[1].phoneNumber.verified).toBe(true);

    // Base Information
    expect(result.baseInformation.name.verified).toBe(true);
    expect(result.baseInformation.registrationNumber.verified).toBe(true);
    expect(result.baseInformation.lotNumber.verified).toBe(true);
    expect(result.baseInformation.npk.verified).toBe(true);
    expect(result.baseInformation.weight.verified).toBe(true);
    expect(result.baseInformation.density.verified).toBe(true);
    expect(result.baseInformation.volume.verified).toBe(true);

    // Guaranteed Analysis
    expect(result.guaranteedAnalysis.titleEn.verified).toBe(true);
    expect(result.guaranteedAnalysis.titleFr.verified).toBe(true);
    expect(result.guaranteedAnalysis.isMinimal.verified).toBe(true);
  });
});
