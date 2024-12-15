import { FC, useCallback, useState } from "react";
import { ManganTemplateProps } from "./index.interface";
import Box from "@mui/material/Box";
import { Button, FilledInput, FormControl, InputLabel } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { t } from "i18next";
import { AuthService, IPin } from "@/services/auth";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";

export const ChangePinTemplate: FC<ManganTemplateProps> = ({ }) => {
  const confirm = useConfirm();
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
      }
    });
  }, [state]);
  return (
    <Box >
      <FormControl fullWidth sx={{ p: 1, maxWidth: 500 }} variant="filled">
        <InputLabel htmlFor="filled-adornment-amount">Mã pin cũ</InputLabel>
        <FilledInput
          id="oldPin"
          name="oldPin"
          onChange={handleOnChangeField}
          autoFocus
        />

      </FormControl>
      <FormControl fullWidth sx={{ p: 1, maxWidth: 500 }} variant="filled">
        <InputLabel htmlFor="filled-adornment-amount">Mã pin mới</InputLabel>
        <FilledInput
          id="newPin"
          name="newPin"
          onChange={handleOnChangeField}
        />

      </FormControl>     <FormControl fullWidth sx={{ p: 1, maxWidth: 500 }} variant="filled">
        <InputLabel htmlFor="filled-adornment-amount">Nhập lại mã pin</InputLabel>
        <FilledInput
          id='confirmNewPin'
          name="confirmNewPin"
          onChange={handleOnChangeField}
        />

      </FormControl>   <Button sx={{ marginTop: 2, minWidth: 100 }} variant="contained" onClick={handleUpdate}>Cập nhật</Button>
    </Box>
  );
};
