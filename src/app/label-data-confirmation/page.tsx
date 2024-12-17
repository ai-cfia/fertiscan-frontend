"use client";
import useLabelDataStore from "@/stores/labelDataStore";

const LabelDataConfirmationPage = () => {
  // use label data from store
  const { labelData } = useLabelDataStore();

  return (
    <div>{labelData ? JSON.stringify(labelData) : "No data available"}</div>
  );
};

export default LabelDataConfirmationPage;
