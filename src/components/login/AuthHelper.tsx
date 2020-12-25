import * as firebase from "firebase";
import { getLocalStorage, setLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";
import { AuthActions } from "../../redux/actions/UserActions";
import { store } from "../../index";

export interface UserInfoDto {
    photoURL: string,
    displayName: string,
    email: string,
    uid: string,
    normalUser: boolean,
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
    ) as UserInfoDto;
    if (user.metadata.creationTime) {
        parsedUser.creationTime = user.metadata.creationTime;
    }
    parsedUser.normalUser = user.providerData[0].providerId === "password";
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
                parsedUser = JSON.parse(user) as UserInfoDto;
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
                parsedUser = JSON.parse(user) as UserInfoDto;
                return parsedUser;
            } catch (e) {
                //something went wrong
            }
        }
    }
    store.dispatch(AuthActions.resetLoggedUserAction());
}