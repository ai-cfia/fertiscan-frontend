"use client";
import FileUploaded from "@/classe/File";
import BaseInformationForm from "@/components/BaseInformationForm";
import CautionsForm from "@/components/CautionsForm";
import GuaranteedAnalysisForm from "@/components/GuaranteedAnalysisForm";
import ImageViewer from "@/components/ImageViewer";
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
import {
  checkFieldArray,
  checkFieldRecord,
} from "@/utils/client/fieldValidation";
import useBreakpoints from "@/utils/client/useBreakpoints";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LabelDataValidatorProps {
  loading?: boolean;
  fileUploads: FileUploaded[];
  labelData: LabelData;
  setLabelData: React.Dispatch<React.SetStateAction<LabelData>>;
  inspectionId?: string;
}

function LabelDataValidator({
  loading = false,
  fileUploads,
  labelData,
  setLabelData,
}: LabelDataValidatorProps) {
  const { t } = useTranslation("labelDataValidator");
  const { isDownXs, isBetweenXsSm, isBetweenSmMd, isBetweenMdLg } =
    useBreakpoints();
  const isLgOrBelow =
    isDownXs || isBetweenXsSm || isBetweenSmMd || isBetweenMdLg;
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

  const submit = () => {
    storeLabelData(labelData);
    router.push("/label-data-confirmation");
  };

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

  return (
    <Container
      className="flex flex-col max-w-[1920px] bg-gray-100 text-black"
      maxWidth={false}
      data-testid="label-data-validator-container"
    >
      {!isLgOrBelow && (
        <Box className="p-4 mt-4" data-testid="stepper">
          <HorizontalNonLinearStepper
            stepTitles={steps.map((step) => step.title)}
            stepStatuses={steps.map((step) => step.stepStatus)}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            submit={submit}
          />
        </Box>
      )}

      <Box
        className="flex flex-col lg:flex-row gap-4 my-4 lg:h-[75vh] lg:min-h-[500px]"
        data-testid="main-content"
      >
        <Box
          className="flex h-[500px] md:h-[720px] lg:size-full justify-center min-w-0 "
          data-testid="image-viewer-container"
        >
          <ImageViewer imageFiles={imageFiles} />
        </Box>

        {isLgOrBelow && (
          <Box className="p-4 mt-4" data-testid="stepper-md">
            <HorizontalNonLinearStepper
              stepTitles={steps.map((step) => step.title)}
              stepStatuses={steps.map((step) => step.stepStatus)}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              submit={submit}
            />
          </Box>
        )}

        <Box
          className="flex flex-col size-full min-w-0 p-4 text-center gap-4 content-end bg-white border border-black"
          data-testid="form-container"
        >
          <Typography
            variant="h6"
            className="text-lg !font-bold"
            data-testid="form-title"
          >
            {steps[activeStep].title}
          </Typography>
          <Box className="flex-1 overflow-y-auto sm:px-8">
            {steps[activeStep].render()}
          </Box>
          <StepperControls
            stepTitles={steps.map((step) => step.title)}
            stepStatuses={steps.map((step) => step.stepStatus)}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            submit={submit}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default LabelDataValidator;
