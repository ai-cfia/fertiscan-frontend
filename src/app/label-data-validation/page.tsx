"use client";
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
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import {
  DEFAULT_LABEL_DATA,
  FormComponentProps,
  LabelData,
} from "@/types/types";
import {
  checkFieldArray,
  checkFieldRecord,
  processAxiosError,
} from "@/utils/common";
import { Inspection } from "@/utils/server/backend";
import useBreakpoints from "@/utils/useBreakpoints";
import { Box, Container, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function LabelDataValidationPage() {
  const { t } = useTranslation("labelDataValidationPage");
  const { uploadedFiles } = useUploadedFilesStore();
  const imageFiles = uploadedFiles.map((file) => file.getFile());
  const { isDownXs, isBetweenXsSm, isBetweenSmMd, isBetweenMdLg } =
    useBreakpoints();
  const isLgOrBelow =
    isDownXs || isBetweenXsSm || isBetweenSmMd || isBetweenMdLg;
  const [labelData, setLabelData] = useState<LabelData>(DEFAULT_LABEL_DATA);
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
  const { showAlert } = useAlertStore();

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
        <StepComponent labelData={labelData} setLabelData={setLabelData} />
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

  useEffect(() => {
    const verified = labelData.organizations.every((org) =>
      checkFieldRecord(org),
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
    const verified = checkFieldArray(labelData.ingredients);
    setIngredientsStepStatus(
      verified ? StepStatus.Completed : StepStatus.Incomplete,
    );
  }, [labelData.ingredients, setIngredientsStepStatus]);

  useEffect(() => {
    const extractAndSave = async () => {
      const formData = new FormData();

      uploadedFiles.forEach((fileUploaded) => {
        const file = fileUploaded.getFile();
        formData.append("files", file);
      });

      const username = "";
      const password = "";
      const authHeader = "Basic " + btoa(`${username}:${password}`);

      axios
        .post("/api/extract-label-data", formData, {
          headers: { Authorization: authHeader },
        })
        .then((response) => {
          formData.append("labelData", JSON.stringify(response.data));
          axios
            .post("/api/inspections", formData, {
              headers: { Authorization: authHeader },
            })
            .then((response) => {
              const inspection: Inspection = response.data;
              console.log("Inspections response:", inspection.inspection_id);
            })
            .catch((error) => {
              showAlert(processAxiosError(error), "error");
            });
        })
        .catch((error) => {
          showAlert(processAxiosError(error), "error");
        });
    };

    extractAndSave();
  }, [showAlert, uploadedFiles]);

  return (
    <Container
      className="flex flex-col max-w-[1920px] bg-gray-100 text-black"
      maxWidth={false}
      data-testid="container"
    >
      {!isLgOrBelow && (
        <Box className="p-4 mt-4" data-testid="stepper">
          <HorizontalNonLinearStepper
            stepTitles={steps.map((step) => step.title)}
            stepStatuses={steps.map((step) => step.stepStatus)}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
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
          />
        </Box>
      </Box>
    </Container>
  );
}

export default LabelDataValidationPage;
