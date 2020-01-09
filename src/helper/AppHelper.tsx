import {getAffiliateCode} from "../rest/ConfigService";
import {getLocalStorage, removeLocalStorage, setLocalStorage} from "./StorageHelper";
import {StorageKey} from "./Constants";
import {LoginDto} from "../components/login/LoginComponent";
import {css} from '@emotion/core';
import {store} from "../index";
import {setLangResources} from "../redux/actions/LocaleAction";

/**
 * Used to compute 2performant rest call and redirect
 * @param uniqueId - the unique code from entity
 * @param url - app url
 */
export function computeUrl(uniqueId, url) {
    let baseUrl = 'https://event.2performant.com/events/click?ad_type=quicklink';
    let affCode = '&aff_code=' + getAffiliateCode();
    let unique = '&unique=' + uniqueId;
    let redirect = '&redirect_to=' + url;
    let tag = '';
    let userKey = getUserKeyFromStorage();
    if (userKey) {
        tag = '&st=' + userKey;
    }
    return baseUrl + affCode + unique + redirect + tag;
}

export function computeProductUrl(affUrl) {
    let baseUrl = affUrl;
    let tag = '';
    let userKey = getUserKeyFromStorage();
    if (userKey) {
        tag = '&st=' + userKey;
    }
    return baseUrl + tag;
}

export const spinnerCss = css`
    display: block;
    margin: 200px auto;
`;

export const smallerSpinnerCss = css`
    display: block;
    margin: 50px auto;
`;

export const emptyBackgroundCss = css`
   height: 0px !important;
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

export function onLanguageChange(event) {
    setLocalStorage(StorageKey.LANG, event.value);
    store.dispatch(setLangResources(event.value));
    window.location.reload();
}

export function getUrlParameter(param: string) {
    const name = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null
        ? ''
        : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function roundCommission(comission) {
    return comission.toFixed(2)
}

export function roundMoney(money) {
    return money.toFixed(2);
}

export const dateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
};