"use client";
import FileUploaded from "@/classe/File";
import Dropzone from "@/components/Dropzone";
import FileList from "@/components/FileList";
import useAlertStore from "@/stores/alertStore";
import type { DropzoneState } from "@/types/types";
import { Box, Button, Grid2, Tooltip } from "@mui/material";
import axios from "axios";
import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation("homePage");
  const { showAlert } = useAlertStore();

  const [dropzoneState, setDropzoneState] = useState<DropzoneState>({
    visible: false,
    imageUrl: null,
    fillPercentage: 0,
  });
  const [uploadedFiles, setUploadedFiles] = useState<FileUploaded[]>([]);

  const sendFiles = async () => {
    const formData = new FormData();

    uploadedFiles.forEach((fileUploaded) => {
      const file = fileUploaded.getFile();
      formData.append("files", file);
    });

    const username = "";
    const password = "";
    const authHeader = "Basic " + btoa(`${username}:${password}`);

    axios
      .post("/api/extract-label-data", formData, {
        headers: { Authorization: authHeader },
      })
      .then((response) => {
        console.log("Server Response:", response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response:", error.response.data);
          showAlert(error.response.data.error, "error");
        } else if (error.request) {
          console.error("Error request:", error.request);
          showAlert(error.request, "error");
        } else {
          console.error("Error message:", error.message);
          showAlert(error.message, "error");
        }
      });
  };

  return (
    <Suspense fallback="loading">
      <Box className="pt-[10vh]">
        <Grid2
          className="h-[80vh] justify-center"
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid2
            className="content-end justify-center"
            container
            size={{ xs: 10, md: 7 }}
          >
            <Dropzone
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              dropzoneState={dropzoneState}
              setDropzoneState={setDropzoneState}
            />
          </Grid2>
          <Grid2
            className="flex content-end justify-center"
            container
            size={{ xs: 10, md: 4 }}
          >
            <FileList
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              setDropzoneState={setDropzoneState}
            />
          </Grid2>
          <Grid2
            sx={{ display: { xs: "none", md: "flex" } }}
            size={{ xs: 10, md: 7 }}
          />{" "}
          <Grid2
            className="xs:flex md:flow-root justify-center"
            size={{ xs: 9, md: 4 }}
          >
            <Tooltip
              data-testid="hint-submit-button-disabled"
              title={t("submit_button_disabled_hint")}
              disableHoverListener={uploadedFiles.length !== 0}
              placement="top"
              className="w-[90%] max-w-full"
            >
              <span className="flex justify-center w-full">
                <Button
                  className={`xs:w-[90%] md:w-[100%] min-w-[133.44px] max-h-[40px] md:max-w-[470px]`} // do not modify md:max-w-[470px]
                  data-testid="submit-button"
                  variant="contained"
                  color="secondary"
                  disabled={uploadedFiles.length === 0}
                  fullWidth
                  onClick={sendFiles}
                >
                  {t("submit_button")}
                </Button>
              </span>
            </Tooltip>
          </Grid2>
        </Grid2>
      </Box>
    </Suspense>
  );
}
export default HomePage;
