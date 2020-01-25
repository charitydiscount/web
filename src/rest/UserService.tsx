import { DB, auth } from '../index';
import { FirebaseTable } from '../helper/Constants';

export interface UserDto {
    email: string;
    name: string;
    photoUrl: string;
    userId: string;
}

export interface AccountDto {
    iban: string;
    name: string;
    nickname: string;
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
            { merge: true }
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
