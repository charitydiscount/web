import { DB, auth } from '../index';
import { FirebaseTable } from '../helper/Constants';

export interface UserDto {
    email: string;
    name: string;
    photoUrl: string;
    userId: string;
    disableMailNotification: boolean,
    needsMailConfirmation: boolean,
    privateName: boolean,
    privatePhoto: boolean
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

export const getUserDbInfo = (userId: string): Promise<any> =>
    DB.collection(FirebaseTable.USERS)
        .doc(userId)
        .get()
        .then(
            response =>
                (response.data() as UserDto)
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

export async function updateUserPrivateName(privateName: boolean) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.USERS)
        .doc(auth.currentUser.uid)
        .set(
            {privateName: privateName},
            {merge: true}
        );
}

export async function updateUserName(name: string) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    //update in auth
    await auth.currentUser.updateProfile(
        {displayName: name}
    );

    //update in users table
    return DB.collection(FirebaseTable.USERS)
        .doc(auth.currentUser.uid)
        .set(
            {name: name},
            {merge: true}
        );
}

export async function updateUserPhotoUrl(photoUrl: string) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.USERS)
        .doc(auth.currentUser.uid)
        .set(
            {photoUrl: photoUrl},
            {merge: true}
        );
}

export async function updateUserPrivatePhoto(privatePhoto: boolean) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.USERS)
        .doc(auth.currentUser.uid)
        .set(
            {privatePhoto: privatePhoto},
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
            {
                email: email,
                needsMailConfirmation: true
            },
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
