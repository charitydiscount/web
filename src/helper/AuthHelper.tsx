import {LoginDto, LoginMapper, LoginRequestDto} from "../components/login/LoginComponent";
import {ProviderType, StorageKey} from "./Constants";
import {setLocalStorage} from "./StorageHelper";

export function parseAndSaveUser(user: firebase.User) {
    let objectMapper = require('object-mapper');
    let parsedUser = objectMapper(
        user as LoginRequestDto,
        LoginMapper
    ) as LoginDto;
    if (user.metadata.creationTime) {
        parsedUser.creationTime = user.metadata.creationTime;
    }
    if (user.providerData[0]) {
        let providerId = user.providerData[0].providerId;
        if (providerId.startsWith('google')) {
            parsedUser.providerType = ProviderType.GOOGLE;
        } else if (providerId.startsWith('facebook')) {
            parsedUser.providerType = ProviderType.FACEBOOK;
        } else {
            parsedUser.providerType = ProviderType.NORMAL;
        }
    }
    parsedUser.locale = '';
    setLocalStorage(StorageKey.USER, JSON.stringify(parsedUser));
    return JSON.stringify(parsedUser);
}