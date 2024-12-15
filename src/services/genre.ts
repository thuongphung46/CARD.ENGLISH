import { IGenres } from "@/interfaces/genres";
import { Request } from "./request";

const Controller = "genres"; //thể loại
export const GenresService = {
  GetList: async () => {
    return await Request(Controller).getAsync("");
  },
  GetById: async (id: string) => {
    return await Request(Controller).getAsync(`${id}`);
  },
  Create: async (data: IGenres) => {
    return await Request(Controller).postAsync("", data);
  },
  Update: async (id: string, data: IGenres) => {
    return await Request(Controller).patchAsync(`${id}`, data);
  },
  Delete: async (id: string) => {
    return await Request(Controller).deleteAsync(`${id}`);
  },
};
