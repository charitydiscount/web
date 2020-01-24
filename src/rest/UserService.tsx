import { DB, store } from '../index';
import { AuthActions } from '../components/login/UserActions';
import { FirebaseTable } from '../helper/Constants';
import { getUserKeyFromStorage } from '../helper/AppHelper';
import { firestore } from 'firebase/app';

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

export function updateUserAccount(accountName, accountIban) {
    return DB.collection(FirebaseTable.USERS)
        .doc(getUserKeyFromStorage())
        .update({
            accounts: firestore.FieldValue.arrayUnion(
                ...[
                    {
                        name: accountName,
                        iban: accountIban,
                        nickname: '',
                    },
                ]
            ),
        });
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

// export function getUserAccountInfo() {
//     return new Promise((resolve, reject) => {
//         let userKey = getUserKeyFromStorage();
//         if (userKey) {
//             let docRef = DB.collection(FirebaseTable.USERS).doc(userKey);
//             docRef
//                 .get()
//                 .then(doc => {
//                     if (doc.exists) {
//                         let data = doc.data() as UserDto;
//                         resolve(data.accounts[0]);
//                     } else {
//                         reject();
//                     }
//                 })
//                 .catch(() => reject());
//         } else {
//             reject();
//         }
//     });
// }
