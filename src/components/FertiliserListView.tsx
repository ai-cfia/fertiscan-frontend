import React from "react";
import { DataGrid, GridColDef, GridLocaleText } from '@mui/x-data-grid';
import { useTranslation } from "react-i18next";

interface Fertiliser {
  fertiliserName: string;
  registrationNumber: string;
  lotNumber: string;
  location: string;
  inspectorName: string;
  organisationName: string;
  organisationAddress: string;
  organisationPhoneNumber: string;
  dateOfInspection: Date;
}

interface FertiliserListViewProps {
  fertilisers: Fertiliser[];
}

const FertiliserListView: React.FC<FertiliserListViewProps> = ({ fertilisers }) => {
    const { t } = useTranslation("searchPage");

    const columns: GridColDef[] = [
        { field: 'fertiliserName', headerName: t("fertiliserName"), width: 150 },
        { field: 'registrationNumber', headerName: t("registrationNumber"), width: 180 },
        { field: 'lotNumber', headerName: t("lotNumber"), width: 120 },
        { field: 'organisationName', headerName: t("organisationName"), width: 200 },
        { field: 'organisationAddress', headerName: t("organisationAddress"), width: 250 },
        { field: 'organisationPhoneNumber', headerName: t("organisationPhoneNumber"), width: 200 },
        { field: 'location', headerName: t("location"), width: 150 },
        { field: 'inspectorName', headerName: t('inspectorName'), width: 150 },
        { field: 'dateOfInspection', headerName: t("dateOfInspection"), width: 150 }
      ];

return (
    <div className="p-5 h-[calc(100vh-100px)]" style={{ width: '100%' }}>
        <DataGrid
            rows={fertilisers}
            columns={columns}
            getRowId={(row) => row.registrationNumber}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            localeText={{
                columnMenuSortAsc: t("ascending"),
                columnMenuSortDesc: t("descending"),
                columnMenuHideColumn: t("hideColumns"),
                columnMenuManageColumns: t("manageColumns"),
                columnMenuUnsort: t("unsort"),
                columnHeaderSortIconLabel:t("sort"),
                columnsManagementReset: t("reset"),
                columnsManagementSearchTitle: t("search"),
                columnsManagementShowHideAllText: t("showHideAll"),
                MuiTablePagination: {
                    labelRowsPerPage: t("rowPerPages"),
                    labelDisplayedRows: ({ from, to, count }) => `${from}-${to} ${t("of")} ${count !== -1 ? count : `${t("moreThan")} ${to}`}`,
                    nextIconButtonProps: {
                        title: t("nextPage"),
                    },
                    backIconButtonProps: {
                        title: t("previousPage"),
                    },
                },
            }}
            disableColumnFilter
        />
    </div>
);
};

export default FertiliserListView;
