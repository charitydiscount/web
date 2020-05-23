import { LoginActionTypes } from '../actions/Actions';
import { AuthActions } from '../../components/login/UserActions';
import { UserActions } from '../actions/UserActions';

export interface IUserState {
    isLoggedIn: boolean;
    userInfo: firebase.User | null;
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
            return { ...initialState };
        default:
            return state;
    }
}
