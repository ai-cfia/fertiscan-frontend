import { Box } from "@mui/material";
import InputWithStatus, { InputStatus } from "./StatusInput";

type OrganizationInformationProps = {
  index: number;
};

type Field = {
  value: string;
  status: InputStatus;
  errorMessage: string | null;
};

export type Organization = {
  name: Field;
  address: Field;
  website: Field;
  phoneNumber: Field;
};

function OrganizationInformation({ index }: OrganizationInformationProps) {
  return (
    <Box className="flex flex-col gap-4 p-4">
      <InputWithStatus
        label="Name"
        placeholder="Enter organization name"
        name={`organizations.${index}.name.value`}
        statusName={`organizations.${index}.name.status`}
      />
      <InputWithStatus
        label="Address"
        placeholder="Enter address"
        name={`organizations.${index}.address.value`}
        statusName={`organizations.${index}.address.status`}
      />
      <InputWithStatus
        label="Website"
        placeholder="Enter website"
        name={`organizations.${index}.website.value`}
        statusName={`organizations.${index}.website.status`}
      />
      <InputWithStatus
        label="Phone Number"
        placeholder="Enter phone number"
        name={`organizations.${index}.phoneNumber.value`}
        statusName={`organizations.${index}.phoneNumber.status`}
      />
    </Box>
  );
}

export default OrganizationInformation;
