import { Organization } from "@/types";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import OrganizationInformation from "./OrganizationInformation";

export type OrganizationsData = {
  organizations: Organization[];
};

function Organizations() {
  const [organizationsData, setOrganizationsData] = useState<OrganizationsData>(
    {
      organizations: [
        {
          name: { value: "GreenGrow Inc.", isChecked: false },
          address: {
            value: "123 Green Road, Farmville, State, 12345",
            isChecked: false,
          },
          website: { value: "https://www.greengrow.com", isChecked: false },
          phoneNumber: { value: "123-456-7890", isChecked: false },
        },
        {
          name: { value: "GreenGrow Inc.", isChecked: false },
          address: {
            value: "123 Green Road, Farmville, State, 12345",
            isChecked: false,
          },
          website: { value: "https://www.greengrow.com", isChecked: false },
          phoneNumber: { value: "123-456-7890", isChecked: false },
        },
      ],
    },
  );

  const setOrganization = (
    index: number,
    updatedOrg: React.SetStateAction<Organization>,
  ) => {
    setOrganizationsData((prevData) => {
      const newOrgs = [...prevData.organizations];
      newOrgs[index] =
        typeof updatedOrg === "function"
          ? updatedOrg(newOrgs[index])
          : updatedOrg;
      return { ...prevData, organizations: newOrgs };
    });
  };

  useEffect(() => {
    console.log("organizationsData", organizationsData);
  }, [organizationsData]);

  return (
    <div>
      <Typography variant="h6">Organizations</Typography>
      <Box className="flex flex-col gap-4 p-6">
        {organizationsData.organizations.map((organization, index) => (
          <div key={index}>
            <OrganizationInformation
              organization={organization}
              setOrganization={(updatedOrg) =>
                setOrganization(index, updatedOrg)
              }
            />
            {index < organizationsData.organizations.length - 1 && <Divider />}
          </div>
        ))}
      </Box>
    </div>
  );
}

export default Organizations;
