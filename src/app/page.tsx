"use client";
import Dropzone from "@/components/Dropzone";
import LoadingButton from "@/components/LoadingButton";
import FileList from "@/components/FileList";
import useUploadedFilesStore from "@/stores/fileStore";
import type { DropzoneState } from "@/types/types";
import { Box, Grid2, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation("homePage");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [dropzoneState, setDropzoneState] = useState<DropzoneState>({
    visible: false,
    imageUrl: null,
    fillPercentage: 0,
  });
  const { uploadedFiles } = useUploadedFilesStore();

  const handleSubmission = () => {
    setLoading(true);
    router.push("/label-data-validation");
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
              dropzoneState={dropzoneState}
              setDropzoneState={setDropzoneState}
            />
          </Grid2>
          <Grid2
            className="flex content-end justify-center"
            container
            size={{ xs: 10, md: 4 }}
          >
            <FileList setDropzoneState={setDropzoneState} />
          </Grid2>
          <Grid2
            sx={{ display: { xs: "none", md: "flex" } }}
            size={{ xs: 10, md: 7 }}
          />
          <Grid2
            className="xs:flex md:flow-root justify-center"
            size={{ xs: 9, md: 4 }}
          >
            <Tooltip
              data-testid="hint-submit-button-disabled"
              title={t("submitButtonDisabledHint")}
              disableHoverListener={uploadedFiles.length !== 0}
              placement="top"
              className="w-[90%] max-w-full min-w-[133.44px]"
            >
              <span className="flex justify-center w-full">
                <LoadingButton
                  className="xs:w-[90%] md:w-[100%] min-w-[133.44px] max-h-[40px] md:max-w-[470px]" // do not modify md:max-w-[470px] so that the button keeps the same width as the FileList
                  data-testid="submit-button"
                  variant="contained"
                  color="secondary"
                  disabled={uploadedFiles.length === 0}
                  fullWidth
                  onClick={handleSubmission}
                  loading={loading}
                  text={t("submitButton")}
                />
              </span>
            </Tooltip>
          </Grid2>
        </Grid2>
      </Box>
    </Suspense>
  );
}
export default HomePage;
