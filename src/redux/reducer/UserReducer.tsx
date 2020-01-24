import { LoginActionTypes, UserActionTypes } from '../actions/Actions';
import { AuthActions } from '../../components/login/UserActions';
import { UserDto } from '../../rest/UserService';
import { UserActions } from '../actions/UserActions';

interface IUserState {
    isLoggedIn: boolean;
    userKey: string | null;
    user: UserDto | null;
}

const initialState: IUserState = {
    isLoggedIn: false,
    userKey: null,
    user: null,
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
                user: action.payload ? JSON.parse(action.payload) : null,
            };
        case LoginActionTypes.RESET_LOGGED_USER_ACTION:
            return initialState;
        case UserActionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
}
