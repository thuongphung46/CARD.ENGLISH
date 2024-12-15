import { FC, useCallback } from "react";
import Box from "@mui/material/Box";
import { BaseGrid } from "@components/atoms/datagrid";
import { columns } from "@/components/molecules/charactor_grid/columns";
import LinearProgress from "@mui/material/LinearProgress";
import { ICharacter } from "@/interfaces/character";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { CharacterService } from "@/services/charactor";
import { toastMessage } from "@/components/atoms/toast_message";
import { t } from "i18next";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import Avatar from "@mui/material/Avatar";

export interface Props {
  dataSource: ICharacter[];
  setState: (data: any) => void;
}

export const ListCharacter: FC<Props> = ({ dataSource, setState }) => {
  const handlDelete = useCallback(
    async (id: string) => {
      const result = await CharacterService.Delete(id);
      if (result.msg_code === MESSAGE_CODE.SUCCESS) {
        setState(dataSource.filter((item) => item.id?.toString() !== id));
        toastMessage(t("toast_message.delete_success"), "success");
      } else {
        toastMessage(t("toast_message.delete_fail"), "error");
      }
    },
    [dataSource, setState]
  );
  const handleAddNewAndUpdate = useCallback(
    async (data: any) => {
      const params: ICharacter = {
        id: null,
        name: data.name,
        birthday: data.birthday,
        bio: data.bio,
        bloodType: data.bloodType,
        dislikes: data.dislikes,
        favoriteFood: data.favoriteFood,
        height: data.height,
        image: data.image,
        shoeSize: data.shoeSize,
        sign: data.sign,
        weight: data.weight,
      };
      if (data?.isNew) {
        const result = await CharacterService.Create(params);
        if (result.msg_code === MESSAGE_CODE.SUCCESS) {
          setState([...dataSource, result.content]);
          toastMessage(t("toast_message.add_success"), "success");
        } else {
          toastMessage(t("toast_message.add_fail"), "error");
        }
      } else {
        const result = await CharacterService.Update(data.id, params);
        if (result.msg_code === MESSAGE_CODE.SUCCESS) {
          const index = dataSource.findIndex((item) => item.id === data.id);
          dataSource[index] = result.content;
          setState([...dataSource]);
          toastMessage(t("toast_message.update_success"), "success");
        } else {
          toastMessage(t("toast_message.update_fail"), "error");
        }
      }
    },
    [dataSource, setState]
  );

  const convertColumns: GridColDef[] = [
    ...columns,
    {
      field: "image",
      headerName: "list_charactor.table.image",
      editable: true,
      width: 150,
      type: "String",
      renderCell: (params) => {
        return <Avatar src={params.value as string} />;
      },
    },
  ];
  return (
    <Box>
      <BaseGrid
        sx={{
          height: "calc(100vh - 90px)",
          width: "100%",
        }}
        columns={convertColumns}
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
