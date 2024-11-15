import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useCallback } from "react";
import StatusInput from "./StatusInput";

export enum FieldStatus {
  Verified = "verified",
  Unverified = "unverified",
  Error = "error",
}

type Field = {
  value: string;
  status: FieldStatus;
  errorMessage: string | null;
};

export type Organization = {
  name: Field;
  address: Field;
  website: Field;
  phoneNumber: Field;
};

function OrganizationInformation({
  organization,
  setOrganization,
}: {
  organization: Organization;
  setOrganization: Dispatch<SetStateAction<Organization>>;
}) {
  const handleValueChange = useCallback(
    (field: keyof Organization, value: SetStateAction<string>) => {
      setOrganization((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value,
        },
      }));
    },
    [setOrganization],
  );

  const handleStatusChange = useCallback(
    (field: keyof Organization, status: React.SetStateAction<FieldStatus>) => {
      setOrganization((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          status,
        },
      }));
    },
    [setOrganization],
  );

  const inputFields = [
    {
      label: "Name",
      placeholder: "Enter organization name",
      value: organization.name.value,
      setValue: (value: SetStateAction<string>) =>
        handleValueChange("name", value),
      status: organization.name.status,
      setStatus: (status: React.SetStateAction<FieldStatus>) =>
        handleStatusChange("name", status),
    },
    {
      label: "Address",
      placeholder: "Enter address",
      value: organization.address.value,
      setValue: (value: SetStateAction<string>) =>
        handleValueChange("address", value),
      status: organization.address.status,
      setStatus: (status: React.SetStateAction<FieldStatus>) =>
        handleStatusChange("address", status),
    },
    {
      label: "Website",
      placeholder: "Enter website",
      value: organization.website.value,
      setValue: (value: SetStateAction<string>) =>
        handleValueChange("website", value),
      status: organization.website.status,
      setStatus: (status: React.SetStateAction<FieldStatus>) =>
        handleStatusChange("website", status),
    },
    {
      label: "Phone Number",
      placeholder: "Enter phone number",
      value: organization.phoneNumber.value,
      setValue: (value: SetStateAction<string>) =>
        handleValueChange("phoneNumber", value),
      status: organization.phoneNumber.status,
      setStatus: (status: React.SetStateAction<FieldStatus>) =>
        handleStatusChange("phoneNumber", status),
    },
  ];

  return (
    <Box className="flex flex-col gap-4 p-4">
      {inputFields.map((fieldProps, index) => (
        <StatusInput key={index} {...fieldProps} />
      ))}
    </Box>
  );
}

export default OrganizationInformation;
