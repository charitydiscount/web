import { LoginActionTypes } from '../actions/Actions';
import { AuthActions } from '../actions/UserActions';
import { UserInfoDto } from "../../components/login/AuthHelper";
import { removeLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";

export interface IUserState {
    isLoggedIn: boolean;
    userInfo: UserInfoDto | null;
}

const initialState: IUserState = {
    isLoggedIn: false,
    userInfo: null
};

export default function (
    state: IUserState = initialState,
    action: AuthActions
): IUserState {
    switch (action.type) {
        case LoginActionTypes.LOAD_USER_DATA_ACTION:
            return {
                ...state,
                userInfo: action.payload
            };
        case LoginActionTypes.SET_LOGGED_USER_ACTION:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.payload
            };
        case LoginActionTypes.RESET_LOGGED_USER_ACTION:
            removeLocalStorage(StorageKey.USER);
            return {...initialState};
        default:
            return state;
    }
}
