import { BilingualField, DEFAULT_BILINGUAL_FIELD } from "@/types/types";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
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
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

const VerifiedBilingualTable = ({ path }: { path: string }) => {
  const { control, setValue, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: path,
  });

  const setAllVerified = (verified: boolean) => {
    const rows = getValues(path).map((row: BilingualField) => ({
      ...row,
      verified,
    }));
    setValue(path, rows);
  };

  return (
    <Box>
      <TableContainer data-testid={`table-container-${path}`}>
        <Table>
          {/* Table Head */}
          <TableHead>
            <TableRow>
              <TableCell data-testid={`table-header-english-${path}`}>
                <Typography variant="subtitle1" fontWeight="bold">
                  English
                </Typography>
              </TableCell>
              <TableCell data-testid={`table-header-french-${path}`}>
                <Typography variant="subtitle1" fontWeight="bold">
                  French
                </Typography>
              </TableCell>
              <TableCell data-testid={`table-header-actions-${path}`}>
                <Typography
                  className="text-center"
                  variant="subtitle1"
                  fontWeight="bold"
                >
                  Actions
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
                        placeholder="Enter text in English"
                        multiline
                        fullWidth
                        disabled={getValues(`${path}.${index}.verified`)}
                        aria-label={`English text for row ${index + 1}`}
                        aria-disabled={getValues(`${path}.${index}.verified`)}
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
                        placeholder="Enter text in French"
                        multiline
                        fullWidth
                        disabled={getValues(`${path}.${index}.verified`)}
                        aria-label={`French text for row ${index + 1}`}
                        aria-disabled={getValues(`${path}.${index}.verified`)}
                        data-testid={`input-french-${path}-${index}`}
                      />
                    )}
                  />
                </TableCell>

                {/* Action buttons (Delete and Verify) */}
                <TableCell>
                  <Box className="flex justify-center gap-2">
                    {/* Delete Button */}
                    <Tooltip
                      title="Delete this row"
                      enterDelay={1000}
                      disableHoverListener={getValues(
                        `${path}.${index}.verified`,
                      )}
                    >
                      <span>
                        <IconButton
                          onClick={() => remove(index)}
                          disabled={getValues(`${path}.${index}.verified`)}
                          aria-label="Delete row"
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
                      render={({ field: { value, onChange } }) => (
                        <Tooltip
                          title={
                            value
                              ? "Mark this row as Unverified"
                              : "Mark this row as Verified"
                          }
                          enterDelay={1000}
                        >
                          <span>
                            <IconButton
                              onClick={() => onChange(!value)}
                              aria-label={
                                value
                                  ? "Mark as Unverified"
                                  : "Mark as Verified"
                              }
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
          aria-label="Add new row"
          data-testid={`add-row-btn-${path}`}
        >
          Add row
        </Button>

        {/* Mark all as Verified Button */}
        <Tooltip
          title="Mark all as Verified"
          enterDelay={1000}
          disableHoverListener={getValues(path).every(
            (row: BilingualField) => row.verified,
          )}
        >
          <span>
            <Button
              onClick={() => setAllVerified(true)}
              variant="outlined"
              color="secondary"
              disabled={getValues(path).every(
                (row: BilingualField) => row.verified,
              )}
              aria-label="Mark all rows as Verified"
              data-testid={`verify-all-btn-${path}`}
            >
              <DoneAllIcon aria-hidden="true" />
            </Button>
          </span>
        </Tooltip>

        {/* Mark all as Unverified Button */}
        <Tooltip
          title="Mark all as Unverified"
          enterDelay={1000}
          disableHoverListener={getValues(path).every(
            (row: BilingualField) => !row.verified,
          )}
        >
          <span>
            <Button
              onClick={() => setAllVerified(false)}
              variant="outlined"
              color="secondary"
              disabled={getValues(path).every(
                (row: BilingualField) => !row.verified,
              )}
              aria-label="Mark all rows as Unverified"
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
