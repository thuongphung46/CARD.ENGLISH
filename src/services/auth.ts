import { IAuthor } from "@/interfaces/author";
import { Request } from "./request";

export interface IUser {
  id?: string;
  fullName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  avatar?: any[];
  expirationDate?: string;
  remainingBalance?: number;
  avatarBase64?: string;
  [key: string]: any;
}
export interface IPin {
  oldPin: string;
  newPin: string;
  confirmNewPin: string;
}
export interface IPayment {
  memberId?: string;
  pinCode?: string;
  totalBill?: number;
  totalMonth?: number;
}

const Controller = "smart-card"; //tác giả

export const AuthService = {
  Login: async (pin: string) => {
    return await Request(Controller).postAsync("login", {
      pinCode: pin,
    });
  },
  GetInFo: async () => {
    return await Request(Controller).getAsync("/info");
  },
  Register: async (user: IUser) => {
    return await Request(Controller).postAsync("create", user);
  },
  Update: async (user: IUser) => {
    return await Request(Controller).postAsync("update", user);
  },
  Recharge: async ({
    memberId,
    remainingBalance,
  }: {
    memberId?: string;
    remainingBalance?: number;
  }) => {
    return await Request(Controller).postAsync("recharge", {
      remainingBalance: remainingBalance,
      memberId: memberId,
    });
  },
  ChangePin: async (data: IPin) => {
    return await Request(Controller).postAsync("pin/change", data);
  },
  Disconnect: async () => {
    return await Request(Controller).postAsync("disconnect");
  },
  Payment: async (data: IPayment) => {
    return await Request(Controller).postAsync("payment", data);
  },
  UnlockCard: async () => {
    return await Request(Controller).postAsync("unlock", {});
  },
};
