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
import { Avatar, CardHeader } from "@mui/material";

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
        expirationDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
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
            reader.readAsDataURL(files[0]);
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
            navigate("/login");
            toastMessage(t("toast_message.success"), "success");
        } else {
            toastMessage(result.message, "error");
        }
    };

    const fields = [
        { id: "fullName", label: "page_register.full_name", name: "fullName", type: "text", defaultValue: state.fullName },
        { id: "dateOfBirth", label: "page_register.birthday", name: "dateOfBirth", type: "date", defaultValue: state.dateOfBirth },
        { id: "phoneNumber", label: "page_register.phone", name: "phoneNumber", type: "phone", defaultValue: state.phoneNumber },
        { id: "expirationDate", label: "page_register.expirate_date", name: "expirationDate", type: "date", defaultValue: state.expirationDate, disabled: true },
        { id: "remainingBalance", label: "page_register.balance", name: "remainingBalance", type: "number", defaultValue: 0, disabled: true },
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
                        {t("page_register.register")}
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
                                        label={t(field.label)}
                                        format="DD/MM/YYYY"
                                        disabled={field.disabled}
                                        defaultValue={field.defaultValue ? dayjs(field.defaultValue) : undefined}
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
                                        label={t(field.label)}
                                        name={field.name}
                                        type={field.type}
                                        autoComplete={field.name}
                                        disabled={field.disabled}
                                        defaultValue={field.defaultValue}
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
                            {t("common.upload_file")}
                            <input
                                type="file"
                                hidden
                                onChange={handleChange}
                            />
                        </Button>
                        <CardHeader
                            avatar={<Avatar sx={{
                                width: 100,
                                height: 100,
                            }} alt="Apple" src={state?.avatarBase64} />}
                            titleTypographyProps={{ variant: "h2", component: "span" }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {t("page_register.register")}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {t("common.sign_in")}
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