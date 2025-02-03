import { mapLabelDataOutputToLabelData } from "@/utils/client/modelTransformation";
import useDevStore from "@/stores/devStore";
import { LabelDataOutput } from "@/utils/server/backend";

const {
  getJsonFile,
  setUploadedJsonFile,
  setLabelDataOutput,
  labelDataOutput,
  triggerLabelDataLoad,
} = useDevStore();

export const processLoadingData = async () => {
  const response = await getJsonFile();
  const labelDataOutput = await response.json();
  setLabelDataOutput(labelDataOutput);
  const labelData = mapLabelDataOutputToLabelData(labelDataOutput);
  return labelData;
};

export const isTriggerLabelDataLoad = () => {
  return triggerLabelDataLoad;
};

export const processUploadJsonFile = (
  labelDataOutputParam: LabelDataOutput | null,
) => {
  console.log("processUploadJsonFile");
  if (labelDataOutputParam === null) {
    labelDataOutputParam = labelDataOutput;
  }
  setUploadedJsonFile(
    new File(
      [JSON.stringify(labelDataOutputParam, null, 2)],
      "PrefillLabelData.json",
    ),
  );
};
