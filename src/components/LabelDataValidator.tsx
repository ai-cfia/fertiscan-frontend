"use client";
import FileUploaded from "@/classe/File";
import BaseInformationForm from "@/components/BaseInformationForm";
import CautionsForm from "@/components/CautionsForm";
import GuaranteedAnalysisForm from "@/components/GuaranteedAnalysisForm";
import IngredientsForm from "@/components/IngredientsForm";
import InstructionsForm from "@/components/InstructionsForm";
import OrganizationsForm from "@/components/OrganizationsForm";
import {
  HorizontalNonLinearStepper,
  StepperControls,
  StepStatus,
} from "@/components/stepper";
import useLabelDataStore from "@/stores/labelDataStore";
import { FormComponentProps, LabelData } from "@/types/types";
import { setLabelDataInCookies } from "@/utils/client/cookies";
import {
  checkFieldArray,
  checkFieldRecord,
} from "@/utils/client/fieldValidation";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SplitContentLayout from "./inspection-details/SplitContentLayout";

/**
 * Props for LabelDataValidator component.
 *
 * @typedef {Object} LabelDataValidatorProps
 * @property {boolean} [loading=false] - Indicates whether the component is in a loading state.
 * @property {FileUploaded[]} fileUploads - List of uploaded files.
 * @property {LabelData} labelData - The current label data.
 * @property {React.Dispatch<React.SetStateAction<LabelData>>} setLabelData - Function to update label data.
 * @property {string} [inspectionId] - Optional inspection ID.
 */
interface LabelDataValidatorProps {
  loading?: boolean;
  fileUploads: FileUploaded[];
  labelData: LabelData;
  setLabelData: React.Dispatch<React.SetStateAction<LabelData>>;
  inspectionId?: string;
}

/**
 * Renders a label data validation page with a step-by-step form process.
 *
 * @param {LabelDataValidatorProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered LabelDataValidator component.
 */
const LabelDataValidator = ({
  loading = false,
  fileUploads,
  labelData,
  setLabelData,
}: LabelDataValidatorProps) => {
  const { t } = useTranslation("labelDataValidator");
  const [activeStep, setActiveStep] = useState(0);
  const [organizationsStepStatus, setOrganizationsStepStatus] =
    useState<StepStatus>(StepStatus.Incomplete);
  const [baseInformationStepStatus, setBaseInformationStepStatus] =
    useState<StepStatus>(StepStatus.Incomplete);
  const [cautionsStepStatus, setCautionsStepStatus] = useState<StepStatus>(
    StepStatus.Incomplete,
  );
  const [instructionsStepStatus, setInstructionsStepStatus] =
    useState<StepStatus>(StepStatus.Incomplete);
  const [guaranteedAnalysisStepStatus, setGuaranteedAnalysisStepStatus] =
    useState<StepStatus>(StepStatus.Incomplete);
  const [ingredientsStepStatus, setIngredientsStepStatus] =
    useState<StepStatus>(StepStatus.Incomplete);
  const storeLabelData = useLabelDataStore((state) => state.setLabelData);
  const router = useRouter();
  const imageFiles = fileUploads.map((file) => file.getFile());

  /**
   * Creates a step for the multi-step form process.
   *
   * @param {string} title - The title of the step.
   * @param {React.FC<FormComponentProps>} StepComponent - The form component for the step.
   * @param {StepStatus} stepStatus - The current status of the step.
   * @param {React.Dispatch<React.SetStateAction<StepStatus>>} setStepStatusState - Function to set the status of the step.
   * @returns {Object} An object representing the step with a render function.
   */
  const createStep = (
    title: string,
    StepComponent: React.FC<FormComponentProps>,
    stepStatus: StepStatus,
    setStepStatusState: React.Dispatch<React.SetStateAction<StepStatus>>,
  ) => {
    return {
      title: title,
      stepStatus: stepStatus,
      setStepStatus: setStepStatusState,
      render: () => (
        <StepComponent
          labelData={labelData}
          setLabelData={setLabelData}
          loading={loading}
        />
      ),
    };
  };

  // Define all the steps in the stepper
  const steps = [
    createStep(
      t("baseInformation.stepTitle"),
      BaseInformationForm,
      baseInformationStepStatus,
      setBaseInformationStepStatus,
    ),
    createStep(
      t("organizations.stepTitle"),
      OrganizationsForm,
      organizationsStepStatus,
      setOrganizationsStepStatus,
    ),
    createStep(
      t("cautions.stepTitle"),
      CautionsForm,
      cautionsStepStatus,
      setCautionsStepStatus,
    ),
    createStep(
      t("instructions.stepTitle"),
      InstructionsForm,
      instructionsStepStatus,
      setInstructionsStepStatus,
    ),
    createStep(
      t("guaranteedAnalysis.stepTitle"),
      GuaranteedAnalysisForm,
      guaranteedAnalysisStepStatus,
      setGuaranteedAnalysisStepStatus,
    ),
    createStep(
      t("ingredients.stepTitle"),
      IngredientsForm,
      ingredientsStepStatus,
      setIngredientsStepStatus,
    ),
  ];

  /**
   * Submits the current label data and navigates to the confirmation page.
   */
  const submit = () => {
    storeLabelData(labelData);
    router.push("/label-data-confirmation");
  };

  // Use effects to update step statuses based on field validation
  useEffect(() => {
    const verified = labelData.organizations.every(
      ({ name, address, website, phoneNumber }) =>
        checkFieldRecord({ name, address, website, phoneNumber }),
    );
    setOrganizationsStepStatus(
      verified ? StepStatus.Completed : StepStatus.Incomplete,
    );
  }, [labelData.organizations, setOrganizationsStepStatus]);

  useEffect(() => {
    const verified = checkFieldRecord(labelData.baseInformation);
    setBaseInformationStepStatus(
      verified ? StepStatus.Completed : StepStatus.Incomplete,
    );
  }, [labelData.baseInformation, setBaseInformationStepStatus]);

  useEffect(() => {
    const verified = checkFieldArray(labelData.cautions);
    setCautionsStepStatus(
      verified ? StepStatus.Completed : StepStatus.Incomplete,
    );
  }, [labelData.cautions, setCautionsStepStatus]);

  useEffect(() => {
    const verified = checkFieldArray(labelData.instructions);
    setInstructionsStepStatus(
      verified ? StepStatus.Completed : StepStatus.Incomplete,
    );
  }, [labelData.instructions, setInstructionsStepStatus]);

  useEffect(() => {
    const verified =
      checkFieldRecord({
        titleEn: labelData.guaranteedAnalysis.titleEn,
        titleFr: labelData.guaranteedAnalysis.titleFr,
        isMinimal: labelData.guaranteedAnalysis.isMinimal,
      }) && checkFieldArray(labelData.guaranteedAnalysis.nutrients);
    setGuaranteedAnalysisStepStatus(
      verified ? StepStatus.Completed : StepStatus.Incomplete,
    );
  }, [labelData.guaranteedAnalysis, setGuaranteedAnalysisStepStatus]);

  useEffect(() => {
    const verified =
      checkFieldRecord({
        recordKeeping: labelData.ingredients.recordKeeping,
      }) && checkFieldArray(labelData.ingredients.nutrients);
    setIngredientsStepStatus(
      verified ? StepStatus.Completed : StepStatus.Incomplete,
    );
  }, [labelData.ingredients, setIngredientsStepStatus]);

  useEffect(() => {
    setLabelDataInCookies(labelData);
  }, [labelData]);

  return (
    <Container
      className="flex max-w-[1920px] flex-col bg-gray-100 text-black"
      maxWidth={false}
      data-testid="label-data-validator-container"
    >
      <SplitContentLayout
        imageFiles={imageFiles}
        topPanel={
          <Box className="mt-4 p-4" data-testid="stepper">
            <HorizontalNonLinearStepper
              stepTitles={steps.map((step) => step.title)}
              stepStatuses={steps.map((step) => step.stepStatus)}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              submit={submit}
            />
          </Box>
        }
        header={
          <Typography
            variant="h6"
            className="text-lg !font-bold"
            data-testid="form-title"
          >
            {steps[activeStep].title}
          </Typography>
        }
        body={<Box className="">{steps[activeStep].render()}</Box>}
        footer={
          <StepperControls
            stepTitles={steps.map((step) => step.title)}
            stepStatuses={steps.map((step) => step.stepStatus)}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            submit={submit}
          />
        }
      />
    </Container>
  );
};

export default LabelDataValidator;
