import { ActionTypesUnion } from '../helper/TypesHelper';
import { createAction } from '../helper/ActionHelper';
import { LoginActionTypes } from './Actions';
import { auth } from '../..';
import { getUserInfo, UserInfoDto } from "../../components/pages/login/AuthHelper";
import { CategoriesAction } from "./CategoriesAction";
import { setLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";

export const AuthActions = {
    setLoggedUserAction: (loginInfo: UserInfoDto | null) =>
        createAction(LoginActionTypes.SET_LOGGED_USER_ACTION, loginInfo),
    loadUserData: (loginInfo: UserInfoDto | null) =>
        createAction(LoginActionTypes.LOAD_USER_DATA_ACTION, loginInfo),
    resetLoggedUserAction: () =>
        createAction(LoginActionTypes.RESET_LOGGED_USER_ACTION),
};
export type AuthActions = ActionTypesUnion<typeof AuthActions>;

export const doLogoutAction = () => async (dispatch: any) => {
    await auth.signOut();
    dispatch(CategoriesAction.resetCategories());
    dispatch(AuthActions.resetLoggedUserAction());
};

export const updateUserPhotoInState = (photoUrl) => async (dispatch: any) => {
    let currentUser = getUserInfo();
    currentUser.photoURL = photoUrl;
    setLocalStorage(StorageKey.USER, JSON.stringify(currentUser));
    return dispatch(AuthActions.loadUserData(currentUser));
};

export const updateUserNameInState = (name) => async (dispatch: any) => {
    let currentUser = getUserInfo();
    currentUser.displayName = name;
    setLocalStorage(StorageKey.USER, JSON.stringify(currentUser));
    return dispatch(AuthActions.loadUserData(currentUser));
};