import {ChangeEvent, useEffect, useState} from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import HRMStorage from "@/common/function";
import {KEY_VALUE} from "@/constants/GlobalConstant";
import {authActions} from "@/redux/slices/authSlice";
import {toastMessage} from "@/components/atoms/toast_message";

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
    const {isLoggedIn} = useAppSelector((state) => state.auth);
    const isLoggedInEd = Boolean(HRMStorage.get(KEY_VALUE.TOKEN));
    const dispatch = useAppDispatch();
    const [state, setstate] = useState({
        pin: "",
    });
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };
    const onPinChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setstate({...state, pin: e.target.value});
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
                    <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            animation: 'fadeIn 2s',
                            '@keyframes fadeIn': {
                                from: {opacity: 0},
                                to: {opacity: 1},
                            },
                            fontWeight: 'bold',
                            color: 'primary.main',
                            mb: 2,
                        }}
                    >
                        Welcome to English Course
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{mt: 1}}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="pin"
                            label="Enter your pin"
                            name="pin"
                            autoComplete="pin"
                            onChange={onPinChange}
                            // value={state.email}
                            autoFocus
                        />

                        <Button
                            type="submit"
                            onClick={handleLogin}
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Connect
                        </Button>

                        <Grid container>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
};
