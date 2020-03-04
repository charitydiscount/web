import { LoginActionTypes } from '../actions/Actions';
import { AuthActions } from '../../components/login/UserActions';
import { UserActions } from '../actions/UserActions';

export interface IUserState {
    isLoggedIn: boolean;
    userKey: string | null;
}

const initialState: IUserState = {
    isLoggedIn: false,
    userKey: null,
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
                userKey: action.payload,
            };
        case LoginActionTypes.RESET_LOGGED_USER_ACTION:
            return { ...initialState };
        default:
            return state;
    }
}
