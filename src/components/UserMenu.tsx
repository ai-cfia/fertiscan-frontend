"use client";
import { usePlaceholder } from "@/classe/User";
import { AccountCircle, Logout, Settings } from "@mui/icons-material";
import {
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
// import useBreakpoints from "@/utils/useBreakpoints";

/**
 * Props for the UserMenu component
 *
 * @property {HTMLElement | null} anchorElement - The element that serves as the anchor for the user popup.
 * @property {boolean} userPopUpOpen - Indicates whether the user popup is open.
 * @property {Dispatch<SetStateAction<boolean>>} setUserPopUpOpen - Function to set the open state of the user popup.
 * @property {Dispatch<SetStateAction<HTMLElement | null>>} setAnchorElement - Function to set the anchor element for the popup.
 */
type UserMenuProps = {
  anchorElement: null | HTMLElement;
  userPopUpOpen: boolean;
  setUserPopUpOpen: Dispatch<SetStateAction<boolean>>;
  setAnchorElement: Dispatch<SetStateAction<HTMLElement | null>>;
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
  const placeholderUser = usePlaceholder();

  /**
   * Function to handle closing the user popup
   */
  const handleClose = useCallback((): void => {
    setUserPopUpOpen(false);
    setAnchorElement(null);
  }, [setUserPopUpOpen, setAnchorElement]);

  /**
   * Prevents the default behavior of the event
   */
  const preventDefault = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
  ): void => {
    event.preventDefault();
  };

  useEffect(() => {
    window.addEventListener("resize", handleClose);
    return () => window.removeEventListener("resize", handleClose);
  }, [handleClose]);

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
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.text.secondary,
          },
        },
      }}
    >
      <MenuItem sx={{ minWidth: 36 }} onClick={preventDefault}>
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <Typography>{placeholderUser.getUsername()}</Typography>
      </MenuItem>
      <MenuItem onClick={handleClose} data-testid="dashboard-menu-item">
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <Typography>Dashboard</Typography>
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        <Typography>Log out</Typography>
      </MenuItem>
      <Divider />
      <Typography
        variant="caption"
        textAlign="center"
        sx={{
          display: "block",
        }}
      >
        App Version: alpha 0.2.1
      </Typography>
    </Menu>
  );
};

export default UserMenu;
