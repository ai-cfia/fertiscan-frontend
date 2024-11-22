import React from "react";
import Link from "next/link";
import {
  Box,
  Divider,
  Drawer,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import BugReportIcon from "@mui/icons-material/BugReport";
import { useTranslation } from "react-i18next";

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideNav = ({ open, onClose }: DrawerMenuProps) => {
  const { t } = useTranslation("header");
  return (
    <Drawer
      className="darkContainer w-[240px] flex-shrink-0"
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        className: "w-[240px] box-border overflow-x-hidden",
      }}
    >
      <Box
        className="w-[250px] h-full flex flex-col justify-between text-white bg-sky-900"
        role="presentation"
        data-testid="backdrop"
        onClick={onClose}
      >
        <div>
          <Toolbar className="flex">
            <Icon>
              <Image
                src="/img/CFIA_small_logo.ico"
                alt={t("sideNav.altText.CFIALogoAlt")}
                width="40"
                height="40"
              />
            </Icon>
            <Typography className="pl-2 self-center" variant="h6">
              <b>{t("sideNav.FertiScan")}</b>
            </Typography>
          </Toolbar>

          <List>
            <Divider />
            <Link href="/" passHref data-testid="new-inspection-button">
              <ListItemButton>
                <ListItemIcon
                  aria-label={t("sideNav.altText.newInspectionButtonIcon")}
                >
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={t("sideNav.newInspection")} />
              </ListItemButton>
            </Link>
            <Divider />
            <Link href="/SearchPage" passHref data-testid="search-page-button">
              <ListItemButton>
                <ListItemIcon
                  aria-label={t("sideNav.altText.searchPageButtonIcon")}
                >
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary={t("sideNav.searchPage")} />
              </ListItemButton>
            </Link>
            <Divider />
          </List>
        </div>
        <div>
          <List>
            <Divider />
            <Link
              href="https://forms.office.com/Pages/ResponsePage.aspx?id=7aW1GIYd00GUoLwn2uMqsn9SKTgKSYtCg4t0B9x4uyJURE5HSkFCTkZHUEQyWkxJVElMODdFQ09HUCQlQCN0PWcu&r5a19e9d47d9f4ac497fb974c192da4b3=%22Fertiscan%22"
              passHref
              data-testid="report-issue-button"
            >
              <ListItemButton>
                <ListItemIcon
                  aria-label={t("sideNav.altText.reportIssueButtonIcon")}
                >
                  <BugReportIcon />
                </ListItemIcon>
                <ListItemText primary={t("sideNav.repportIssue")} />
              </ListItemButton>
            </Link>
          </List>
        </div>
      </Box>
    </Drawer>
  );
};

export default SideNav;
