import { LoginActionTypes } from '../actions/Actions';
import { AuthActions } from '../../components/login/UserActions';
import { UserActions } from '../actions/UserActions';
import { LoginDto } from "../../components/login/AuthHelper";
import { removeLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";

export interface IUserState {
    isLoggedIn: boolean;
    userInfo: LoginDto | null;
}

const initialState: IUserState = {
    isLoggedIn: false,
    userInfo: null,
};

export default function(
    state: IUserState = initialState,
    action: AuthActions | UserActions
): IUserState {
    switch (action.type) {
        case LoginActionTypes.SET_LOGGED_USER_ACTION:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.payload,
            };
        case LoginActionTypes.RESET_LOGGED_USER_ACTION:
            removeLocalStorage(StorageKey.USER);
            return { ...initialState };
        default:
            return state;
    }
}
