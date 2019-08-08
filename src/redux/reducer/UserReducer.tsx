import {LoginActionTypes} from "../actions/Actions";
import {UserActions} from "../../components/login/UserActions";

interface IUserState {
    isLoggedIn: boolean;
    userKey: string | null;
}

const initialState: IUserState = {
    isLoggedIn: false,
    userKey: null
};

export default function (state: IUserState = initialState, action: UserActions): IUserState {
    switch (action.type) {
        case LoginActionTypes.SET_LOGGED_USER_ACTION:
            return {
                ...state,
                isLoggedIn: true,
                userKey: action.payload
            };
        case LoginActionTypes.RESET_LOGGED_USER_ACTION:
            return initialState;
        default:
            return state;
    }
}