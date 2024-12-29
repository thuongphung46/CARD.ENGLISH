import { FC, useCallback, useState } from "react";
import { ManganTemplateProps } from "./index.interface";
import Box from "@mui/material/Box";
import { Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { t } from "i18next";
import { AuthService, IPin } from "@/services/auth";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";
import { useNavigate } from "react-router-dom";
import HRMStorage from "@common/function.ts";
import { authActions } from "@redux/slices/authSlice.ts";
import { useAppDispatch } from "@redux/hook.ts";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const ChangePinTemplate: FC<ManganTemplateProps> = () => {
    const confirm = useConfirm();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [state, setState] = useState<IPin>({
        oldPin: "",
        newPin: "",
        confirmNewPin: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPin: false,
        newPin: false,
        confirmNewPin: false,
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

    const handleOnChangeField = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (/^\d{0,6}$/.test(value)) {
            setState((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }, []);

    const handleUpdate = useCallback(() => {
        confirm({
            title: t("confirm.save_title"),
            description: t("confirm.save_description"),
            confirmationText: t("navbar.confirm.ok"),
            cancellationText: t("navbar.confirm.cancel"),
        }).then(async () => {
            const result = await AuthService.ChangePin(state);
            if (result.msg_code === MESSAGE_CODE.SUCCESS) {
                toastMessage(t("toast_message.success"), "success");
                HRMStorage.clear();
                dispatch(authActions.logout());
                setTimeout(() => {
                    navigate("/login");
                }, 200);
            } else {
                toastMessage(result.message, "error");
            }
        });
    }, [state, confirm, dispatch, navigate]);

    const renderPasswordField = (labelKey: string, fieldName: keyof IPin, showPassword: boolean) => (
        <FormControl fullWidth sx={{ p: 1, maxWidth: 500 }} variant="filled">
            <InputLabel htmlFor={fieldName}>{t(labelKey)}</InputLabel>
            <FilledInput
                id={fieldName}
                name={fieldName}
                onChange={handleOnChangeField}
                type={showPassword ? "text" : "password"}
                inputProps={{ maxLength: 6 }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={
                                showPassword ? "hide the password" : "display the password"
                            }
                            onClick={() => togglePasswordVisibility(fieldName)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    );

    return (
        <Box>
            {renderPasswordField("change_pin.old_pin", "oldPin", showPasswords.oldPin)}
            {renderPasswordField("change_pin.new_pin", "newPin", showPasswords.newPin)}
            {renderPasswordField("change_pin.confirm_pin", "confirmNewPin", showPasswords.confirmNewPin)}
            <Button
                sx={{ marginTop: 2, minWidth: 100 }}
                variant="contained"
                onClick={handleUpdate}
            >
                {t("common.update")}
            </Button>
        </Box>
    );
};
