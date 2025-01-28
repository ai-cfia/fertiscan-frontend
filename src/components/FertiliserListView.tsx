// FertiliserListView.tsx

import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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

const columns: GridColDef[] = [
  { field: 'fertiliserName', headerName: 'Fertiliser Name', width: 150 },
  { field: 'registrationNumber', headerName: 'Registration Number', width: 180 },
  { field: 'lotNumber', headerName: 'Lot Number', width: 120 },
  { field: 'organisationName', headerName: 'Organisation Name', width: 200 },
  { field: 'organisationAddress', headerName: 'Organisation Address', width: 250 },
  { field: 'organisationPhoneNumber', headerName: 'Organisation Phone Number', width: 200 },
  { field: 'location', headerName: 'Location', width: 150 },
  { field: 'inspectorName', headerName: 'Inspector Name', width: 150 },
  { field: 'dateOfInspection', headerName: 'Date of Inspection', width: 150 }
];

const FertiliserListView: React.FC<FertiliserListViewProps> = ({ fertilisers }) => {
  return (
    <div className=" p-5 h-[calc(100vh-100px)]" style={{ width: '100%' }}>
      <DataGrid
        rows={fertilisers}
        columns={columns}
        getRowId={(row) => row.registrationNumber}
        pagination
        pageSizeOptions={[5]}
      />
    </div>
  );
};

export default FertiliserListView;
