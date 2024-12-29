import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { CategoryTemplateProps } from "./index.interface";
import Box from "@mui/material/Box";
import { useConfirm } from "material-ui-confirm";
import { t } from "i18next";
import { AuthService, IPayment } from "@/services/auth";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import HRMStorage from "@/common/function";
import { KEY_VALUE } from "@/constants/GlobalConstant";
import EarningCard from "@/components/atoms/card";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const PaymentTemplate: FC<CategoryTemplateProps> = ({ }) => {
    const confirm = useConfirm();
    const memberId = HRMStorage.get(KEY_VALUE.TOKEN);
    // const memberId = "81a0e81c-3879-4987-9d8f-328810422e13";
    const language = HRMStorage.get(KEY_VALUE.LANGUAGE);
    const [state, setState] = useState({
        remaningBalance: 0,
        englishCource: [],
        totalBill: 0,
        pinCode: "",
        totalMonth: 0
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
    useEffect(() => {
        //tính tổng tiền
        const totalBill = state.englishCource.reduce((total: number, item: any) => total + item.price, 0);
        const totalMonth = state.englishCource.reduce((total: number, item: any) => total + item.totalMonth, 0);
        setState((prev) => ({
            ...prev,
            totalMonth: totalMonth,
            totalBill: totalBill
        }));
    }, [state.englishCource]);
    useEffect(() => {
        const fetchUserInfor = async () => {
            const result = await AuthService.GetInFo();
            if (result.msg_code === MESSAGE_CODE.SUCCESS) {
                setState((prev) => ({
                    ...prev,
                    remaningBalance: result.content.remainingBalance
                }));
            }
        }
        fetchUserInfor()
    }, []);
    const handleOnChangeField = useCallback((e: any) => {
        const { name, value } = e.target;
        setState((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);
    const handleUpdate = useCallback((e: any) => {
        confirm({
            title: t("confirm.save_title"),
            description: t("confirm.save_description"),
            confirmationText: t("navbar.confirm.ok"),
            cancellationText: t("navbar.confirm.cancel"),

        }).then(async () => {
            if (!state.pinCode || !state.totalBill || !memberId || !state.totalMonth) {
                toastMessage(t("toast_message.error"), "error");
                return;
            }
            const data: IPayment = {
                memberId: memberId,
                pinCode: state.pinCode,
                totalBill: state.totalBill,
                totalMonth: state.totalMonth
            }
            const result = await AuthService.Payment(data);
            if (result.msg_code === MESSAGE_CODE.SUCCESS) {
                setState((prev) => ({
                    ...prev,
                    remaningBalance: result.content.remainingBalance
                }));

                toastMessage(t("toast_message.success"), "success");
            } else {
                toastMessage(result.message, "error");
            }
        });
    }, [state]);
    return (
        <Fragment> <Box component="form"
            sx={{ '& .MuiTextField-root': { mt: 1, width: '100%', p: 1, } }}>
            <EarningCard value={
                new Intl.NumberFormat('vi-VN').format(state.remaningBalance)
            } isLoading={false} />
            <Autocomplete
                autoFocus
                size="medium"
                sx={{ width: "100%", maxWidth: 1000 }}
                filterSelectedOptions
                onChange={(e, newValue: any) => {
                    handleOnChangeField({
                        target: {
                            name: "englishCource",
                            value: newValue ? [newValue] : [],
                        },
                    });
                }}
                options={dataEnglishCource}
                getOptionKey={(option) => option.price}
                getOptionLabel={(option) => language === "en" ? option.name_en : option.name_vi}
                renderOption={
                    (props, option, { selected }) => {
                        const formattedPrice = new Intl.NumberFormat('vi-VN').format(option.price);
                        return <li {...props} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            maxWidth: 500,
                            padding: 4
                        }}>
                            <span>{language === "en" ? option.name_en : option.name_vi}</span>
                            <span>{formattedPrice} {option.currency}</span>
                        </li>
                    }
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="medium"
                        placeholder={t("common.english_cource")}
                        variant="outlined"
                    />
                )}
            />
            <TextField
                id="totalBill"
                name="totalBill"
                label={t("common.total_bill")}
                value={state.totalBill}
                disabled
                fullWidth
                sx={{ maxWidth: 500 }}
                defaultValue={0}
            ></TextField>
            <TextField
                id="pinCode"
                name="pinCode"
                label={t("common.pin_code")}
                value={state.pinCode}
                onChange={handleOnChangeField}
                fullWidth
                sx={{ maxWidth: 500 }}
                defaultValue={0}
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
            ></TextField>


        </Box>
            <Button sx={{ minWidth: 100 }} variant="contained"
                onClick={handleUpdate}>{t("common.register")}</Button></Fragment>
    );
};


const dataEnglishCource = [
    {
        "name_en": "Copper Course",
        "name_vi": "Khóa Đồng",
        "price": 1000000,
        "currency": "vnd",
        "totalMonth": 1
    },
    {
        "name_en": "Silver Course",
        "name_vi": "Khóa Bạc",
        "price": 2500000,
        "currency": "vnd",
        "totalMonth": 3
    },
    {
        "name_en": "Golden Course",
        "name_vi": "Khóa Vàng",
        "price": 3000000,
        "currency": "vnd",
        "totalMonth": 6
    },
    {
        "name_en": "Diamond Course",
        "name_vi": "Khóa Kim Cương",
        "price": 5000000,
        "currency": "vnd",
        "totalMonth": 12
    }
]
