import { ChangeEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import HRMStorage from "@/common/function";
import { KEY_VALUE } from "@/constants/GlobalConstant";
import { background } from "@/assets/index";
import { DateField } from "@/components/atoms/mui/date_field";
import dayjs from "dayjs";
import { AuthService, IUser } from "@/services/auth";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";
import { t } from "i18next";

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
export const Register = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAppSelector((state) => state.auth);
    const isLoggedInEd = Boolean(HRMStorage.get(KEY_VALUE.TOKEN));

    const dispatch = useAppDispatch();
    const [state, setState] = useState<IUser>({
        fullName: "",
        dateOfBirth: "",
        phoneNumber: "",
        expirationDate: "",
        remainingBalance: 0,
        avatarBase64: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setState((prevState) => ({
                    ...prevState,
                    avatarBase64: reader.result as string,
                }));
            };
        } else {
            setState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        state.remainingBalance = Number(state.remainingBalance);
        const result = await AuthService.Register(state);
        if (result.msg_code === MESSAGE_CODE.SUCCESS) {
            toastMessage(t("toast_message.success"), "success");
        }
    };

    const fields = [
        { id: "fullName", label: "Full Name", name: "fullName", type: "text" },
        { id: "dateOfBirth", label: "Birth Day", name: "dateOfBirth", type: "date" },
        { id: "phoneNumber", label: "Phone", name: "phoneNumber", type: "phone" },
        { id: "expirationDate", label: "Expiration Date", name: "expirationDate", type: "date" },
        { id: "remainingBalance", label: "Remaining Balance", name: "remainingBalance", type: "number" },
    ];

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
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                animation: 'backgroundAnimation 10s infinite alternate',
                '@keyframes backgroundAnimation': {
                    '0%': { backgroundPosition: 'center' },
                    '100%': { backgroundPosition: 'top' },
                },
            }} maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: 3,
                        borderRadius: 2,
                    }}
                >
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
                        }}
                    >
                        Register
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        {fields.map((field) => {
                            if (field.type === "date") {
                                return (
                                    <DateField key={field.id}
                                        name={field.name}
                                        label={field.label}
                                        format="DD/MM/YYYY"
                                        onChange={(e) => {
                                            handleChange({
                                                target: {
                                                    name: field.name,
                                                    value: dayjs(e).format("YYYY-MM-DD"),
                                                }
                                            } as ChangeEvent<HTMLInputElement>)

                                        }}
                                    />
                                )
                            } else if (field.type === "amount") {
                                return (
                                    <></>
                                );
                            } else {
                                return (
                                    <TextField
                                        key={field.id}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id={field.id}
                                        label={field.label}
                                        name={field.name}
                                        type={field.type}
                                        autoComplete={field.name}
                                        autoFocus
                                        onChange={handleChange}
                                    />
                                );
                            }
                        })}
                        <Button
                            variant="contained"
                            component="label"
                        >
                            Upload File
                            <input
                                type="file"
                                hidden
                                onChange={handleChange}
                            />
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {"You have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4, color: "#fff" }} />
            </Container>
        </ThemeProvider>
    );
};