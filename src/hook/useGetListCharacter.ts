import { ICharacter } from "@/interfaces/character";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { CharacterService } from "@/services/charactor";
import { useEffect, useState } from "react";

export const useGetListCharacter = () => {
  const [data, setData] = useState<ICharacter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await CharacterService.GetList();
    if (response.msg_code === MESSAGE_CODE.SUCCESS) {
      setData(response?.content);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading };
};
