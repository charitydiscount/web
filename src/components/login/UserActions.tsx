import { ActionTypesUnion } from '../../redux/helper/TypesHelper';
import { createAction } from '../../redux/helper/ActionHelper';
import { LoginActionTypes } from '../../redux/actions/Actions';
import { auth } from '../../index';
import { removeLocalStorage } from '../../helper/StorageHelper';
import { StorageKey } from '../../helper/Constants';

export const AuthActions = {
    setLoggedUserAction: (loginInfo: string | null) =>
        createAction(LoginActionTypes.SET_LOGGED_USER_ACTION, loginInfo),
    resetLoggedUserAction: () =>
        createAction(LoginActionTypes.RESET_LOGGED_USER_ACTION),
};
export type AuthActions = ActionTypesUnion<typeof AuthActions>;

export function doLogoutAction(): any {
    return (dispatch: any) => {
        dispatch(AuthActions.resetLoggedUserAction());
        auth.signOut();
        removeLocalStorage(StorageKey.USER);
        window.location.reload();
    };
}
