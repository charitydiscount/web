import {fetchAffiliateCode} from "../rest/ConfigService";
import {getLocalStorage, setLocalStorage} from "./StorageHelper";
import {StorageKey} from "./Constants";
import {LoginDto, LoginMapper} from "../components/login/LoginComponent";
import {auth} from "../index";

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

export function setLoggedInUser() {
    auth.onAuthStateChanged(function (user) {
        if (user) {
            var objectMapper = require('object-mapper');
            let parsedUser = objectMapper(user as LoginDto, LoginMapper);
            setLocalStorage(StorageKey.USER, JSON.stringify(parsedUser));
        }
    });
}