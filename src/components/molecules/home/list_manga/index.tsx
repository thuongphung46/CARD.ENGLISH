import { ChangeEvent, FC, Fragment, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { AuthService, IUser } from "@/services/auth";
import { DateField } from "@/components/atoms/mui/date_field";
import dayjs from "dayjs";
import { Avatar, Button, CardHeader, TextField } from "@mui/material";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";
import { t } from "i18next";
import EarningCard from "@/components/atoms/card";

interface Props {
}

export const ListManga: FC<Props> = () => {
    const [state, setState] = useState<IUser | undefined>({
        fullName: "",
        dateOfBirth: "",
        phoneNumber: "",
        expirationDate: "",
        remainingBalance: 0,
        avatarBase64: "",
    });

    useEffect(() => {
        const fetchUserInfor = async () => {
            const result = await AuthService.GetInFo();
            if (result.msg_code === MESSAGE_CODE.SUCCESS) {
                setState(result.content);
            } else {
                toastMessage(result.message, "error");
            }
        }
        fetchUserInfor()
    }, []);

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

    const handleSubmit = async () => {
        console.log('Update');
        // check dữ liệu có undefined không
        if (!state) return;
        state.remainingBalance = Number(state.remainingBalance);
        // kiểm
        const result = await AuthService.Update(state);
        if (result.msg_code === MESSAGE_CODE.SUCCESS) {
            // chưa cập nhật lại thông tin user
            toastMessage(t("toast_message.success"), "success");
        } else {
            toastMessage(result.message, "error");
        }

    };

    const fields = [
        { id: "fullName", label: "common.full_name", name: "fullName", type: "text", disabled: false },
        { id: "dateOfBirth", label: "common.birthday", name: "dateOfBirth", type: "date", disabled: false },
        { id: "phoneNumber", label: "common.phone", name: "phoneNumber", type: "phone", disabled: false },
        { id: "expirationDate", label: "common.expirate_date", name: "expirationDate", type: "date", disabled: true },
    ];

    const renderField = useMemo(() => {
        return (
            <>
                {fields.map((field) => {
                    if (field.type === "date") {
                        return (
                            <DateField
                                key={field.id}
                                name={field.name}
                                label={t(field.label)}
                                format="DD/MM/YYYY"
                                sx={{ width: "100%", maxWidth: 500 }}
                                value={state?.[field.name as keyof IUser] ? dayjs(state[field.name as keyof IUser] as string) : null} // dùng null thay vì undefined
                                disabled={field.disabled}
                                onChange={(e) => {
                                    handleChange({
                                        target: {
                                            name: field.name,
                                            value: dayjs(e).format("YYYY-MM-DD"),
                                        }
                                    } as ChangeEvent<HTMLInputElement>);
                                }}
                            />
                        )
                    } else {
                        return (
                            <TextField
                                key={field.id}
                                required
                                fullWidth
                                sx={{ width: "100%", maxWidth: 500 }}
                                id={field.id}
                                label={t(field.label)}
                                name={field.name}
                                type={field.type}
                                disabled={field.name === "remainingBalance"}
                                autoComplete={field.name}
                                value={state?.[field.name as keyof IUser] || ""}
                                autoFocus={field.name === "fullName"}
                                onChange={handleChange}
                            />
                        );
                    }
                })}
            </>
        );
    }, [fields, state]);
    return (
        <Box>
            <EarningCard value={
                new Intl.NumberFormat('vi-VN').format(state?.remainingBalance || 0)}
                isLoading={false}
            />
            <div style={{ height: "20px" }}></div>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ '& .MuiTextField-root': { width: '100%', p: 1 } }}
            >
                {renderField}
            </Box>
            <Button
                variant="contained"
                component="label"
            >
                {t("common.upload_image")}
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
            /><Button
                type="button"
                fullWidth
                onClick={handleSubmit}
                variant="contained"
                sx={{ mt: 3, mb: 2, maxWidth: 200 }}
            >
                {t("common.update")}
            </Button>
        </Box>
    );
};
