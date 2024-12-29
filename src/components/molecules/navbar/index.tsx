import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreIcon from "@mui/icons-material/MoreVert";
import LinearProgress from "@mui/material/LinearProgress";
import { ImageList, ImageListItem } from "@mui/material";
import { t } from "i18next";
import HRMStorage from "@/common/function";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { userActions } from "@/redux/slices/userSlice";
import { useConfirm } from "material-ui-confirm";
import { KEY_VALUE } from "@/constants/GlobalConstant";
import { GlobalStyle } from "@/common/color";
import useWindowDimensions from "@/hook/useWindownDimensions";
import { AuthService } from "@/services/auth";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { useNavigate } from "react-router-dom";
import { authActions } from "@/redux/slices/authSlice";
import { toastMessage } from "@components/atoms/toast_message";

interface PrimarySearchAppBarProps {
    setCollapsed: () => void;
    collapsed: boolean;
    setToggled: () => void;
    toggled: boolean;
    broken: boolean;
}

export const PrimarySearchAppBar: React.FC<PrimarySearchAppBarProps> = ({
    setCollapsed,
    setToggled,
    broken,
}) => {
    const confirm = useConfirm();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { width } = useWindowDimensions()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { loading } = useAppSelector((state) => state.loading);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const switchLanguage = React.useCallback(
        (language: "en" | "vi") => {
            confirm({
                title: t("navbar.confirm.switch_language_title"),
                description: t("navbar.confirm.switch_language_description"),
                confirmationText: t("navbar.confirm.ok"),
                cancellationText: t("navbar.confirm.cancel"),
            }).then(() => {
                dispatch(userActions.setState({ language }));
                HRMStorage.set(KEY_VALUE.LANGUAGE, language);
                window.location.reload();
            });
        },
        [confirm, dispatch]
    );
    const handleLogout = React.useCallback(() => {
        confirm({
            title: t("navbar.confirm.logout_title"),
            description: t("navbar.confirm.logout_description"),
            confirmationText: t("navbar.confirm.ok"),
            cancellationText: t("navbar.confirm.cancel"),
        }).then(async () => {
            const result = await AuthService.Disconnect();
            if (result.msg_code === MESSAGE_CODE.SUCCESS) {
                HRMStorage.clear();
                dispatch(authActions.logout());
                setTimeout(() => {
                    navigate("/login");
                }, 200);
            } else {
                toastMessage(result.message, "error");
            }

        });
    }, [confirm]);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}>
            <Box
                sx={{
                    height: "250px",
                    width: "248px",
                    padding: "4px",
                }}>
                <MenuItem onClick={() => {
                    navigate("/home");
                    handleMenuClose();
                }}>
                    <Badge badgeContent={4} color="error">
                        <Person2Icon />
                    </Badge>
                    <p style={{ marginLeft: "12px" }}> {t("navbar.profile")}</p>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <LogoutIcon />
                    <p style={{ marginLeft: "12px" }}>{t("navbar.logout")}</p>
                </MenuItem>
                <Typography
                    sx={{
                        padding: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                    }}>
                    {t("common.language")}
                </Typography>
                <ImageList
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}>
                    <ImageListItem
                        onClick={() => switchLanguage("en")}
                        sx={{
                            border: "1px solid #fff",
                            "&:hover": {
                                border: "1px solid #ccc",
                            },
                        }}>
                        <img
                            style={{
                                cursor: "pointer",
                                width: "47px",
                                height: "25px",
                            }}
                            src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABQUlEQVRoge3WsUrDUBTG8X80qC1CCLg5uHSwQzfBxaGLiKPiW/gCdezQ1UfwCRQndRAXBQmCiw7dhFIIFdGESMUIGqcEoyK03ptw4fym3OXmfpyccwNCCCGEKI8FkCSJ1dw8/lC9+VHUVr1lZvbsygKY0PaGguQCVCs2G+sLY68bdZdG3dV53h/s9GF6apLd9jKLNYenMMa7fhhpfdd7prOzBMB265K+P+R1/1TfyV0nHyB+e+fcG+Dfv3DTDUZeB2HMhTcAoO8P9R38G61NfLC3onrLzJzrWPClAqlqxWatOc/hSW+sddoDt92Ama1VbQFSuQCq+4BI+/nzAUzsA+N7QO6Bv+6BQgPo+P6LmELyM1e2rAKPYaS8Ajr9OoVMZHyAbAoVMTF0ML4CxgeQKVQ24wPIFCqb8QGEEEIIIf7hEycURuUfhn7yAAAAAElFTkSuQmCC`}
                        />
                    </ImageListItem>
                    <ImageListItem
                        onClick={() => switchLanguage("vi")}
                        sx={{
                            border: "1px solid #fff",
                            "&:hover": {
                                border: "1px solid #ccc",
                            },
                        }}>
                        <img
                            style={{
                                cursor: "pointer",
                                width: "47px",
                                height: "25px",
                            }}
                            src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABsElEQVRoge2Yy0rDQBSG/0kmtEisKK5c+ASKiDcQ26cRxY2iPoDgyr24ddEX6APUlT6BCi68FaQqFSpRcNLm6iIIFtpqyRmDcD4IDMkw53zMORMSgGEYhmH+MeJrcDkzE2eZyKBMn58LADCyTiQtLJA1LJA1LNAPa1zAGhc/T0yBVoFCUaKwInWG+AOBkl4BbavLUYGhKRMCgBwzELxGWuJo24HCioQwkgiFZVNXGI0CRdl1TE3qlUdKEhM7OZh279PGnjMxdWJ33ItUjKdDD07VTxU/9Q68nQa4W1dQV7+vcfc6wu2Gmzp5gKiEvEaM2rbCS9kD+nnEQLPi435LwXukaWqy4oxD4KXsoVWLMLmX7zrnYb+F97OAKiQADU1sWL2fCYv+rUwu8P3Eif3k+mKkSH+ckgoYOcBeSJL0GjFquy7uN12060m924sSRp52F0gF7KUkQafq43ZVQV2FcG9C3K0pNCt+hyAVpG+Y4XmJ+kELzklno0Ye8HzUxsdlCHvWJG1kUoHGcRuB0/vnxvtpAHURUoakLaF+yQ8yZxD4iyxrWCBrWIBhGIZhmBR8AlAegdvTb90RAAAAAElFTkSuQmCC`}
                        />
                    </ImageListItem>
                </ImageList>
            </Box>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}>
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton size="large" aria-label="show 17 new notifications">
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true">
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    sx={{
                        backgroundColor: "transparent",
                        color: "black",
                        boxShadow: "none",
                        borderBottom: "1px solid #e0e0e0",
                        height: width < 600 ? GlobalStyle.H_NAVBAR_MIN : GlobalStyle.H_NAVBAR_MAX,
                    }}
                    position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            onClick={broken ? setToggled : setCollapsed}>
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: "none", sm: "block" } }}></Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: "none", md: "flex" } }}>
                            {/* <IconButton size="large" aria-label="show 4 new mails">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" aria-label="show 17 new notifications">
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}>
                                <AccountCircle />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}>
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
                {renderMenu}
            </Box>
            <Box
                sx={{
                    position: "relative",
                    height: 4,
                    width: "100%",
                }}>
                {loading && (
                    <LinearProgress
                        sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
                    />
                )}
            </Box>
        </>
    );
};
