import { Organization } from "@/types";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useCallback } from "react";
import CheckedInput from "./CheckedInput";

interface OrganizationInformationProps {
  organization: Organization;
  setOrganization: Dispatch<SetStateAction<Organization>>;
}

function OrganizationInformation({
  organization,
  setOrganization,
}: OrganizationInformationProps) {
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

  const handleCheckedChange = useCallback(
    (field: keyof Organization, isChecked: React.SetStateAction<boolean>) => {
      setOrganization((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          isChecked,
        },
      }));
    },
    [setOrganization],
  );

  return (
    <Box className="flex flex-col gap-4 p-4">
      <CheckedInput
        label="Name"
        placeholder="Enter organization name"
        value={organization.name.value}
        setValue={(value) => handleValueChange("name", value)}
        isChecked={organization.name.isChecked}
        setIsChecked={(isChecked) => handleCheckedChange("name", isChecked)}
      />
      <CheckedInput
        label="Address"
        placeholder="Enter address"
        value={organization.address.value}
        setValue={(value) => handleValueChange("address", value)}
        isChecked={organization.address.isChecked}
        setIsChecked={(isChecked) => handleCheckedChange("address", isChecked)}
      />
      <CheckedInput
        label="Website"
        placeholder="Enter website"
        value={organization.website.value}
        setValue={(value) => handleValueChange("website", value)}
        isChecked={organization.website.isChecked}
        setIsChecked={(isChecked) => handleCheckedChange("website", isChecked)}
      />
      <CheckedInput
        label="Phone Number"
        placeholder="Enter phone number"
        value={organization.phoneNumber.value}
        setValue={(value) => handleValueChange("phoneNumber", value)}
        isChecked={organization.phoneNumber.isChecked}
        setIsChecked={(isChecked) =>
          handleCheckedChange("phoneNumber", isChecked)
        }
      />
    </Box>
  );
}

export default OrganizationInformation;
