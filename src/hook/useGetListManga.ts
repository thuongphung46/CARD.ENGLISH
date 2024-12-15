import { MESSAGE_CODE } from "@/interfaces/enum";
import { IPosts } from "@/interfaces/mangan";
import { PostsService } from "@/services/mangan";
import { useEffect, useState } from "react";

export const useGetListManga = () => {
  const [data, setData] = useState<IPosts[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await PostsService.GetList();
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
