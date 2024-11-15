"use client";
import Dummy from "@/components/Dummy";
import ImageViewer from "@/components/ImageViewer";
import OrganizationForm from "@/components/OrganizationForm";
import {
  FieldStatus,
  Organization,
} from "@/components/OrganizationInformation";
import {
  HorizontalNonLinearStepper,
  StepComponentProps,
  StepperControls,
  StepStatus,
} from "@/components/stepper";
import useBreakpoints from "@/utils/useBreakpoints";
import { Box, Button, Container } from "@mui/material";
import * as React from "react";
import { useState } from "react";

function LabelDataValidationPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { isDownXs, isBetweenXsSm, isBetweenSmMd } = useBreakpoints();
  const isMdOrBelow = isDownXs || isBetweenXsSm || isBetweenSmMd;
  const [activeStep, setActiveStep] = useState(0);
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      name: {
        value: "GreenGrow Inc.",
        status: FieldStatus.Unverified,
        errorMessage: null,
      },
      address: {
        value: "123 Green Road, Farmville, State, 12345",
        status: FieldStatus.Unverified,
        errorMessage: null,
      },
      website: {
        value: "https://www.greengrow.com",
        status: FieldStatus.Unverified,
        errorMessage: null,
      },
      phoneNumber: {
        value: "123-456-7890",
        status: FieldStatus.Unverified,
        errorMessage: null,
      },
    },
    {
      name: {
        value: "GreenGrow Inc.",
        status: FieldStatus.Unverified,
        errorMessage: null,
      },
      address: {
        value: "123 Green Road, Farmville, State, 12345",
        status: FieldStatus.Unverified,
        errorMessage: null,
      },
      website: {
        value: "https://www.greengrow.com",
        status: FieldStatus.Unverified,
        errorMessage: null,
      },
      phoneNumber: {
        value: "123-456-7890",
        status: FieldStatus.Unverified,
        errorMessage: null,
      },
    },
  ]);
  const createStep = <T extends StepComponentProps>(
    Component: React.FC<T>,
    props: T,
  ) => {
    return {
      title: props.title,
      status: props.status,
      setStatus: props.setStatus,
      render: () => <Component {...props} />,
    };
  };

  const [organizationStatus, setOrganizationStatus] = useState<StepStatus>(
    StepStatus.Incomplete,
  );
  const [dummyStatus, setDummyStatus] = useState<StepStatus>(
    StepStatus.Incomplete,
  );

  const steps = [
    createStep(OrganizationForm, {
      title: "Organizations",
      status: organizationStatus,
      setStatus: setOrganizationStatus,
      organizations,
      setOrganizations,
    }),
    createStep(Dummy, {
      title: "Dummy",
      status: dummyStatus,
      setStatus: setDummyStatus,
      dummy: "Dummy",
    }),
  ];

  const stepperProps = {
    stepTitles: steps.map((step) => step.title),
    stepStatuses: steps.map((step) => step.status),
    activeStep,
    setActiveStep,
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFiles(Array.from(event.target.files));
    }
  };

  const openFileDialog = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <Container
      className="flex flex-col h-screen max-w-[1920px] max-h-[80vh]"
      maxWidth={false}
      data-testid="container"
    >
      {!isMdOrBelow && (
        <Box className="p-4 mt-4" data-testid="stepper">
          <HorizontalNonLinearStepper {...stepperProps} />
        </Box>
      )}

      <Box className="flex flex-col md:flex-row" data-testid="main-content">
        <Box
          className="flex w-full p-4 justify-center min-w-0 h-[720px]"
          data-testid="swiper-container"
        >
          <ImageViewer imageFiles={imageFiles} />
        </Box>

        {isMdOrBelow && (
          <Box className="p-4 mt-4 border" data-testid="stepper-md">
            <HorizontalNonLinearStepper {...stepperProps} />
          </Box>
        )}

        <Box
          className="flex w-full p-4 justify-center min-w-0 min-h-[500px] max-h-[80vh] overflow-y-auto"
          data-testid="form-container"
        >
          <Box className="w-full p-4 text-center" data-testid="forms">
            <Box className="">{steps[activeStep].render()}</Box>
            <StepperControls {...stepperProps} />
          </Box>
        </Box>
      </Box>

      <Box className="flex justify-center mt-4">
        <Button variant="contained" onClick={openFileDialog}>
          Upload Images
        </Button>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
    </Container>
  );
}

export default LabelDataValidationPage;
