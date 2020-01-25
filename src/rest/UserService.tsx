import { DB, store, auth } from '../index';
import { AuthActions } from '../components/login/UserActions';
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

export function updateUser(user: UserDto, userFromIndex) {
    let docRef = DB.collection(FirebaseTable.USERS).doc(user.userId);
    docRef.get().then(function(doc) {
        if (!doc.exists) {
            docRef.set({
                email: user.email,
                name: user.name,
                photoUrl: user.photoUrl,
                userId: user.userId,
            });
        }
        store.dispatch(AuthActions.setLoggedUserAction(userFromIndex));
    });
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
