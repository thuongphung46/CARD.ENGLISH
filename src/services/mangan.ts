import { IPosts } from "@/interfaces/mangan";
import { Request } from "./request";

const Controller = "posts"; //
export const PostsService = {
  GetList: async () => {
    return await Request(Controller).getAsync("");
  },
  GetById: async (id: string) => {
    return await Request(Controller).getAsync(`${id}`);
  },
  GetListPopular: async () => {
    return await Request(Controller).getAsync("most-popular");
  },
  Search: async (name: string) => {
    return await Request(Controller).getAsync(`/posts?query=${name}`);
  },
  Create: async (data: IPosts) => {
    return await Request(Controller).postAsync("", data);
  },
  Update: async (id: string, data: any) => {
    return await Request(Controller).patchAsync(`${id}`, data);
  },
  Delete: async (id: string) => {
    return await Request(Controller).deleteAsync(`${id}`);
  },
};
