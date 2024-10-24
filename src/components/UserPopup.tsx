import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  useTheme,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Logout, Settings, AccountCircle } from "@mui/icons-material";
import { useStore } from "@/store/useStore";
import { usePlaceholder } from "@/classe/User";
import { getSize } from "@/utils/themeUtils";
import useBreakpoints from "@/utils/useBreakpoints";

const UserPopup = () => {
  const theme = useTheme();
  const breakpoints = useBreakpoints();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { anchorElement, userPopUpOpen, setUserPopUpOpen, setAnchorElement } =
    useStore();
  const placeholderUser = usePlaceholder();

  const handleClose = () => {
    setUserPopUpOpen(false);
    setAnchorElement(null);
  };

  return (
    <Menu
      anchorEl={anchorElement}
      id="account-menu"
      open={userPopUpOpen}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.text.secondary,
          minWidth: 120,
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 15,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem sx={{ minWidth: 36 }}>
        <ListItemIcon
          sx={{
            color: theme.palette.text.secondary,
            fontSize: getSize(theme, "small", breakpoints),
          }}
        >
          <AccountCircle fontSize="inherit" />
        </ListItemIcon>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          {placeholderUser.getUsername()}
        </Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleClose}>
        <ListItemIcon
          sx={{
            color: theme.palette.text.secondary,
            fontSize: getSize(theme, "small", breakpoints),
          }}
        >
          <Settings fontSize="inherit" />
        </ListItemIcon>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Dashboard
        </Typography>
      </MenuItem>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "center" : "flex-end"}
        px={2}
        pt={1}
        pb={0}
        sx={{
          flexWrap: isMobile ? "nowrap" : "wrap",
        }}
      >
        {isMobile ? (
          <>
            <MenuItem
              onClick={handleClose}
              sx={{
                justifyContent: "center",
                width: "100%",
              }}
            >
              <ListItemIcon
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: getSize(theme, "small", breakpoints),
                  justifyContent: "center",
                }}
              >
                <Logout fontSize="inherit" />
              </ListItemIcon>
            </MenuItem>
            <Typography variant="caption" textAlign="center" width="100%">
              App Version: alpha 0.2.1
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="caption"
              alignSelf="end"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mr: 2,
              }}
            >
              App Version: alpha 0.2.1
            </Typography>
            <MenuItem
              onClick={handleClose}
              sx={{
                paddingRight: 0,
                justifyContent: "flex-end",
              }}
            >
              <ListItemIcon
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: getSize(theme, "small", breakpoints),
                }}
              >
                <Logout fontSize="inherit" />
              </ListItemIcon>
            </MenuItem>
          </>
        )}
      </Box>
    </Menu>
  );
};

export default UserPopup;
