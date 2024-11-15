import { Box, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import OrganizationInformation, {
  FieldStatus,
  Organization,
} from "./OrganizationInformation";
import { StepComponentProps, StepStatus } from "./stepper";

export interface OrganizationsProps extends StepComponentProps {
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
}

const OrganizationForm: React.FC<OrganizationsProps> = ({
  title,
  setStatus,
  organizations,
  setOrganizations,
}) => {
  const statusIsVerified = (status: FieldStatus) =>
    status === FieldStatus.Verified;

  useEffect(() => {
    const isAllChecked = organizations.every(
      (org) =>
        statusIsVerified(org.name.status) &&
        statusIsVerified(org.address.status) &&
        statusIsVerified(org.website.status) &&
        statusIsVerified(org.phoneNumber.status),
    );
    setStatus(isAllChecked ? StepStatus.Completed : StepStatus.Incomplete);
  }, [organizations, setStatus]);

  const setOrganization = (
    index: number,
    updatedOrg: React.SetStateAction<Organization>,
  ) => {
    setOrganizations((prevOrganizations) => {
      const newOrgs = [...prevOrganizations];
      newOrgs[index] =
        typeof updatedOrg === "function"
          ? updatedOrg(newOrgs[index])
          : updatedOrg;
      return newOrgs;
    });
  };

  return (
    <div>
      <Typography variant="h6">{title}</Typography>
      <Box className="flex flex-col gap-4 p-6">
        {organizations.map((organization, index) => (
          <div key={index}>
            <OrganizationInformation
              organization={organization}
              setOrganization={(updatedOrg) =>
                setOrganization(index, updatedOrg)
              }
            />
            {index < organizations.length - 1 && <Divider />}
          </div>
        ))}
      </Box>
    </div>
  );
};

export default OrganizationForm;
