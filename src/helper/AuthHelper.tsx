import {LoginDto, LoginMapper, LoginRequestDto} from "../components/login/LoginComponent";
import {StorageKey} from "./Constants";
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
    parsedUser.locale = '';
    setLocalStorage(StorageKey.USER, JSON.stringify(parsedUser));
    return JSON.stringify(parsedUser);
}