import {fetchAffiliateCode} from "../rest/ConfigService";
import {getLocalStorage} from "./WebHelper";
import {StorageKey} from "./Constants";

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
    var tag = '&st=' + getLocalStorage(StorageKey.USER);
    return baseUrl + affCode + unique + redirect + tag;
}