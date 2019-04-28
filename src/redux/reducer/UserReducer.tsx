import {LoginActionTypes} from "../actions/Actions";
import {UserActions} from "../../components/login/UserActions";

interface IUserState {
    isLoggedIn: boolean;
    userDetails: firebase.User | null;
}

const initialState: IUserState = {
    isLoggedIn: false,
    userDetails: null
};

export default function (state: IUserState = initialState, action: UserActions): IUserState {
    switch (action.type) {
        case LoginActionTypes.SET_LOGGED_USER_ACTION:
            return {
                ...state,
                isLoggedIn: true,
                userDetails: action.payload
            };
        case LoginActionTypes.RESET_LOGGED_USER_ACTION:
            return initialState;
        default:
            return state;
    }
}