import { MESSAGE_CODE } from "@/interfaces/enum";
import { IGenres } from "@/interfaces/genres";
import { GenresService } from "@/services/genre";
import { useEffect, useState } from "react";

export const useGetListCategory = () => {
  const [data, setData] = useState<IGenres[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await GenresService.GetList();
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
