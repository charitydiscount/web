import {push} from 'connected-react-router';
import {Routes} from '../helper/Routes';
import {ActionTypesUnion} from '../../redux/helper/TypesHelper';
import {createAction} from '../../redux/helper/ActionHelper';
import {LoginActionTypes} from '../../redux/actions/Actions';
import {auth} from '../../index';
import {removeLocalStorage} from '../../helper/StorageHelper';
import {StorageKey} from '../../helper/Constants';

export const UserActions = {
    setLoggedUserAction: (loginInfo: string | null) =>
        createAction(LoginActionTypes.SET_LOGGED_USER_ACTION, loginInfo),
    resetLoggedUserAction: () =>
        createAction(LoginActionTypes.RESET_LOGGED_USER_ACTION)
};
export type UserActions = ActionTypesUnion<typeof UserActions>;

export function doLogoutAction(): any {
    return (dispatch: any) => {
        dispatch(UserActions.resetLoggedUserAction());
        auth.signOut();
        removeLocalStorage(StorageKey.CATEGORIES);
        removeLocalStorage(StorageKey.SHOPS);
        removeLocalStorage(StorageKey.FAVORITE_SHOPS);
        removeLocalStorage(StorageKey.FAVORITE_SHOPS_ID);
        removeLocalStorage(StorageKey.USER);
        dispatch(push(Routes.LOGIN));
    };
}
