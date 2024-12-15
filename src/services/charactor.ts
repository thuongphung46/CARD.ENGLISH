import { ICharacter } from "@/interfaces/character";
import { Request } from "./request";

const Controller = "characters"; //nhân vật
export const CharacterService = {
  GetList: async () => {
    return await Request(Controller).getAsync("");
  },
  GetById: async (id: string) => {
    return await Request(Controller).getAsync(`${id}`);
  },
  Create: async (data: ICharacter) => {
    return await Request(Controller).postAsync("", data);
  },
  Update: async (id: string, data: ICharacter) => {
    return await Request(Controller).patchAsync(`${id}`, data);
  },
  Delete: async (id: string) => {
    return await Request(Controller).deleteAsync(`${id}`);
  },
};
