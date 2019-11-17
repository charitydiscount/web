import {DB, store} from "../index";
import {UserActions} from "../components/login/UserActions";
import {FirebaseTable} from "../helper/Constants";
import {getUserKeyFromStorage} from "../helper/AppHelper";

export interface UserDto {
    accounts: AccountDto[]
    email: string,
    name: string,
    photoUrl: string,
    userId: string
}

export interface AccountDto {
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

export function updateUserAccount(accountName, accountIban) {
    return new Promise((resolve, reject) => {
        let userKey = getUserKeyFromStorage();
        if (userKey) {
            let docRef = DB.collection(FirebaseTable.USERS).doc(userKey);
            docRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        let accountList = [] as AccountDto[];
                        accountList.push({
                            name: accountName,
                            iban: accountIban,
                            nickname: ''
                        });
                        docRef.update({
                            accounts: accountList
                        });
                        resolve();
                    } else {
                        reject();
                    }
                }).catch(() =>
                reject()
            );
        } else {
            reject();
        }
    });
}

export function getUserAccountInfo() {
    return new Promise((resolve, reject) => {
        let userKey = getUserKeyFromStorage();
        if (userKey) {
            let docRef = DB.collection(FirebaseTable.USERS).doc(userKey);
            docRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        let data = doc.data() as UserDto;
                        resolve(data.accounts[0]);
                    } else {
                        reject();
                    }
                }).catch(() =>
                reject()
            );
        } else {
            reject();
        }
    });
}