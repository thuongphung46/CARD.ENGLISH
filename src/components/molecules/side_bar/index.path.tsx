import { Home, Key, Payment, Paid } from "@mui/icons-material";
import { ReactElement } from "react";

interface MenuItem {
  path: string;
  label: string;
  icon: ReactElement;
}

export const menuItems: MenuItem[] = [
  { path: "/home", label: "sidebar.menu.home", icon: <Home /> },
  { path: "/change-pin", label: "sidebar.menu.change_pin", icon: <Key /> },
  { path: "/recharge", label: "sidebar.menu.recharge", icon: <Paid /> },
  { path: "/payment", label: "sidebar.menu.payment", icon: <Payment /> },
  // { path: "/character", label: "sidebar.menu.character", icon: <Person /> },
];
