import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "@components/pages/error";
import { FORM_STATE } from "@interfaces/enum";
import RootLayout from "@components/templates/root_layout";
import { HomePage } from "@components/pages/home";
import { ChangePinPage } from "@/components/pages/change_pin";
import { RechargePage } from "@/components/pages/recharge";
import { PaymentPage } from "@/components/pages/payment";
import { CharactorPage } from "@/components/pages/character";
import { SignIn } from "@/components/pages/login";
import { Register } from "@/components/pages/register";


interface PropType {
  component: any;
  action?: FORM_STATE;
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/change-pin",
        element: <ChangePinPage />,
      },
      {
        path: "/recharge",
        element: <RechargePage />,
      },
      {
        path: "/payment",
        element: <PaymentPage />,
      },
      {
        path: "/character",
        element: <CharactorPage />,
      },
    ]
  },
  {
    path: "/login",
    errorElement: <ErrorPage />,
    children: [{ path: "/login", element: <SignIn /> }],
  },
  {
    path: "/register",
    errorElement: <ErrorPage />,
    children: [{ path: "/register", element: <Register /> }],
  }
]);

export { router };
