import {push} from "connected-react-router";
import {Routes} from "../helper/Routes";
import {login, register} from "../../rest/LoginService";

export function doLoginAction(username: string, password: string): any {
    return (dispatch: any) => {
        login(username, password)
            .then(function (response) {
                    dispatch(push(Routes.CATEGORIES));
                }
            )
            .catch(function (error) {
                alert(error);
            });
    }
}

export function doRegisterAction(username: string, password: string): any {
    return (dispatch: any) => {
        register(username, password)
            .then(function (response) {
                    dispatch(push(Routes.CATEGORIES));
                }
            )
            .catch(function (error) {
                alert(error);
            });
    }
}


export function doLogoutAction(): any {
    return (dispatch: any) => {
        dispatch(push(Routes.HOME));
    }
}


