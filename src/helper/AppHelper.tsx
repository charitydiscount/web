import {fetchAffiliateCode} from "../rest/ConfigService";
import {getLocalStorage, removeLocalStorage} from "./StorageHelper";
import {StorageKey} from "./Constants";
import {LoginDto} from "../components/login/LoginComponent";
import {css} from '@emotion/core';

/**
 * Used to compute 2performant rest call and redirect
 * @param uniqueId - the unique code from entity
 * @param url - app url
 */
export function computeUrl(uniqueId, url) {
    var baseUrl = 'https://event.2performant.com/events/click?ad_type=quicklink';
    var theCode = fetchAffiliateCode();
    var affCode = '&aff_code=' + theCode;
    var unique = '&unique=' + uniqueId;
    var redirect = '&redirect_to=' + url;
    var tag = '';
    const user = getLocalStorage(StorageKey.USER);
    if (user) {
        tag = '&st=' + (JSON.parse(user) as LoginDto).uid;
    }
    return baseUrl + affCode + unique + redirect + tag;
}

export const spinnerCss = css`
    display: block;
    margin: 200px auto;
`;

export function isEmptyString(field) {
    return !!field && field.trim().length;
}

export function getUserKeyFromStorage() {
    const user = getLocalStorage(StorageKey.USER);
    if (user) {
        const keyExist = (JSON.parse(user) as LoginDto).uid;
        if (keyExist) {
            return keyExist;
        } else {
            removeLocalStorage(StorageKey.USER)
        }
    }
    //the app can't work without user key from storage, so when reloading it will be created again
    window.location.reload();
    return null;
}

export function getUserFromStorage() {
    const user = getLocalStorage(StorageKey.USER);
    if (user) {
        return user;
    }
    //the app can't work without user key from storage, so when reloading it will be created again
    window.location.reload();
    return null;
}