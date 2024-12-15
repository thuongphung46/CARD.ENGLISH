import { IAuthor } from "@/interfaces/author";
import { MESSAGE_CODE } from "@/interfaces/enum";
import { AuthorService } from "@/services/author";
import { useEffect, useState } from "react";

export const useGetListAuthor = () => {
  const [data, setData] = useState<IAuthor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await AuthorService.GetList();
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
