import { useGetListCategory } from "@/hook/useGetListCategory";
import { IGenres } from "@/interfaces/genres";
import { PaymentTemplate } from "@/components/templates/payment";
import { useCallback, useEffect, useState } from "react";

export const PaymentPage = () => {
  const [ListCategory, setListCategory] = useState<IGenres[]>([]);
  return (
    <div>
      <PaymentTemplate />
    </div>
  );
};
