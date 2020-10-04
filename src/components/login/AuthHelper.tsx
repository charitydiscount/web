import * as firebase from "firebase";
import { getLocalStorage, setLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";
import { AuthActions } from "./UserActions";
import { store } from "../../index";

export interface LoginDto {
    uid: string;
    photoURL: string | null;
    displayName: string;
    email: string;
    creationTime: string
}

export const LoginMapper = {
    uid: 'uid',
    photoURL: 'photoURL',
    displayName: 'displayName',
    email: 'email'
};

export function parseAndSaveUser(user: firebase.User) {
    let objectMapper = require('object-mapper');
    let parsedUser = objectMapper(
        user,
        LoginMapper
    ) as LoginDto;
    if (user.metadata.creationTime) {
        parsedUser.creationTime = user.metadata.creationTime;
    }
    setLocalStorage(StorageKey.USER, JSON.stringify(parsedUser));
    return parsedUser;
}

export function getUserId() {
    const user = getLocalStorage(StorageKey.USER);
    if (user && user.length > 0) {
        //validate json present in storage
        if (user.includes('uid')) {
            let parsedUser;
            try {
                parsedUser = JSON.parse(user) as LoginDto;
                return parsedUser.uid;
            } catch (e) {
                //something went wrong
            }
        }
    }
    store.dispatch(AuthActions.resetLoggedUserAction());
}

export function getUserInfo() {
    const user = getLocalStorage(StorageKey.USER);
    if (user && user.length > 0) {
        //validate json present in storage
        if (user.includes('uid')) {
            let parsedUser;
            try {
                parsedUser = JSON.parse(user) as LoginDto;
                return parsedUser;
            } catch (e) {
                //something went wrong
            }
        }
    }
    store.dispatch(AuthActions.resetLoggedUserAction());
}