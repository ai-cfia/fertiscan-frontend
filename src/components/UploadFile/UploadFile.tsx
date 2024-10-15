import React from 'react';
import { Box, IconButton } from '@mui/material';
import { CancelOutlined as CancelOutlinedIcon } from '@mui/icons-material';
import ContextMenu from '@/components/ContextMenu/ContextMenu';

interface UploadFileProps {
    handleRightClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleCloseContextMenu: () => void;
    setShowImageInDropZone: (show: boolean) => void;
    contextMenuAnchor: { mouseX: number; mouseY: number } | null;
    setContextMenuAnchor: (anchor: { mouseX: number; mouseY: number } | null) => void;
    hovered: boolean;
}

const UploadFile: React.FC<UploadFileProps> = ({
    handleRightClick,
    handleCloseContextMenu,
    setShowImageInDropZone,
    contextMenuAnchor,
    setContextMenuAnchor,
    hovered,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 1,
                maxHeight: '90px',
                width: '100%',
                fontSize: { xs: '0.5rem', sm: '1rem' },
            }}
            onContextMenu={handleRightClick}
            onMouseLeave={handleCloseContextMenu}
        >
            <Box
                component="img"
                src="/img/placeholder.png"
                alt="uploaded file"
                onMouseEnter={() => setShowImageInDropZone(true)}
                onMouseLeave={() => setShowImageInDropZone(false)}
                sx={{ maxWidth: { xs: '15%', sm: '10%', md: '20%' }, height: 'auto' }}
            />
            <ContextMenu
                contextMenuPosition={contextMenuAnchor}
                handleClose={handleCloseContextMenu}
            />
            <b>filename.jpg</b>
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
    );
};

export default UploadFile;