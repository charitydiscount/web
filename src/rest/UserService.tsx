import { DB, auth } from '../index';
import { FirebaseTable } from '../helper/Constants';

export interface UserDto {
    email: string;
    name: string;
    photoUrl: string;
    userId: string;
    disableMailNotification: boolean;
}

export interface AccountDto {
    iban: string;
    name: string;
    nickname: string;
}

export const getDisableMailNotification = (userId: string): Promise<any> =>
    DB.collection(FirebaseTable.USERS)
        .doc(userId)
        .get()
        .then(
            response =>
                (response.data() as UserDto).disableMailNotification
        ).catch(() => undefined);


export const getUserEmail = (userId: string): Promise<any> =>
    DB.collection(FirebaseTable.USERS)
        .doc(userId)
        .get()
        .then(
            response =>
                (response.data() as UserDto).email
        ).catch(() => undefined);


export function updateDisableMailNotification(disableMailNotification: boolean) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.USERS)
        .doc(auth.currentUser.uid)
        .set(
            {disableMailNotification: disableMailNotification},
            {merge: true}
        );
}

export function updateUserEmail(email: string) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.USERS)
        .doc(auth.currentUser.uid)
        .set(
            {email: email},
            {merge: true}
        );
}

export function unsubscribeMailNotification(userId) {
    return DB.collection(FirebaseTable.USERS)
        .doc(userId)
        .update(
            {disableMailNotification: true},
        )
}

export function updateUserAccount(accountName: string, accountIban: string) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.USERS)
        .doc(auth.currentUser.uid)
        .collection(FirebaseTable.ACCOUNTS)
        .doc(accountIban)
        .set(
            {
                name: accountName,
                iban: accountIban,
            },
            {merge: true}
        );
}

export const getUserBankAccounts = (userId: string): Promise<AccountDto[]> =>
    DB.collection(FirebaseTable.USERS)
        .doc(userId)
        .collection(FirebaseTable.ACCOUNTS)
        .get()
        .then(
            query =>
                query.docs.map(docSnap => docSnap.data() as AccountDto) || []
        );
