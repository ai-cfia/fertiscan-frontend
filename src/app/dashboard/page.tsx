"use client";
import FertilizerList from "@/components/InspectionList/InspectionList";
import {
  Grid2 as Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Search, LocationOn } from "@mui/icons-material";
import { useState } from "react";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  return (
    <Grid container spacing={2} className={"p-5 h-full"}>
      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
        <Grid
          container
          className={"p-2 border-gray-200 border-2 rounded-md h-fit"}
        >
          <Grid size={12}>
            <Typography component={"h2"} className={"!font-black "}>
              Username
            </Typography>
          </Grid>
          <Grid size={4}>
            <b>Mail:</b>
          </Grid>
          <Grid size={8}>User email</Grid>
          <Grid size={4}>
            <b>Role:</b>
          </Grid>
          <Grid size={8}>User role</Grid>
          <Grid size={4}>
            <b>
              <LocationOn />:
            </b>
          </Grid>
          <Grid size={8}>User location</Grid>
        </Grid>
        <Grid
          container
          className={
            "p-2 border-gray-200 border-2 rounded-md h-fit mt-2 w-11/12"
          }
        >
          <Grid size={12}>
            <Typography component={"h4"} className={"!font-semiboldl "}>
              Number of inspections
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        size={{ xs: 12, sm: 8, md: 9 }}
        className={"border-gray-200 border-2 rounded-md p-2 lg:h-300"}
      >
        <Grid container spacing={2} className={"h-full"}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography component={"h2"} className={"!font-black"}>
              My inspections
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 8 }}>
            <TextField
              placeholder={"Search"}
              variant={"filled"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              slotProps={{
                htmlInput: {
                  className: "!p-0 after:!transition-none ",
                },
                input: {
                  className: "p-2",
                  startAdornment: (
                    <InputAdornment position={"start"} className={"!m-0"}>
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <hr className={"w-full"} />
          <Grid size={{ xs: 12 }}>
            <FertilizerList search={search} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
