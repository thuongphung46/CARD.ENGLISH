import {IGenres} from "@/interfaces/genres";
import {PaymentTemplate} from "@/components/templates/payment";
import {useState} from "react";

export const PaymentPage = () => {
    const [ListCategory, setListCategory] = useState<IGenres[]>([]);
    return (
        <div>
            <PaymentTemplate/>
        </div>
    );
};
