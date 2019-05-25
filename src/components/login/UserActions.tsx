import {push} from "connected-react-router";
import {Routes} from "../helper/Routes";
import {ActionTypesUnion} from "../../redux/helper/TypesHelper";
import {createAction} from "../../redux/helper/ActionHelper";
import {LoginActionTypes} from "../../redux/actions/Actions";
import {login, register} from "../../rest/LoginService";
import {auth} from "../../index";
import {removeLocalStorage} from "../../helper/WebHelper";
import {StorageKey} from "../../helper/Constants";
import {fetchCategories} from "../../rest/CategoriesService";
import {fetchShops} from "../../rest/ShopsService";

export const UserActions = {
    setLoggedUserAction: (loginInfo: firebase.User | null) => createAction(LoginActionTypes.SET_LOGGED_USER_ACTION, loginInfo),
    resetLoggedUserAction: () => createAction(LoginActionTypes.RESET_LOGGED_USER_ACTION)
};
export type UserActions = ActionTypesUnion<typeof UserActions>

export function doLoginAction(username: string, password: string): any {
    return (dispatch: any) => {
        login(username, password)
            .then(function (response) {
                    //gather data
                    fetchCategories();
                    fetchShops();
                    dispatch(UserActions.setLoggedUserAction(response.user));
                    dispatch(push(Routes.CATEGORIES));
                }
            )
            .catch(function (error) {
                alert(error);
            });
    }
}

export function doRegisterAction(username: string, password: string, fullname: string): any {
    return (dispatch: any) => {
        register(username, password)
            .then(function (response) {
                    if (response.user) {
                        response.user.updateProfile({
                            displayName: fullname
                        }).then(function () {
                            dispatch(UserActions.setLoggedUserAction(response.user));
                            dispatch(push(Routes.CATEGORIES));
                        })
                    }
                }
            )
            .catch(function (error) {
                alert(error);
            });
    }
}

export function doLogoutAction(): any {
    return (dispatch: any) => {
        dispatch(UserActions.resetLoggedUserAction());
        auth.signOut();
        removeLocalStorage(StorageKey.CATEGORIES);
        removeLocalStorage(StorageKey.SHOPS);
        dispatch(push(Routes.LOGIN));
    }
}


