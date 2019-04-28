import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";
import NavigatorReducer from "./NavigatorReducer";
import UserReducer from "./UserReducer";

// Used to combine all reducers for full functionality
export default (history: any) => combineReducers({
    router: connectRouter(history),
    navigation: NavigatorReducer,
    user : UserReducer
});

