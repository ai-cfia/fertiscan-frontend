import { BilingualField } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface BilingualTableProps {
  data: BilingualField[];
}

const BilingualTable: React.FC<BilingualTableProps> = ({ data }) => {
  const { t } = useTranslation("confirmationPage");

  return (
    <TableContainer data-testid="bilingual-table-container">
      <Table size="small" data-testid="bilingual-table">
        <TableHead>
          <TableRow className="bg-gray-100">
            <TableCell>
              <Typography className="!font-bold">
                {t("bilingualTable.tableHeaders.english")}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography className="!font-bold">
                {t("bilingualTable.tableHeaders.french")}
              </Typography>
            </TableCell>
            {data?.[0]?.value !== undefined && (
              <TableCell data-testid="bilingual-table-header-value">
                <Typography className="!font-bold">
                  {t("bilingualTable.tableHeaders.value")}
                </Typography>
              </TableCell>
            )}
            {data?.[0]?.unit !== undefined && (
              <TableCell data-testid="bilingual-table-header-unit">
                <Typography className="!font-bold">
                  {t("bilingualTable.tableHeaders.unit")}
                </Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} data-testid={`bilingual-table-row-${index}`}>
              <TableCell data-testid={`bilingual-table-row-${index}-english`}>
                {item.en}
              </TableCell>
              <TableCell data-testid={`bilingual-table-row-${index}-french`}>
                {item.fr}
              </TableCell>
              {item.value !== undefined && (
                <TableCell
                  align="right"
                  data-testid={`bilingual-table-row-${index}-value`}
                >
                  {item.value}
                </TableCell>
              )}
              {item.unit !== undefined && (
                <TableCell
                  align="right"
                  data-testid={`bilingual-table-row-${index}-unit`}
                >
                  {item.unit}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BilingualTable;
