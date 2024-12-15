import { FC, useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { BaseGrid } from "@components/atoms/datagrid";
import LinearProgress from "@mui/material/LinearProgress";
import { IPosts } from "@/interfaces/mangan";
import { PostsService } from "@/services/mangan";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { toastMessage } from "@/components/atoms/toast_message";
import { t } from "i18next";
import { GridColDef } from "@mui/x-data-grid";
import { PopupModal } from "@/components/atoms/popup";
import FormField, { IFormField } from "@/components/atoms/form_value";
import { useDebouncedCallback } from "use-debounce";
import { IAuthor } from "@/interfaces/author";
import { ICharacter } from "@/interfaces/character";
import { IGenres } from "@/interfaces/genres";
import { useGetListCategory } from "@/hook/useGetListCategory";
import { useGetListAuthor } from "@/hook/useGetListAuthor";
import { useGetListCharacter } from "@/hook/useGetListCharacter";

export interface Props {
  dataSource: IPosts[];
  setState: (data: any) => void;
  columns: GridColDef[];
}
interface IDataItem {
  id?: number;
  authors?: IAuthor[];
  characters?: ICharacter[];
  genres?: IGenres[];
}

export const ListManga: FC<Props> = ({ dataSource, setState, columns }) => {
  const [open, setOpen] = useState(false);
  const [dataItem, setDataItem] = useState<IDataItem>({});
  const [dataEditItem, setDataEditItem] = useState<IDataItem>({});
  const { data: resListAuthor } = useGetListAuthor();
  const { data: resListCategory } = useGetListCategory();
  const { data: resListCharacter } = useGetListCharacter();
  const handlDelete = useCallback(
    async (id: string) => {
      const result = await PostsService.Delete(id);
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
      const params: IPosts = {
        id: null,
        name: data.name,
        image: data.image,
        description: data.description,
        synopsis: data.synopsis,
        authors: data.authorIds,
        characters: data.characterIds,
        genres: data.genreIds,
      };
      if (data?.isNew) {
        const result = await PostsService.Create(params);
        if (result.msg_code === MESSAGE_CODE.SUCCESS) {
          setState([...dataSource, result.content]);
          toastMessage(t("toast_message.add_success"), "success");
        } else {
          toastMessage(t("toast_message.add_fail"), "error");
        }
      } else {
        const result = await PostsService.Update(data.id, params);
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
  const handleShowDetail = useCallback((data: any) => {
    setDataItem({
      id: data.id,
      authors: data.author,
      characters: data.characters,
      genres: data.genres,
    });
    setDataEditItem({
      authors: data.author,
      characters: data.characters,
      genres: data.genres,
    });
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setDataItem({});
    setDataEditItem({});
  }, []);

  const hanldeOnChangefield = useDebouncedCallback((e: any) => {
    const name: "authors" | "characters" | "genres" = e.target.name;
    const value: { value: number; label: string }[] = e.target.value;
    if (dataEditItem[name]) {
      dataEditItem[name] = value.map((i) => {
        return {
          id: i.value,
          name: i.label,
        };
      });

      setDataEditItem({ ...dataEditItem });
    }
  }, 200);

  const handleUpdateDetail = useCallback(async () => {
    const data = {
      id: dataItem.id,
      authors: dataEditItem.authors,
      characters: dataEditItem.characters,
      genres: dataEditItem.genres,
    };
    if (!data.id) {
      return;
    }
    const result = await PostsService.Update(data.id.toString(), {
      authorIds: data.authors && data.authors.map((i) => i.id),
      characterIds: data.characters && data.characters.map((i) => i.id),
      genreIds: data.genres && data.genres.map((i) => i.id),

    });
    if (result.msg_code === MESSAGE_CODE.SUCCESS) {
      const index = dataSource.findIndex((item) => item.id === data.id);
      dataSource[index] = {
        ...result.content,
        author: data.authors,
        characters: data.characters,
        genres: data.genres,
      };

      setState([...dataSource]);
      toastMessage(t("toast_message.update_success"), "success");
      handleClose();
    } else {
      toastMessage(t("toast_message.update_fail"), "error");
    }

  }, [dataEditItem.authors, dataEditItem.characters, dataEditItem.genres, dataItem.id, dataSource, handleClose, setState]);


  const Fields: IFormField[] = useMemo(() => {
    return [
      {
        id: "authors",
        label: "list_manga.table.authorIds",
        type: "selectMutiple",
        isRequire: false,
        options:
          resListAuthor?.map((i) => {
            return {
              value: i.id,
              label: i.name,
            };
          }) || [],
        defaultValue:
          dataItem.authors &&
          dataItem.authors.map((i) => {
            return {
              value: i.id,
              label: i.name,
            };
          }),
      },
      {
        id: "characters",
        label: "list_manga.table.characterIds",
        type: "selectMutiple",
        isRequire: false,
        options:
          resListCharacter?.map((i) => {
            return {
              value: i.id,
              label: i.name,
            };
          }) || [],
        defaultValue:
          dataItem.characters &&
          dataItem.characters.map((i) => {
            return {
              value: i.id,
              label: i.name,
            };
          }),
      },
      {
        id: "genres",
        label: "list_manga.table.genreIds",
        type: "selectMutiple",
        isRequire: false,
        options:
          resListCategory?.map((i) => {
            return {
              value: i.id,
              label: i.name,
            };
          }) || [],
        defaultValue:
          dataItem.genres &&
          dataItem.genres.map((i) => {
            return {
              value: i.id,
              label: i.name,
            };
          }),
      },
    ];
  }, [
    dataItem.authors,
    dataItem.characters,
    dataItem.genres,
    resListAuthor,
    resListCategory,
    resListCharacter,
  ]);
  const renderPopup = useMemo(() => {
    return (
      <PopupModal handleClose={handleClose} handleSave={handleUpdateDetail} open={open}>
        {dataItem && (
          <>
            {Fields.length > 0 && (
              <FormField
                action={"EDIT"}
                fields={Fields}
                formData={dataSource.find((i) => i.id === dataItem.id)}
                handleOnChangeField={hanldeOnChangefield}
              />
            )}
          </>
        )}
      </PopupModal>
    );
  }, [Fields, dataItem, dataSource, handleClose, handleUpdateDetail, hanldeOnChangefield, open]);
  return (
    <Box>
      <BaseGrid
        sx={{
          height: "calc(100vh - 90px)",
          width: "100%",
        }}
        addActionsDetail={true}
        columns={columns}
        rows={dataSource}
        onDel={handlDelete}
        onSave={handleAddNewAndUpdate}
        onClickDetail={handleShowDetail}
        slots={{
          loadingOverlay: LinearProgress,
        }}
        loading={dataSource.length === 0 ? true : false}
      />
      {renderPopup}
    </Box>
  );
};
