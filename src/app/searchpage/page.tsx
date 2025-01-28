"use client";
import React, { useEffect, useRef } from 'react';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Popover, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import FertiliserPreview from "@/components/FertiliserPreview"; // Ensure this path is correct
import FilterOverlay from '@/components/FilterOverlay';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import FertiliserListView from '@/components/FertiliserListView';

// Mock data for fertilizer previews
const mockFertiliserData = [
  {
    fertiliserName: "Fertilizer Ultra-Green",
    registrationNumber: "2023-101",
    lotNumber: "LOT456",
    location: "Green Acres Farm",
    inspectorName: "John Doe",
    dateOfInspection: new Date(2023, 2, 15),
    organisationName: "Green Solutions Inc.",
    organisationAddress: "456 Elm Street, Springfield",
    organisationPhoneNumber: "555-0123",
  },
  {
    fertiliserName: "Crop Booster Plus",
    registrationNumber: "2023-102",
    lotNumber: "LOT457",
    location: "Sunnyvale Orchards",
    inspectorName: "Jane Smith",
    dateOfInspection: new Date(2023, 3, 18),
    organisationName: "AgriCare Co.",
    organisationAddress: "789 Maple Avenue, Shelbyville",
    organisationPhoneNumber: "555-0456",
  },
  {
    fertiliserName: "Nature's Formula",
    registrationNumber: "2023-103",
    lotNumber: "LOT458",
    location: "Riverside Gardens",
    inspectorName: "Michael Brown",
    dateOfInspection: new Date(2023, 4, 12),
    organisationName: "EcoHarvest LLP",
    organisationAddress: "321 Oak Lane, Capital City",
    organisationPhoneNumber: "555-0789",
  },
  {
    fertiliserName: "Growth Accelerator",
    registrationNumber: "2023-104",
    lotNumber: "LOT459",
    location: "Hillside Vineyards",
    inspectorName: "Emily White",
    dateOfInspection: new Date(2023, 5, 21),
    organisationName: "Fertile Earth Ltd.",
    organisationAddress: "654 Pine Drive, Ogdenville",
    organisationPhoneNumber: "555-0112",
  },
  {
    fertiliserName: "Plant Power Mix",
    registrationNumber: "2023-105",
    lotNumber: "LOT460",
    location: "Lakeside Pastures",
    inspectorName: "William Green",
    dateOfInspection: new Date(2023, 6, 10),
    organisationName: "Growing Goodies Corp.",
    organisationAddress: "987 Cedar Road, Brockway",
    organisationPhoneNumber: "555-0133",
  },
  {
    fertiliserName: "Yield Maximizer",
    registrationNumber: "2023-106",
    lotNumber: "LOT461",
    location: "Sunnyfield Plains",
    inspectorName: "Jessica Black",
    dateOfInspection: new Date(2023, 7, 22),
    organisationName: "Farmscape Innovations",
    organisationAddress: "246 Willow St, North Haverbrook",
    organisationPhoneNumber: "555-0177",
  },
  {
    fertiliserName: "EcoGrow Premium",
    registrationNumber: "2023-107",
    lotNumber: "LOT462",
    location: "Clover Valley Farms",
    inspectorName: "Robert Blue",
    dateOfInspection: new Date(2023, 8, 5),
    organisationName: "Verdant Ventures",
    organisationAddress: "369 Birch Blvd, Waverly Hills",
    organisationPhoneNumber: "555-0199",
  },
  {
    fertiliserName: "ProPlant Nutrients",
    registrationNumber: "2023-108",
    lotNumber: "LOT463",
    location: "Emerald Estates",
    inspectorName: "Natalie Gold",
    dateOfInspection: new Date(2023, 9, 14),
    organisationName: "GreenThumb Agency",
    organisationAddress: "741 Spruce Street, Evergreen Terrace",
    organisationPhoneNumber: "555-0222",
  },
  {
    fertiliserName: "Soil Enrich Pro",
    registrationNumber: "2023-109",
    lotNumber: "LOT464",
    location: "Evergreen Fields",
    inspectorName: "Patrick Orange",
    dateOfInspection: new Date(2023, 10, 20),
    organisationName: "TrueGardens Inc.",
    organisationAddress: "852 Walnut Circle, West Springfield",
    organisationPhoneNumber: "555-0277",
  },
  {
    fertiliserName: "Harvest Harmony",
    registrationNumber: "2023-110",
    lotNumber: "LOT465",
    location: "Meadowbrook Park",
    inspectorName: "Sophia Silver",
    dateOfInspection: new Date(2023, 11, 3),
    organisationName: "Nature's Bounty Ltd.",
    organisationAddress: "159 Poplar St, Capital City",
    organisationPhoneNumber: "555-0333",
  }
];

const fieldOptions = [
  { value: 'fertiliserName', label: 'Fertiliser Name' },
  { value: 'organisationName', label: 'Organisation Name' },
  { value: 'dateOfInspection', label: 'Date of Inspection' },
  { value: 'registrationNumber', label: 'Registration Number' },
  { value: 'lotNumber', label: 'Lot Number' },
  { value: 'location', label: 'Location' },
  { value: 'inspectorName', label: 'Inspector Name' },
  { value: 'organisationAddress', label: 'Organisation Address' },
];

type SortOrder = 'asc' | 'desc';

function SearchPage() {
  const { t } = useTranslation("searchPage");
  const [filterOverlayOpen, setFilterOverlayOpen] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [sortedData, setSortedData] = useState(mockFertiliserData);
  const [sortField, setSortField] = useState<keyof typeof mockFertiliserData[0]>('fertiliserName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const sortData = (field: keyof typeof mockFertiliserData[0], order: SortOrder) => {
    const sorted = [...sortedData].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return order === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }
      return 0;
    });

    setSortedData(sorted);
  };

  const handleFieldChange = (event: SelectChangeEvent) => {
    const newField = event.target.value as keyof typeof mockFertiliserData[0];
    setSortField(newField);
    sortData(newField, sortOrder);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortData(sortField, newOrder);
  };

  const toggleViewType = () => {
    setIsListView((prev) => !prev);
  };

  return (
    <Box
      id="scroll-container"
      className={"p-5 h-[calc(100vh-65px)]"}
      sx={{
        overflowY: isListView ? 'hidden' : 'auto',
        overflowX: 'hidden',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: "flex", gap: "1rem", zIndex: 2, justifyContent: "end" }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={isListView ? <GridViewOutlinedIcon /> : <ViewListOutlinedIcon />}
          onClick={toggleViewType}
        >
          {isListView ? "Grid View" : "List View"}
        </Button>

        {!isListView && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SortIcon />}
            onClick={handleSortClick}
          >
            Sort
          </Button>
        )}

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2, gap: 2 }}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortField} onChange={handleFieldChange} label="Sort By">
                {fieldOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </Box>
        </Popover>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<FilterListIcon />}
          onClick={() => setFilterOverlayOpen(!filterOverlayOpen)}
        >
          Search filter
        </Button>
      </Box>

      {filterOverlayOpen && <FilterOverlay setFilterOverlayOpen={setFilterOverlayOpen} />}

      {isListView ? (
        <FertiliserListView fertilisers={sortedData} />
      ) : (
        <Grid container spacing={2} sx={{ justifyContent: 'center', paddingRight: "1rem" }}>
          {sortedData.map((fertiliser, index) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
              <FertiliserPreview {...fertiliser} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default SearchPage;
