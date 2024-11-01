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
 * @property {HTMLElement | null} anchorElement - The element that serves as the anchor for the user menu.
 * @property {boolean} isUserMenuOpen - Indicates whether the user menu is open.
 * @property {Dispatch<SetStateAction<boolean>>} setIsUserMenuOpen - Function to set the open state of the user menu.
 * @property {Dispatch<SetStateAction<HTMLElement | null>>} setAnchorElement - Function to set the anchor element for the user menu.
 */
type UserMenuProps = {
  anchorElement: null | HTMLElement;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: Dispatch<SetStateAction<boolean>>;
  setAnchorElement: Dispatch<SetStateAction<HTMLElement | null>>;
};

/**
 * UserMenu Component
 *
 * This component renders a User Menu which appears when the user clicks on the
 * account icon in the header. It provides options to view the user's profile,
 * navigate to the dashboard, and log out. It also displays the current app version.
 *
 * @param {UserMenuProps} props - The properties of the UserMenu component
 * @returns {ReactElement} A UserMenu component
 *
 */
const UserMenu = ({
  anchorElement,
  isUserMenuOpen,
  setIsUserMenuOpen,
  setAnchorElement,
}: UserMenuProps): ReactElement => {
  const theme = useTheme();
  const placeholderUser = usePlaceholder();

  const handleClose = useCallback((): void => {
    setIsUserMenuOpen(false);
    setAnchorElement(null);
  }, [setIsUserMenuOpen, setAnchorElement]);

  useEffect(() => {
    window.addEventListener("resize", handleClose);
    return () => window.removeEventListener("resize", handleClose);
  }, [handleClose]);

  return (
    <Menu
      anchorEl={anchorElement}
      id="account-menu"
      open={isUserMenuOpen || false}
      onClose={handleClose}
      onClick={handleClose}
      data-testid="user-menu"
      transitionDuration={0}
      keepMounted
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
      <MenuItem
        sx={{ minWidth: 36 }}
        onClick={(event) => event.preventDefault()}
      >
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
