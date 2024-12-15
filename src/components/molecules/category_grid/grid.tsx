import { FC, useCallback } from "react";
import Box from "@mui/material/Box";
import { BaseGrid } from "@components/atoms/datagrid";
import { columns } from "@/components/molecules/category_grid/columns";
import LinearProgress from "@mui/material/LinearProgress";
import { IGenres } from "@/interfaces/genres";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";
import { t } from "i18next";
import { GenresService } from "@/services/genre";

export interface Props {
  dataSource: IGenres[];
  setState: (data: any) => void;
}

export const ListCategory: FC<Props> = ({ dataSource, setState }) => {
  const handlDelete = useCallback(async (id: string) => {
    const result = await GenresService.Delete(id)
    if (result.msg_code === MESSAGE_CODE.SUCCESS) {
      setState(dataSource.filter((item) => item.id?.toString() !== id));
      toastMessage(t("toast_message.delete_success"), "success");
    } else {
      toastMessage(t("toast_message.delete_fail"), "error");
    }
  }, [dataSource, setState]);
  const handleAddNewAndUpdate = useCallback(async (data: any) => {
    const params = {
      id: null,
      name: data.name,
      code: data.code
    }
    if (data?.isNew) {
      const result = await GenresService.Create(params);
      if (result.msg_code === MESSAGE_CODE.SUCCESS) {
        setState([...dataSource, result.content]);
        toastMessage(t("toast_message.add_success"), "success");
      } else {
        toastMessage(t("toast_message.add_fail"), "error");
      }
    } else {
      const result = await GenresService.Update(data.id, params)
      if (result.msg_code === MESSAGE_CODE.SUCCESS) {
        const index = dataSource.findIndex((item) => item.id === data.id);
        dataSource[index] = result.content;
        setState([...dataSource]);
        toastMessage(t("toast_message.update_success"), "success");
      } else {
        toastMessage(t("toast_message.update_fail"), "error");
      }
    }
  }, [dataSource, setState]);

  return (
    <Box>
      <BaseGrid
        sx={{
          height: "calc(100vh - 90px)",
          width: "100%",
        }}
        columns={columns}
        rows={dataSource}
        onDel={handlDelete}
        onSave={handleAddNewAndUpdate}
        slots={{
          loadingOverlay: LinearProgress,
        }}
        loading={dataSource.length === 0 ? true : false}
      />
    </Box>
  );
};
