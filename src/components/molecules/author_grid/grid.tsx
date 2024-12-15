import { FC, useCallback } from "react";
import Box from "@mui/material/Box";
import { BaseGrid } from "@components/atoms/datagrid";
import LinearProgress from "@mui/material/LinearProgress";
import { IAuthor } from "@/interfaces/author";
import { GridColDef } from "@mui/x-data-grid";
import Avatar from '@mui/material/Avatar';
import { AuthorService } from "@/services/author";
import moment from "moment";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";
import { t } from "i18next";


export interface Props {
  dataSource: IAuthor[];
  setState: (data: any) => void;
}

export const ListAuthor: FC<Props> = ({ dataSource, setState }) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "list_author.table.name",
      editable: true,
      width: 200,
      type: "string",
    },
    {
      field: "birthday",
      headerName: "list_author.table.birthday",
      editable: true,
      width: 150,
      type: "date",
      valueFormatter: (params) => {
        return new Date(params.value as string).toLocaleDateString("vi-VN");
      },
    },
    {
      field: "place",
      headerName: "list_author.table.place",
      editable: true,
      width: 150,
      type: "string",
    },
    {
      field: "bio",
      headerName: "list_author.table.bio",
      width: 200,
      type: "string",
      editable: true,
    },
    {
      field: "image",
      headerName: "list_author.table.image",
      width: 200,
      type: "string",
      editable: true,
      renderCell: (params) => {
        return <Avatar src={params.value as string} />;
      }
    }
  ];
  const handlDelete = useCallback(async (id: string) => {
    const result = await AuthorService.Delete(id)
    if (result.msg_code === MESSAGE_CODE.SUCCESS) {
      toastMessage(t("toast_message.delete_success"), "success");
      setState && setState(
        dataSource.filter((item) => item.id?.toString() !== id)
      );
    } else {
      toastMessage(t("toast_message.delete_fail"), "error");
    }
  }, [dataSource, setState]);
  const handleAddNewAndUpdate = useCallback(async (data: any) => {
    const ParamsBody: IAuthor = {
      id: null,
      name: data.name,
      birthday: moment(data.birthday).format("YYYY-MM-DD"),
      place: data.place,
      bio: data.bio,
      image: data.image
    }
    if (data?.isNew) {
      const result = await AuthorService.Create(ParamsBody);
      if (result.msg_code === MESSAGE_CODE.SUCCESS) {
        toastMessage(t("toast_message.add_success"), "success");
        setState && setState([...dataSource, result.content]);
      } else {
        toastMessage(t("toast_message.add_fail"), "error");
      }
    } else {
      const result = await AuthorService.Update(data.id, ParamsBody)
      if (result.msg_code === MESSAGE_CODE.SUCCESS) {
        const index = dataSource.findIndex((item) => item.id === data.id);
        dataSource[index] = result.content;
        setState && setState([...dataSource]);
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
