import {DB, store} from "../index";
import {UserActions} from "../components/login/UserActions";
import {FirebaseTable} from "../helper/Constants";

export interface UserDto {
    accounts: Account[]
    email: string,
    name: string,
    photoUrl: string,
    userId: string
}

export interface Account {
    iban: string,
    name: string,
    nickname: string
}

export function updateUser(user: UserDto, userFromIndex) {
    let docRef = DB.collection(FirebaseTable.USERS).doc(user.userId);
    docRef.get().then(function (doc) {
        if (!doc.exists) {
            docRef.set({
                accounts: [],
                email: user.email,
                name: user.name,
                photoUrl: user.photoUrl,
                userId: user.userId
            })
        }
        store.dispatch(UserActions.setLoggedUserAction(userFromIndex));
    });
}