import { DEFAULT_BILINGUAL_FIELD, VerifiedField } from "@/types/types";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

const VerifiedBilingualTable = ({
  path,
  valueColumn = false,
  unitOptions,
}: {
  path: string;
  valueColumn?: boolean;
  unitOptions?: string[];
}) => {
  const { control, setValue, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: path,
  });
  const { t } = useTranslation("labelDataValidationPage");

  const data = useWatch({ control, name: path });
  const isVerified = (index: number) => Boolean(data?.[index]?.verified);

  const handleVerify = async (index: number, value: boolean) => {
    const isValid = await trigger(`${path}.${index}.value`);
    if (isValid) {
      setValue(`${path}.${index}.verified`, value);
    }
  };

  const toggleVerify = async (index: number) => {
    await handleVerify(index, Boolean(!data?.[index]?.verified));
  };

  const setAllVerified = async (value: boolean) => {
    await Promise.all(fields.map((_, index) => handleVerify(index, value)));
  };

  return (
    <Box>
      <TableContainer data-testid={`table-container-${path}`}>
        <Table>
          {/* Table Head */}
          <TableHead>
            <TableRow>
              <TableCell
                className="min-w-48"
                data-testid={`table-header-english-${path}`}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {t("verifiedBilingualTable.english")}
                </Typography>
              </TableCell>
              <TableCell
                className="min-w-48"
                data-testid={`table-header-french-${path}`}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {t("verifiedBilingualTable.french")}
                </Typography>
              </TableCell>
              {valueColumn && (
                <TableCell
                  className="min-w-48"
                  data-testid={`table-header-value-${path}`}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {t("verifiedBilingualTable.value")}
                  </Typography>
                </TableCell>
              )}
              <TableCell data-testid={`table-header-actions-${path}`}>
                <Typography
                  className="text-center"
                  variant="subtitle1"
                  fontWeight="bold"
                >
                  {t("verifiedBilingualTable.actions")}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {fields.map((field, index) => (
              <TableRow
                key={field.id}
                data-testid={`table-row-${path}-${index}`}
              >
                {/* English input field */}
                <TableCell data-testid={`input-english-cell-${path}-${index}`}>
                  <Controller
                    name={`${path}.${index}.en`}
                    control={control}
                    render={({ field }) => (
                      <InputBase
                        {...field}
                        className="!text-[15px]"
                        placeholder={t(
                          "verifiedBilingualTable.placeholders.english",
                        )}
                        multiline
                        fullWidth
                        disabled={isVerified(index)}
                        aria-label={t(
                          "verifiedBilingualTable.accessibility.englishInput",
                          { row: index + 1 },
                        )}
                        aria-disabled={isVerified(index)}
                        data-testid={`input-english-${path}-${index}`}
                      />
                    )}
                  />
                </TableCell>

                {/* French input field */}
                <TableCell data-testid={`input-french-cell-${path}-${index}`}>
                  <Controller
                    name={`${path}.${index}.fr`}
                    control={control}
                    render={({ field }) => (
                      <InputBase
                        {...field}
                        className="!text-[15px]"
                        placeholder={t(
                          "verifiedBilingualTable.placeholders.french",
                        )}
                        multiline
                        fullWidth
                        disabled={isVerified(index)}
                        aria-label={t(
                          "verifiedBilingualTable.accessibility.frenchInput",
                          { row: index + 1 },
                        )}
                        aria-disabled={isVerified(index)}
                        data-testid={`input-french-${path}-${index}`}
                      />
                    )}
                  />
                </TableCell>

                {/* Value column */}
                {valueColumn && (
                  <TableCell>
                    <Box className="flex items-center">
                      {/* Unit Selection Field */}
                      <Controller
                        name={`${path}.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="p-1 text-[15px] border rounded"
                            disabled={isVerified(index)}
                            aria-label={t(
                              "verifiedBilingualTable.accessibility.unitDropdown",
                            )}
                            data-testid={`${path}.${index}.unit`}
                          >
                            {unitOptions?.map((option) => (
                              <option key={option} value={option}>
                                {t(`verifiedBilingualTable.units.${option}`)}
                              </option>
                            ))}
                          </select>
                        )}
                      />

                      {/* Value Input Field */}
                      <Controller
                        name={`${path}.${index}.value`}
                        control={control}
                        rules={{
                          pattern: {
                            value: /^[0-9]*\.?[0-9]*$/,
                            message: t("errors.numbersOnly"),
                          },
                          min: {
                            value: 0,
                            message: t("errors.minValue"),
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <InputBase
                              {...field}
                              className="flex-1 p-2 !text-[15px]"
                              placeholder={t(
                                "verifiedBilingualTable.placeholders.value",
                              )}
                              disabled={isVerified(index)}
                              aria-label={t(
                                "verifiedBilingualTable.accessibility.valueInput",
                              )}
                              data-testid={`${path}.${index}.value`}
                              error={!!error}
                            />
                            {error && (
                              <Tooltip title={error.message || ""}>
                                <ErrorOutlineIcon
                                  className="ml-1"
                                  color="error"
                                  fontSize="small"
                                  data-testid={`value-error-icon-${path}-${index}`}
                                  aria-label={error.message}
                                />
                              </Tooltip>
                            )}
                          </>
                        )}
                      />
                    </Box>
                  </TableCell>
                )}

                {/* Action buttons */}
                <TableCell>
                  <Box className="flex justify-center gap-2">
                    {/* Delete Button */}
                    <Tooltip
                      title={t("verifiedBilingualTable.delete")}
                      enterDelay={1000}
                      disableHoverListener={isVerified(index)}
                    >
                      <span>
                        <IconButton
                          onClick={() => remove(index)}
                          disabled={isVerified(index)}
                          aria-label={t(
                            "verifiedBilingualTable.accessibility.deleteButton",
                          )}
                          data-testid={`delete-row-btn-${path}-${index}`}
                        >
                          <DeleteIcon aria-hidden="true" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem />

                    {/* Verify Button */}
                    <Controller
                      name={`${path}.${index}.verified`}
                      control={control}
                      render={({ field: { value } }) => (
                        <Tooltip
                          title={t(
                            value
                              ? "verifiedBilingualTable.unverify"
                              : "verifiedBilingualTable.verify",
                          )}
                          enterDelay={1000}
                        >
                          <span>
                            <IconButton
                              onClick={() => toggleVerify(index)}
                              aria-label={t(
                                value
                                  ? "verifiedBilingualTable.accessibility.unverifyButton"
                                  : "verifiedBilingualTable.accessibility.verifyButton",
                              )}
                              data-testid={`verify-row-btn-${path}-${index}`}
                            >
                              <CheckIcon
                                className={value ? "text-green-500" : ""}
                                aria-hidden="true"
                              />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Buttons to add rows and bulk verify/unverify */}
      <Box className="flex justify-end gap-2 mt-4">
        {/* Add Row Button */}
        <Button
          onClick={() => append(DEFAULT_BILINGUAL_FIELD)}
          variant="outlined"
          color="secondary"
          startIcon={<AddIcon aria-hidden="true" />}
          aria-label={t("verifiedBilingualTable.accessibility.addRowButton")}
          data-testid={`add-row-btn-${path}`}
        >
          {t("verifiedBilingualTable.addRow")}
        </Button>

        {/* Mark all as Verified Button */}
        <Tooltip
          title={t("verifiedBilingualTable.verifyAll")}
          enterDelay={1000}
          disableHoverListener={data.every(
            (row: VerifiedField) => row.verified,
          )}
        >
          <span>
            <Button
              onClick={() => setAllVerified(true)}
              variant="outlined"
              color="secondary"
              disabled={data.every((row: VerifiedField) => row.verified)}
              aria-label={t(
                "verifiedBilingualTable.accessibility.verifyAllButton",
              )}
              data-testid={`verify-all-btn-${path}`}
            >
              <DoneAllIcon aria-hidden="true" />
            </Button>
          </span>
        </Tooltip>

        {/* Mark all as Unverified Button */}
        <Tooltip
          title={t("verifiedBilingualTable.unverifyAll")}
          enterDelay={1000}
          disableHoverListener={data.every(
            (row: VerifiedField) => !row.verified,
          )}
        >
          <span>
            <Button
              onClick={() => setAllVerified(false)}
              variant="outlined"
              color="secondary"
              disabled={data.every((row: VerifiedField) => !row.verified)}
              aria-label={t(
                "verifiedBilingualTable.accessibility.unverifyAllButton",
              )}
              data-testid={`unverify-all-btn-${path}`}
            >
              <RemoveDoneIcon aria-hidden="true" />
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default VerifiedBilingualTable;
