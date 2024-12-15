import { FC, useCallback } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  DataGridProps,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useConfirm } from "material-ui-confirm";
import React from "react";
import { t } from "i18next";
import Tooltip from "@mui/material/Tooltip";

interface BaseGridProps extends DataGridProps {
  columns: GridColDef[];
  title?: string;
  onSave?: (data: any) => void;
  onDel?: (id: any) => void;
  onRowSelectionChange?: (selection: any) => void;
  selectedRows?: GridRowId[];
  rows: any[];
  disable?: boolean;
  addActionsDetail?: boolean;
  onClickDetail?: (data: any) => void;
}

export const BaseGrid: FC<BaseGridProps> = ({
  columns,
  title,
  onSave,
  onRowSelectionChange,
  selectedRows,
  rows,
  onDel,
  disable,
  slots,
  addActionsDetail,
  onClickDetail,
  ...rest
}) => {
  const confirm = useConfirm();
  const apiRef = useGridApiRef();
  const [data, setData] = React.useState<any[]>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    const newData = rows.map((row, index) => ({ ...row, "#": index + 1 }));
    setData(newData);
  }, [rows]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    confirm({
      title: t("datagrid.confirm.delete_title"),
      description: t("datagrid.confirm.delete_description"),
      confirmationText: t("datagrid.confirm.ok"),
      cancellationText: t("datagrid.confirm.cancel"),
    })
      .then(() => {
        setData(data.filter((row) => row.id !== id));
        onDel && onDel(id);
      })
      .catch(() => console.log("Deletion cancelled."));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = data.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setData(data.filter((row) => row.id !== id));
    }
  };
  const handleClickDetail = useCallback(
    (data: any) => {
      onClickDetail && onClickDetail(data);
    },
    [onClickDetail]
  );

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setData(data.map((row) => (row.id === newRow.id ? updatedRow : row)));

    if (onSave) {
      if (newRow.isNew) {
        onSave({ ...updatedRow, isNew: true });
      } else {
        onSave(updatedRow);
      }
    }

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const Custcolumns: GridColDef[] = [
    { field: "#", headerName: t("datagrid.index"), width: 70 },
    ...columns.map((col) => ({
      ...col,
      headerName: t(col.headerName || "default"),
    })),
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={
                <Tooltip title={t("datagrid.button.save")}>
                  <SaveIcon />
                </Tooltip>
              }
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={
                <Tooltip title={t("datagrid.button.cancel")}>
                  <CancelIcon />
                </Tooltip>
              }
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          ...(addActionsDetail
            ? [
                <GridActionsCellItem
                  key="detail"
                  icon={
                    <Tooltip title={t("datagrid.button.detail")}>
                      <MoreHorizIcon />
                    </Tooltip>
                  }
                  label="Detail"
                  className="textPrimary"
                  disabled={disable}
                  onClick={() => handleClickDetail(row)}
                  color="inherit"
                />,
              ]
            : []),
          <GridActionsCellItem
            key="edit"
            icon={
              <Tooltip title={t("datagrid.button.edit")}>
                <EditIcon />
              </Tooltip>
            }
            label="Edit"
            className="textPrimary"
            disabled={disable}
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              <Tooltip title={t("datagrid.button.delete")}>
                <DeleteIcon />
              </Tooltip>
            }
            label="Delete"
            disabled={disable}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <DataGrid
        rows={data}
        columns={Custcolumns}
        editMode="row"
        checkboxSelection
        disableRowSelectionOnClick
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onRowSelectionModelChange={onRowSelectionChange}
        rowSelectionModel={selectedRows}
        slots={{
          ...slots,
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: {
            data,
            setData,
            setRowModesModel,
            disable,
            apiRef,
            columns,
          },
        }}
        {...rest}
      />
    </div>
  );
};

interface EditToolbarProps {
  data: any[];
  setData: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  disable?: boolean;
  apiRef: React.MutableRefObject<any>;
  columns: GridColDef[];
}

function EditToolbar(props: EditToolbarProps) {
  const { setData, setRowModesModel, data, disable, apiRef, columns } = props;

  const handleClick = () => {
    const getRandomUniqueId = (): number => {
      return Math.floor(Math.random() * 100); // Generate a random ID
    };

    const generateUniqueRandomId = (): number => {
      const id = getRandomUniqueId();
      if (data.some((item) => item.id === id)) {
        return generateUniqueRandomId(); // If ID exists, recursively generate a new one
      }
      return id;
    };

    const id = generateUniqueRandomId();

    setData((oldRows) => [
      ...oldRows,
      { id, isNew: true, "#": data.length + 1 },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
    setTimeout(() => {
      //focus on the second cell of the new row
      apiRef.current.setCellFocus(id, columns[0].field);
    }, 100);
  };

  return (
    <GridToolbarContainer>
      <Button
        disabled={disable}
        color="primary"
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleClick}
      >
        {t("datagrid.button.add_record")}
      </Button>
    </GridToolbarContainer>
  );
}
