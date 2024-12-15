import { GridColDef } from "@mui/x-data-grid";

export const columns: GridColDef[] = [
  {
    field: "code",
    headerName: "list_category.table.code",
    editable: true,
    width: 200,
    type: "string",
  },
  {
    field: "name",
    headerName: "list_category.table.name",
    editable: true,
    width: 150,
    type: "String",
  },
];
