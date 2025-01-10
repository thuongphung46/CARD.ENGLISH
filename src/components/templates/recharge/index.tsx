import { FC, useCallback, useState, useEffect } from "react";
import { AuthorTemplateProps } from "./index.interface";
import Box from "@mui/material/Box";
import { Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, TextField } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { t } from "i18next";
import { AuthService } from "@/services/auth";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";
import HRMStorage from "@/common/function";
import { KEY_VALUE } from "@/constants/GlobalConstant";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Function to format numbers with commas
const formatNumber = (value: number | string) => {
    if (value === "" || value === 0) return "";
    return new Intl.NumberFormat("en-US").format(Number(value));
};

export const RechargeTemplate: FC<AuthorTemplateProps> = () => {
    const confirm = useConfirm();
    const [state, setState] = useState({
        remainingBalance: 0,
        pinCode: "",
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

    // Handle field changes for both remainingBalance and pinCode
    const handleOnChangeField = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // If the value contains commas, remove them
        let cleanValue = value.replace(/,/g, "");

        // Only update the remainingBalance or pinCode fields
        setState((prev) => ({
            ...prev,
            [name]: cleanValue,
        }));
    }, []);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleUpdate = useCallback((e: any) => {
        console.log("Current state values before submitting:", state);
        confirm({
            title: t("confirm.save_title"),
            description: t("confirm.save_description"),
            confirmationText: t("navbar.confirm.ok"),
            cancellationText: t("navbar.confirm.cancel"),
        }).then(async () => {
            const memberId = HRMStorage.get(KEY_VALUE.TOKEN);
            const result = await AuthService.Recharge({
                memberId: memberId,
                remainingBalance: state.remainingBalance,
                pinCode: state.pinCode,
            });
            if (result.msg_code === MESSAGE_CODE.SUCCESS) {
                toastMessage(t("toast_message.success"), "success");
            } else {
                toastMessage(result.message, "error");
            }
        });
    }, [state.remainingBalance, state.pinCode]);

    return (
        <Box>
            <FormControl fullWidth sx={{ m: 1, maxWidth: 500 }} variant="filled">
                <InputLabel htmlFor="filled-adornment-amount"></InputLabel>
                <FilledInput
                    id="filled-adornment-amount"
                    endAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                    type="text"  // Use text input to allow formatted numbers
                    autoFocus
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            display: "none",
                        },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                        marginBottom: 1, // Margin to create space between the fields
                    }}
                    name="remainingBalance"
                    value={formatNumber(state.remainingBalance)}  // Format the value for display
                    onChange={handleOnChangeField}
                    inputProps={{
                        placeholder: "Số tiền",  // Placeholder text
                    }}
                />
                <TextField
                    id="pinCode"
                    name="pinCode"  // Ensure the name matches the state property
                    label={t("common.pin_code")}
                    value={state.pinCode}  // Controlled input with value
                    onChange={handleOnChangeField}
                    fullWidth
                    sx={{
                        maxWidth: 500,
                        marginTop: 2,  // Margin to space out from the above field
                    }}
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
                        ),
                    }}
                />
                <Button sx={{ marginTop: 2 }} variant="contained" onClick={handleUpdate}>
                    {t("common.recharge")}
                </Button>
            </FormControl>
        </Box>
    );
};
