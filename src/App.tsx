import CssBaseline from "@mui/material/CssBaseline";
import { ConfirmProvider } from "material-ui-confirm";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { PaletteMode } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { RootState } from "@redux/store";
import HRMStorage from "./common/function";
import { KEY_VALUE } from "./constants/GlobalConstant";
import { useEffect } from "react";
import { userActions } from "./redux/slices/userSlice";
import "react-toastify/dist/ReactToastify.css";

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: mode === "dark" ? "#90caf9" : "#1976d2",
    },
    ...(mode === "dark" && {
      background: {
        default: grey[900],
        paper: grey[800],
      },
    }),
    ...(mode === "light" && {
      background: {
        default: "#fff",
        paper: "#ffffff",
      },
    }),
    text: {
      ...(mode === "light"
        ? {
          primary: grey[900], // Màu chữ chính là đen nhạt.
          secondary: "#6a1b9a", // Màu chữ phụ là tím đậm.
        }
        : {
          primary: "#fff",
          secondary: grey[500],
        }),
    },
  },
});


function App() {
  const dispatch = useAppDispatch();

  const { theme } = useAppSelector((state: RootState) => state.user);
  const themeMode: PaletteMode = theme || "light";
  const darkModeTheme = createTheme(getDesignTokens(themeMode));

  useEffect(() => {
    const fetchData = async () => {
      const theme = (await HRMStorage.get(KEY_VALUE.THEME)) as "light" | "dark";
      const language = (await HRMStorage.get(KEY_VALUE.LANGUAGE)) as
        | "vi"
        | "en";
      if (theme) {
        dispatch(userActions.setState({ theme, language }));
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <>
      <ThemeProvider theme={darkModeTheme}>
        <CssBaseline />
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
        <ToastContainer />
      </ThemeProvider>
    </>
  );
}

export default App;
