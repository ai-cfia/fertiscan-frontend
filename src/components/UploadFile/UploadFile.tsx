import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { CancelOutlined as CancelOutlinedIcon } from '@mui/icons-material';
import ContextMenu from '@/components/ContextMenu/ContextMenu';

interface UploadFileProps {
    handleRightClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleCloseContextMenu: () => void;
    setDropZoneState: (show: boolean, url:string) => void;
    contextMenuAnchor: { mouseX: number; mouseY: number } | null;
    setContextMenuAnchor: (anchor: { mouseX: number; mouseY: number } | null) => void;
    fileName: string;
    fileUrl: string;
}


const UploadFile: React.FC<UploadFileProps & { handleRename: (newName: string) => void }> = ({
    handleRightClick,
    fileUrl,
    handleCloseContextMenu,
    setDropZoneState,
    contextMenuAnchor,
    setContextMenuAnchor,
    fileName,
    handleRename
}) => {
    const [hovered, setHovered] = useState(false);

    const SendActionContextMenu = (action: string): void => {
        console.log(action);
    };
    return (
        
        <Box
        sx={{
            border: '2px solid #05486C',
            borderRadius: 1,
            p: 2,
            backgroundColor: '#C5C5C5',
            position: 'relative',
            marginBottom: 2,
            display: 'flex',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 1,
                maxHeight: '90px',
                width: '100%',
                fontSize: { xs: '0.5rem', sm: '1rem' },
            }}
            onContextMenu={(event) => {
                handleRightClick(event);
                SendActionContextMenu("Right-clicked");
            }}
            onMouseLeave={handleCloseContextMenu}
        >
            <Box
                component="img"
                src={fileUrl}
                alt="uploaded file"
                onMouseEnter={() => setDropZoneState(true, fileUrl)}
                onMouseLeave={() => setDropZoneState(false, "")}
                sx={{ maxWidth: { xs: '15%', sm: '10%', md: '20%' }, height: 'auto' }}
            />
            <ContextMenu
                contextMenuPosition={contextMenuAnchor}
                handleClose={handleCloseContextMenu}
                handleRename={handleRename}
            />
            <b>{fileName}</b>
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
                >
                    <CancelOutlinedIcon sx={{ fontSize: { xs: 'medium' } }} />
                </IconButton>
            )}
        </Box>
    </Box>
    );
};

export default UploadFile;