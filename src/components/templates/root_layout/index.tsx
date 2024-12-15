import { Box } from "@mui/material";
import HRMStorage from "@common/function";
import { PrimarySearchAppBar } from "@components/molecules/navbar";
import { Playground } from "@components/molecules/side_bar";
import { KEY_VALUE } from "@constants/GlobalConstant";
import React, { useCallback, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";
type Theme = "light" | "dark";
const RootLayout = () => {
  const navigate = useNavigate();
  const { theme } = useAppSelector((state: RootState) => state.user);
  const [collapsed, setCollapsed] = React.useState(false);
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);

  // const currentUser = true;

  const currentUser = Boolean(HRMStorage.get(KEY_VALUE.TOKEN));
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);
  const handleToggled = useCallback(() => {
    setToggled(!toggled);
  }, [toggled]);
  const handleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const handleBroken = useCallback((e: boolean) => {
    setBroken(e);
  }, []);

  if (currentUser) {
    return (
      <Box
        component="div"
        className={"main-app"}
        sx={{
          flexDirection: "row",
          display: "flex",
          flex: 1,
          height: "100vh",
          width: "100%",
        }}>
        <Playground
          collapsed={collapsed}
          setToggled={handleToggled}
          toggled={toggled}
          onBreakPoint={handleBroken}
          theme={theme}
        />
        <Box
          id={"side-bar"}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            transition: "width 0.3s ease", // không bị giật khi thay đổi width
            "@media screen and (min-width: 48em)": {
              width: `calc(100% - ${collapsed ? 80 : 250}px)`,
            },
          }}>
          <PrimarySearchAppBar
            setCollapsed={handleCollapsed}
            collapsed={collapsed}
            setToggled={handleToggled}
            toggled={toggled}
            broken={broken}
          />
          <Box
            id={"main-view"}
            sx={{
              height: "100%",
              overflow: "auto",
              padding: "4px",
            }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default RootLayout;
