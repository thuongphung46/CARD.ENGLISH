import { FC, useCallback, useState } from "react";
import { ManganTemplateProps } from "./index.interface";
import Box from "@mui/material/Box";
import { Button, FilledInput, FormControl, InputLabel } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { t } from "i18next";
import { AuthService, IPin } from "@/services/auth";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";
import { useNavigate } from "react-router-dom";
import HRMStorage from "@common/function.ts";
import { authActions } from "@redux/slices/authSlice.ts";
import { useAppDispatch } from "@redux/hook.ts";

export const ChangePinTemplate: FC<ManganTemplateProps> = ({ }) => {
    const confirm = useConfirm();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [state, setState] = useState<IPin>({
        oldPin: "",
        newPin: "",
        confirmNewPin: "",
    });
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
    }, [state]);
    return (
        <Box>
            <FormControl fullWidth sx={{ p: 1, maxWidth: 500 }} variant="filled">
                <InputLabel htmlFor="filled-adornment-amount">{t("change_pin.old_pin")}</InputLabel>
                <FilledInput
                    id="oldPin"
                    name="oldPin"
                    onChange={handleOnChangeField}
                    autoFocus
                />

            </FormControl>
            <FormControl fullWidth sx={{ p: 1, maxWidth: 500 }} variant="filled">
                <InputLabel htmlFor="filled-adornment-amount">{t("change_pin.new_pin")}</InputLabel>
                <FilledInput
                    id="newPin"
                    name="newPin"
                    onChange={handleOnChangeField}
                />

            </FormControl> <FormControl fullWidth sx={{ p: 1, maxWidth: 500 }} variant="filled">
                <InputLabel htmlFor="filled-adornment-amount">{t("change_pin.confirm_pin")}</InputLabel>
                <FilledInput
                    id='confirmNewPin'
                    name="confirmNewPin"
                    onChange={handleOnChangeField}
                />

            </FormControl> <Button sx={{ marginTop: 2, minWidth: 100 }} variant="contained" onClick={handleUpdate}>{t("common.update")}</Button>
        </Box>
    );
};
