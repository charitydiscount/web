import {auth} from "../index";

export function login(username: string, password: string){
    return auth.signInWithEmailAndPassword(username, password);
}

export function register(username: string, password: string){
    return auth.createUserWithEmailAndPassword(username, password);
}