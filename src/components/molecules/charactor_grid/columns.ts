import { GridColDef } from "@mui/x-data-grid";

export const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "list_charactor.table.name",
    editable: true,
    width: 150,
    type: "String",
  },
  {
    field: "birthday",
    headerName: "list_charactor.table.birthday",
    editable: true,
    width: 150,
    type: "date",
    valueFormatter(params) {
      return new Date(params.value as string).toLocaleDateString("vi-VN");
    },
  },
  {
    field: "sign",
    headerName: "list_charactor.table.sign",
    editable: true,
    width: 150,
    type: "String",
  },
  {
    field: "height",
    headerName: "list_charactor.table.height",
    editable: true,
    width: 150,
    type: "String",
  },
  {
    field: "weight",
    headerName: "list_charactor.table.weight",
    editable: true,
    width: 150,
    type: "String",
  },
  {
    field: "bloodType",
    headerName: "list_charactor.table.bloodType",
    editable: true,
    width: 150,
    type: "String",
  },
  {
    field: "shoeSize",
    headerName: "list_charactor.table.shoeSize",
    editable: true,
    width: 150,
    type: "String",
  },
  {
    field: "favoriteFood",
    headerName: "list_charactor.table.favoriteFood",
    editable: true,
    width: 150,
    type: "String",
  },
  {
    field: "dislikes",
    headerName: "list_charactor.table.dislikes",
    editable: true,
    width: 150,
    type: "String",
  },
  {
    field: "bio",
    headerName: "list_charactor.table.bio",
    editable: true,
    width: 150,
    type: "String",
  },
];
