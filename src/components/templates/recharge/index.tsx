import {FC, useCallback, useState} from "react";
import {AuthorTemplateProps} from "./index.interface";
import Box from "@mui/material/Box";
import {Button, FilledInput, FormControl, InputAdornment, InputLabel} from "@mui/material";
import {useConfirm} from "material-ui-confirm";
import {t} from "i18next";
import {AuthService} from "@/services/auth";
import {MESSAGE_CODE} from "@/interfaces/enum";
import {toastMessage} from "@/components/atoms/toast_message";

export const RechargeTemplate: FC<AuthorTemplateProps> = () => {
    const confirm = useConfirm();
    const [state, setState] = useState({
        remainingBalance: 0,
    });

    const handleOnChangeField = useCallback((e: any) => {
        const {value} = e.target;
        setState(
            {
                remainingBalance: Number(value),
            }
        );
    }, []);
    const handleUpdate = useCallback((e: any) => {
        confirm({
            title: t("confirm.save_title"),
            description: t("confirm.save_description"),
            confirmationText: t("navbar.confirm.ok"),
            cancellationText: t("navbar.confirm.cancel"),

        }).then(async () => {
            const result = await AuthService.Recharge(state.remainingBalance);
            if (result.msg_code === MESSAGE_CODE.SUCCESS) {
                toastMessage(t("toast_message.success"), "success");
            } else {
                toastMessage(result.message, "error");
            }
        });
    }, [state.remainingBalance]);
    return (
        <Box>
            <FormControl fullWidth sx={{m: 1, maxWidth: 500}} variant="filled">
                <InputLabel htmlFor="filled-adornment-amount"></InputLabel>
                <FilledInput
                    id="filled-adornment-amount"
                    endAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                    type="number"
                    autoFocus
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            display: "none",
                        },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                    onChange={handleOnChangeField}
                />
                <Button sx={{marginTop: 2}} variant="contained" onClick={handleUpdate}>{t("common.recharge")}</Button>
            </FormControl>
        </Box>
    );
};
