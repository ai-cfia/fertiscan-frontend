import { QuantityChips } from "@/components/QuantityChip";
import { LabelData } from "@/types/types";
import {
  Box,
  BoxProps,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TypographyProps,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import BilingualTable from "./BilingualTable";

interface LabelInformationProps {
  labelData: LabelData | null;
  setNotes?: (text: string) => void;
  disableNotes: boolean;
}

const LabelInformation: React.FC<LabelInformationProps> = ({
  labelData,
  setNotes,
  disableNotes,
}) => {
  const { t } = useTranslation("confirmationPage");

  if (!labelData) return null;

  return (
    <Box className="flex flex-col gap-4">
      {/* Base Information */}
      <Section
        title={t("baseInformation.sectionTitle")}
        testId="base-information-section"
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow className="bg-gray-100">
                {[
                  "name",
                  "registrationNumber",
                  "lotNumber",
                  "npk",
                  "weight",
                  "density",
                  "volume",
                ].map((key) => (
                  <TableCell key={key} className="min-w-32">
                    <Typography className="!font-bold">
                      {t(`baseInformation.tableHeaders.${key}`)}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{labelData.baseInformation.name.value}</TableCell>
                <TableCell>
                  {labelData.baseInformation.registrationNumber.value}
                </TableCell>
                <TableCell>
                  {labelData.baseInformation.lotNumber.value}
                </TableCell>
                <TableCell>{labelData.baseInformation.npk.value}</TableCell>
                <TableCell>
                  <QuantityChips
                    quantities={labelData.baseInformation.weight.quantities}
                  />
                </TableCell>
                <TableCell>
                  <QuantityChips
                    quantities={labelData.baseInformation.density.quantities}
                  />
                </TableCell>
                <TableCell>
                  <QuantityChips
                    quantities={labelData.baseInformation.volume.quantities}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* Organizations */}
      <Section
        title={t("organizations.sectionTitle")}
        testId="organizations-section"
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow className="bg-gray-100">
                {["name", "address", "website", "phoneNumber"].map((key) => (
                  <TableCell key={key} className="min-w-44">
                    <Typography className="!font-bold">
                      {t(`organizations.tableHeaders.${key}`)}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {labelData.organizations.map((org, index) => (
                <TableRow key={index}>
                  <TableCell>{org.name.value}</TableCell>
                  <TableCell>{org.address.value}</TableCell>
                  <TableCell>
                    <Link
                      href={`http://${org.website.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {org.website.value}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`tel:${org.phoneNumber.value}`}>
                      {org.phoneNumber.value}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* Cautions */}
      <Section title={t("cautions.sectionTitle")} testId="cautions-section">
        <BilingualTable data={labelData.cautions ?? []} />
      </Section>

      {/* Instructions */}
      <Section
        title={t("instructions.sectionTitle")}
        testId="instructions-section"
      >
        <BilingualTable data={labelData.instructions ?? []} />
      </Section>

      {/* Guaranteed Analysis */}
      <Section
        title={t("guaranteedAnalysis.sectionTitle")}
        testId="guaranteed-analysis-section"
      >
        <SubSection
          title={t("guaranteedAnalysis.title")}
          testId="guaranteed-analysis-title-section"
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow className="bg-gray-100">
                  {["english", "french", "isMinimal"].map((key) => (
                    <TableCell key={key}>
                      <Typography className="!font-bold">
                        {t(`guaranteedAnalysis.tableHeaders.${key}`)}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {labelData.guaranteedAnalysis.titleEn.value}
                  </TableCell>
                  <TableCell>
                    {labelData.guaranteedAnalysis.titleFr.value}
                  </TableCell>
                  <TableCell>
                    {labelData.guaranteedAnalysis.isMinimal.value
                      ? t("yes")
                      : t("no")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </SubSection>

        {/* Nutrients */}
        <SubSection
          title={t("guaranteedAnalysis.nutrients")}
          testId="guaranteed-analysis-nutrients-section"
        >
          <BilingualTable data={labelData.guaranteedAnalysis.nutrients ?? []} />
        </SubSection>
      </Section>

      {/* Ingredients */}
      <Section
        title={t("ingredients.sectionTitle")}
        testId="ingredients-section"
      >
        {!labelData.ingredients.recordKeeping.value ? (
          <Section
            titleProps={{ variant: "body1", className: "mb-2" }}
            title={t("ingredients.nutrients")}
          >
            <BilingualTable data={labelData.ingredients.nutrients ?? []} />
          </Section>
        ) : (
          <Typography className="!font-bold">
            {t("ingredients.recordKeeping")}
          </Typography>
        )}
      </Section>

      {/* Notes */}
      <Section title={t("notes.sectionTitle")} testId="notes-section">
        <TextField
          multiline
          rows={3}
          variant="outlined"
          fullWidth
          placeholder={t("notes.placeholder")}
          value={labelData.comment}
          onChange={(e) => (setNotes ? setNotes(e.target.value) : null)}
          disabled={disableNotes}
          data-testid="notes-textbox"
        />
      </Section>
    </Box>
  );
};

export default LabelInformation;

interface SectionProps {
  title: string;
  children: React.ReactNode;
  testId?: string;
  boxProps?: BoxProps;
  titleProps?: TypographyProps;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  testId,
  boxProps,
  titleProps: typographyProps,
}) => (
  <Box data-testid={testId} {...boxProps}>
    <Typography
      variant="h6"
      gutterBottom
      {...typographyProps}
      className={`text-left !font-bold ${typographyProps?.className}`}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

const SubSection: React.FC<SectionProps> = ({
  title,
  children,
  testId,
  boxProps,
  titleProps,
}) => (
  <Section
    title={title}
    testId={testId}
    boxProps={{ ...boxProps, className: `mb-4 ${boxProps?.className}` }}
    titleProps={{
      variant: "body1",
      ...titleProps,
    }}
  >
    {children}
  </Section>
);
