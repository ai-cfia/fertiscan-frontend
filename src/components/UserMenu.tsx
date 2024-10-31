import { usePlaceholder } from "@/classe/User";
import useBreakpoints from "@/utils/useBreakpoints";
import { AccountCircle, Logout, Settings } from "@mui/icons-material";
import {
  Box,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { ReactElement } from "react";
// import useBreakpoints from "@/utils/useBreakpoints";

/**
 * UserMenuProps
 *
 * Interface for the UserMenu component
 *
 * @param {null | HTMLElement} anchorElement - The anchor element for the user popup
 * @param {boolean} userPopUpOpen - The state of the user popup
 * @param {(open: boolean) => void} setUserPopUpOpen - Function to set the user popup state
 * @param {(anchorEl: null | HTMLElement) => void} setAnchorElement - Function to set the anchor element
 */
type UserMenuProps = {
  anchorElement: null | HTMLElement;
  userPopUpOpen: boolean;
  setUserPopUpOpen: (open: boolean) => void;
  setAnchorElement: (anchorEl: null | HTMLElement) => void;
};

/**
 * UserPopup Component
 *
 * This component renders a User Popup which appears when the user clicks on the
 * account icon in the header. It provides options to view the user's profile,
 * navigate to the dashboard, and log out. It also displays the current app version.
 *
 * @param {UserMenuProps} props - The properties of the UserMenu component
 * @returns {ReactElement} A UserMenu component
 *
 */
const UserMenu = ({
  anchorElement,
  userPopUpOpen,
  setUserPopUpOpen,
  setAnchorElement,
}: UserMenuProps): ReactElement => {
  const theme = useTheme();
  const { isDownXs, isBetweenXsSm} = useBreakpoints();
  const placeholderUser = usePlaceholder();

  /**
   * Function to handle closing the user popup
   */
  const handleClose = (): void => {
    setUserPopUpOpen(false);
    setAnchorElement(null);
  };

  /**
   * Prevents the default behavior of the event
   */
  const preventDefault = (event: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
    event.preventDefault();
  };

  window.addEventListener('resize', handleClose);

  return (
    <Menu
      anchorEl={anchorElement}
      id="account-menu"
      open={userPopUpOpen || false}
      onClose={handleClose}
      onClick={handleClose}
      data-testid="user-menu"
      transitionDuration={0}
      keepMounted
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.text.secondary,
          minWidth: 120,
          border: "1.5px solid",
          borderColor: theme.palette.text.primary,
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            borderLeft: "1.5px solid",
            borderTop: "1.5px solid",
            borderColor: theme.palette.text.primary,
            top: 0,
            transform: "translateY(-54%) rotate(45deg)",
            zIndex: 0,
            bgcolor: theme.palette.secondary.main,
            width: 15,
            height: 15,
            left: 'calc(88% - 7.5px)', // Adjusting lozenge to center it
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
      sx={{
        minWidth: 36,
        borderBottom: '1px solid #043f5f', // Placeholder for divider since divider have an unremovable margin
        ':hover': {
          backgroundColor: 'transparent',
        },
        cursor: 'default',
      }}
      onClick={preventDefault}
    >
      <ListItemIcon>
        <AccountCircle />
      </ListItemIcon>
      <Typography>{placeholderUser.getUsername()}</Typography>
    </MenuItem>
      <MenuItem onClick={handleClose} data-testid="dashboard-menu-item">
        <ListItemIcon >
          <Settings sx={{ "&:hover": {color:"#fff"}}} />
        </ListItemIcon>
        <Typography>Dashboard</Typography>
      </MenuItem>
      <Box
        display="flex"
        flexDirection={(isDownXs || isBetweenXsSm) ? "column" : "row"}
        justifyContent="space-between"
        alignItems={(isDownXs || isBetweenXsSm) ? "center" : "flex-end"}
        px={2}
        pt={1}
        pb={0}
        sx={{
          flexWrap: (isDownXs || isBetweenXsSm) ? "nowrap" : "wrap",
        }}
      >
        {(isDownXs || isBetweenXsSm) ? (
          <>
            <MenuItem
              onClick={handleClose}
              sx={{
                justifyContent: "center",
                borderRadius: 1,
                p: 0.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: theme.palette.text.secondary,
                  justifyContent: "center",
                }}
              >
                <Logout />
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
                padding: 0,
                justifyContent: "flex-end",
                borderRadius: 1,
              }}
            >
              <ListItemIcon >
                <Logout sx={{borderRadius:10}}/>
              </ListItemIcon>
            </MenuItem>
          </>
        )}
      </Box>
    </Menu>
  );
};

export default UserMenu;
