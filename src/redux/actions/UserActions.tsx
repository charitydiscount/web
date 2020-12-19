import { ActionTypesUnion } from '../helper/TypesHelper';
import { createAction } from '../helper/ActionHelper';
import { LoginActionTypes } from './Actions';
import { auth } from '../..';
import { getUserInfo, UserInfoDto } from "../../components/login/AuthHelper";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { noImagePath, StorageKey } from "../../helper/Constants";
import { fetchProfilePhoto } from "../../rest/StorageService";
import { setLocalStorage } from "../../helper/StorageHelper";
import { CategoriesAction } from "./CategoriesAction";

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

export const updateUserPhoto = () => async (dispatch: any) => {
    let currentUser = getUserInfo();
    if (currentUser) {
        try {
            const response = await fetchProfilePhoto(
                currentUser.uid
            );
            currentUser.photoURL = response as string;
        } catch (error) {
            currentUser.photoURL = noImagePath;
        }
    }

    setLocalStorage(StorageKey.USER, JSON.stringify(currentUser));
    return dispatch(AuthActions.loadUserData(currentUser));
};

export const loadUserData = () => async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
) => {
    let currentUser = getUserInfo();
    if (currentUser) {
        if (!currentUser.photoURL) {
            currentUser.normalUser = true;
            try {
                const response = await fetchProfilePhoto(
                    currentUser.uid
                );
                currentUser.photoURL = response as string;
            } catch (error) {
                currentUser.photoURL = noImagePath;
            }
        }
    }

    setLocalStorage(StorageKey.USER, JSON.stringify(currentUser));
    return dispatch(AuthActions.loadUserData(currentUser));
};