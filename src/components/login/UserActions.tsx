import { ActionTypesUnion } from '../../redux/helper/TypesHelper';
import { createAction } from '../../redux/helper/ActionHelper';
import { LoginActionTypes } from '../../redux/actions/Actions';
import { removeLocalStorage } from '../../helper/StorageHelper';
import { StorageKey } from '../../helper/Constants';
import { auth } from '../..';

export const AuthActions = {
    setLoggedUserAction: (loginInfo: string | null) =>
        createAction(LoginActionTypes.SET_LOGGED_USER_ACTION, loginInfo),
    resetLoggedUserAction: () =>
        createAction(LoginActionTypes.RESET_LOGGED_USER_ACTION),
};
export type AuthActions = ActionTypesUnion<typeof AuthActions>;

export const doLogoutAction = () => async (dispatch: any) => {
    await auth.signOut();
    removeLocalStorage(StorageKey.USER);
    dispatch(AuthActions.resetLoggedUserAction());
};
