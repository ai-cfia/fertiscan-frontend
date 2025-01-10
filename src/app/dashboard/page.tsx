"use client";
import FertilizerList from "@/components/InspectionList/InspectionList";
import {
  Grid2 as Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Search, LocationOn } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import theme from "@/app/theme";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [inspectList, setInspectList] = useState([]);

  useEffect(() => {
    const username = atob(Cookies.get("token") ?? "");
    const password = "";
    const authHeader = "Basic " + btoa(`${username}:${password}`);
    axios
      .get("/api/inspections", {
        headers: {
          Authorization: authHeader,
        },
      })
      .then((response) => {
        setInspectList(response.data);
      });
  }, []);

  return (
    <Grid container spacing={2} className={"p-5 h-[calc(100vh-65px)]"}>
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
        className={
          "border-gray-200 border-2 rounded-md p-2 xs:pb-1 sm:pb-0 xs:h-[calc(100%-10.75rem)] sm:h-full min-h-60"
        }
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
              className={"rounded-md"}
              sx={{
                backgroundColor: theme.palette.background.paper,
              }}
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
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <hr className={"w-full"} />
          <Grid
            size={{ xs: 12 }}
            className={"xs:h-[calc(100%-8rem)] sm:h-[85%]"}
          >
            <FertilizerList search={search} inspectionList={inspectList} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
