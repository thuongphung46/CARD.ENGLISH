import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { t } from "i18next";
import { useConfirm } from "material-ui-confirm";

import { FC, useCallback } from "react";

interface IPopupModal {
  open: boolean;
  handleClose: () => void;
  handleSave: () => void;
  children: React.ReactNode;
}
export const PopupModal: FC<IPopupModal> = ({
  open,
  handleClose,
  handleSave,
  children,
}) => {
  const confirm = useConfirm();

  const handleConfirmSaveData = useCallback(() => {
    confirm({
      title: t("confirm.save_title"),
      description: t("confirm.save_description"),
      confirmationText: t("navbar.confirm.ok"),
      cancellationText: t("navbar.confirm.cancel"),
    }).then(() => {
      handleSave();
    });
  }, [confirm, handleSave]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            height: "30%",
            width: "60%",
            backgroundColor: "#fff",
            padding: "12px",
            borderRadius: "4px",
            boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",

          }}
        >
          <Box height={32}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleConfirmSaveData}
            >
              Lưu
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              height: "calc(100% - 32px)", overflow: "auto",
            }}
          >
            {children}
          </Box>
        </div>
      </Modal>
    </>
  );
};
