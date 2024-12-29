import { put } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, fork, take } from "redux-saga/effects";
import { LoginPayload, authActions } from "../slices/authSlice";
import HRMStorage from "@/common/function";
import GlobalConstant, { KEY_VALUE } from "@/constants/GlobalConstant";
import { toastMessage } from "@/components/atoms/toast_message";
import { AuthService } from "@/services/auth";
import { MESSAGE_CODE } from "@/interfaces/enum";

interface IApiResponse {
  msg_code: number;
  message: string;
  content: any;
}
function* handleLogin(payload: LoginPayload) {
  try {
    const { pin } = payload;
    if (pin) {
      const result: IApiResponse = yield call(AuthService.Login, pin);

      if (result.msg_code === MESSAGE_CODE.SUCCESS) {
        // HRMStorage.set(KEY_VALUE.TOKEN, GlobalConstant.TOKEN);
        HRMStorage.set(KEY_VALUE.TOKEN, result.content.memberId);

        yield put(authActions.loginSuccess(result.content));
      } else {
        yield put(authActions.loginFailed(result.message));
        toastMessage(result.message, "error");
      }
    } else {
      yield put(authActions.loginFailed("Có lỗi xảy ra"));
      toastMessage("Có lỗi xảy ra", "error");
    }
  } catch (error: any) {
    yield put(authActions.loginFailed(error.message));
    toastMessage(error.message, "error");
  }
}

function* handleLogout() {
  yield put(authActions.logout());
  yield HRMStorage.clear();
  // Redirect to Login page
}

function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(HRMStorage.get(KEY_VALUE.TOKEN));

    if (!isLoggedIn) {
      const action: PayloadAction<LoginPayload> = yield take(
        authActions.login.type
      );
      yield fork(handleLogin, action.payload);
    } else {
      yield take(authActions.logout.type);
      yield call(handleLogout);
    }
  }
}

export function* authSaga() {
  yield fork(watchLoginFlow);
}
