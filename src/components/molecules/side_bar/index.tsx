import { Diamond, DarkMode } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  MenuItemStyles,
  Sidebar,
  SubMenu,
  menuClasses,
} from "react-pro-sidebar";

import { SidebarHeader } from "./sidebar_header";
import { SidebarFooter } from "./sidebar_footer";
import { themes } from "@constants/themes/styles";
import { Link, useLocation } from "react-router-dom";
import { KEY_VALUE } from "@constants/GlobalConstant";
import HRMStorage from "@common/function";
import { t } from "i18next";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { userActions } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { menuItems } from "./index.path";

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface SidebarProps {
  collapsed?: boolean;
  toggled?: boolean;
  setToggled?: () => void;
  onBackdropClick?: () => void;
  onBreakPoint?: (broken: boolean) => void;
  image?: string;
  rtl?: boolean;
  breakPoint?: "xs" | "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  rootStyles?: React.CSSProperties;
  theme: "light" | "dark";
}

export const Playground: React.FC<SidebarProps> = ({
  collapsed,
  toggled,
  setToggled,
  onBreakPoint,
  theme,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [dissable, setDissable] = useState(false);
  const rtl = false;
  const hasImage = true;
  const level = HRMStorage.get(KEY_VALUE.LEVEL);

  useEffect(() => {
    if (level !== "LEVEL_4") {
      setDissable(true);
    } else {
      setDissable(false);
    }
  }, [level, dissable]);
  const handleThemeChange = useCallback(
    (theme: "light" | "dark") => {
      dispatch(userActions.setState({ theme: theme }));
      HRMStorage.set(KEY_VALUE.THEME, theme);
    },
    [dispatch]
  );

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }: any) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(
            themes[theme].menu.menuContent,
            hasImage && !collapsed ? 0.2 : 1
          )
          : "transparent",
    }),

    label: ({ open }: any) => ({
      fontWeight: open ? 600 : undefined,
    }),
    button: ({ active }) => {
      return {
        backgroundColor: active
          ? themes[theme].menu.hover.backgroundColor
          : "transparent",
        color: active
          ? themes[theme].menu.hover.color
          : themes[theme].menu.hover.color,
        "&:hover": {
          backgroundColor: themes[theme].menu.hover.backgroundColor,
          color: themes[theme].menu.hover.color,
        },
      };
    },
  };


  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        direction: rtl ? "rtl" : "ltr",
      }}>
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={setToggled}
        onBreakPoint={onBreakPoint}
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        rtl={rtl}
        breakPoint="md"
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.7 : 1
        )}

        rootStyles={{
          color: themes[theme].sidebar.color,
        }}>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <SidebarHeader
            rtl={rtl}
            style={{ marginBottom: "24px", marginTop: "16px" }}
          />
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <div style={{ padding: "0 24px", marginBottom: "8px" }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{
                  opacity: collapsed ? 0 : 0.7,
                  letterSpacing: "0.5px",
                }}></Typography>
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu label={t("sidebar.module")} icon={<Diamond />}>
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    style={{ fontWeight: 600 }}
                    icon={item.icon}
                    active={location.pathname.startsWith(item.path)}
                    component={<Link to={item.path}></Link>}>
                    {t(item.label)}
                  </MenuItem>
                ))}
              </SubMenu>
            </Menu>

            <div
              style={{
                padding: "0 24px",
                marginBottom: "8px",
                marginTop: "32px",
              }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{
                  opacity: collapsed ? 0 : 0.7,
                  letterSpacing: "0.5px",
                }}>
                {t("sidebar.extra")}
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu label={t("sidebar.theme")} icon={<DarkMode />}>
                <MenuItem style={{ fontWeight: 600 }} onClick={() => handleThemeChange("dark")}>
                  {t("sidebar.dark")}
                </MenuItem>
                <MenuItem style={{ fontWeight: 600 }} onClick={() => handleThemeChange("light")}>
                  {t("sidebar.light")}
                </MenuItem>
              </SubMenu>
            </Menu>
          </div>

          <SidebarFooter collapsed={collapsed} />
        </div>
      </Sidebar>
    </div>
  );
};
