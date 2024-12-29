import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import HRMStorage from "@/common/function";
import { KEY_VALUE } from "@/constants/GlobalConstant";
import { authActions } from "@/redux/slices/authSlice";
import { toastMessage } from "@/components/atoms/toast_message";
import { AuthService } from "@/services/auth";
import { MESSAGE_CODE } from "@/interfaces/enum";
import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";
import { userActions } from "@/redux/slices/userSlice";
import { t } from "i18next";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Copyright(props: any) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const theme = createTheme();

export const SignIn = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAppSelector((state) => state.auth);
    const isLoggedInEd = Boolean(HRMStorage.get(KEY_VALUE.TOKEN));
    const dispatch = useAppDispatch();
    const [state, setstate] = useState({
        pin: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        pin: false,
    });

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };
    const onPinChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setstate({ ...state, pin: e.target.value });
    };

    const handleLogin = () => {
        if (state.pin != null) {
            dispatch(
                authActions.login({
                    pin: state.pin,
                })
            );
        } else {
            toastMessage("Please enter information ", "error");
        }
    };
    const handleUnlock = useCallback(() => {
        AuthService.UnlockCard().then((res) => {
            if (res.msg_code === MESSAGE_CODE.SUCCESS) {
                toastMessage(res.message, "success");
            } else {
                toastMessage(res.message, "error");
            }
        }
        );
    }, []);
    const switchLanguage = useCallback(
        (language: "en" | "vi") => {
            dispatch(userActions.setState({ language }));
            HRMStorage.set(KEY_VALUE.LANGUAGE, language);
            window.location.reload();

        },
        [confirm, dispatch]
    );
    useEffect(() => {
        if (isLoggedIn || isLoggedInEd) {
            navigate("/home");
        }
    }, [isLoggedIn, isLoggedInEd, navigate]);

    return (
        <ThemeProvider theme={theme}>
            <Container sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }} maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            animation: 'fadeIn 2s',
                            '@keyframes fadeIn': {
                                from: { opacity: 0 },
                                to: { opacity: 1 },
                            },
                            fontWeight: 'bold',
                            color: 'primary.main',
                            mb: 2,
                            textAlign: 'center'
                        }}
                    >{t('common.wellcome')}</Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1, width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="pin"
                            label={t('common.enter_pin')}
                            name="pin"
                            autoComplete="pin"
                            onChange={onPinChange}
                            autoFocus
                            type={showPasswords.pin ? "text" : "password"}
                            inputProps={{ maxLength: 6 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPasswords.pin ? "hide the password" : "display the password"
                                            }
                                            onClick={() => togglePasswordVisibility("pin")}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPasswords.pin ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', width: '100%' }}>
                            <Button
                                type="submit"
                                onClick={handleLogin}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {t('common.connect')}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleUnlock}
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {t('common.unlocked')}
                            </Button>
                        </div>
                        <ImageList
                            sx={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                display: "flex",
                                gap: "8px",
                                backgroundColor: "#f9f9f9",
                                padding: "8px",
                                borderRadius: "4px",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                zIndex: 1000,
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
                        <Grid container>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {t('common.sign_up')}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
};
