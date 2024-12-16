import useUploadedFilesStore from "@/stores/fileStore";
import BugReportIcon from "@mui/icons-material/BugReport";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
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
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideNav = ({ open, onClose }: DrawerMenuProps) => {
  const { t } = useTranslation("header");
  const { clearUploadedFiles } = useUploadedFilesStore();
  return (
    <Drawer
      className="darkContainer w-[240px] flex-shrink-0"
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      transitionDuration={0}
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
            <Link
              href="/"
              passHref
              data-testid="new-inspection-button"
              onClick={clearUploadedFiles}
            >
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
              href={process.env.NEXT_PUBLIC_REPORT_ISSUE_URL?.toString() || "/"}
              passHref
              target="_blank"
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
