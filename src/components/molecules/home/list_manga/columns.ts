import { GridColDef } from "@mui/x-data-grid";

export const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "list_manga.table.title",
    editable: true,
    width: 200,
    type: "string",
  },
  {
    field: "author",
    headerName: "list_manga.table.author",
    editable: true,
    width: 150,
    type: "string",
  },
  {
    field: "status",
    headerName: "list_manga.table.status",
    editable: true,
    width: 150,
    type: "string",
  },
  {
    field: "created_at",
    headerName: "list_manga.table.created_at",
    width: 200,
    type: "date",
    valueFormatter(params) {
      return new Date(params.value as string).toLocaleDateString("vi-VN");
    },
  },
  {
    field: "updated_at",
    headerName: "list_manga.table.updated_at",
    width: 200,
    type: "date",
    valueFormatter(params) {
      return new Date(params.value as string).toLocaleDateString("vi-VN");
    },
  },
];
