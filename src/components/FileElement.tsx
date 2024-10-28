import React, { useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import useBreakpoints from "@/utils/useBreakpoints";
import { getSize } from "@/utils/themeUtils";
import { CancelOutlined as CancelOutlinedIcon } from '@mui/icons-material';



interface FileElementProps {
    setDropZoneState: (show: boolean, url:string) => void;
    fileName: string;
    fileUrl: string;
}

const FileElement: React.FC<FileElementProps  & {handleDelete:(fileUrl:string) => void}> = ({
    setDropZoneState,
    fileName,
    fileUrl,
    handleDelete,
}) => {
const theme = useTheme();
const breakpoints = useBreakpoints();
const [hovered, setHovered] = useState(false);

return (
    <Box
        sx={{
            border: "2px solid",
            borderColor: hovered ? theme.palette.secondary.main : theme.palette.primary.main,
            p:2,
            backgroundColor: hovered ? "#032f47" : theme.palette.secondary.main,
            position: "relative",
            marginBottom: 2,
            display: "flex",
            borderRadius: 2,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        >
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                columnGap: 1,
                maxHeight: '90px',
            }}
            >
                <Box
                component="img"
                src={fileUrl}
                alt="uploaded file"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        maxWidth: { xs: '15%', sm: '10%', md: '20%' },
                        height: 'auto',
                        backgroundColor: theme.palette.background.default,
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}

                />
                    <Typography variant="h6" color={theme.palette.text.primary}><b>{fileName}</b></Typography>
                    {hovered && (
                <IconButton
                    edge="end"
                    aria-label="delete"
                    sx={{
                        position: 'absolute',
                        top: { xs: -2, sm: -2.4, md: -3 },
                        right: { xs: -0.5, sm: -0.8, md: -1.5 },
                        color: 'black',
                        display: 'flex',
                    }}
                    onClick={()=> handleDelete(fileUrl)}
                >
                    <CancelOutlinedIcon sx={{ fontSize: getSize(theme, "medium", breakpoints) }} />
                </IconButton>
            )}
            </Box>
        </Box>
);
}
export default FileElement;
