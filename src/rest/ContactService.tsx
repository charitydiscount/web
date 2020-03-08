import { DB } from '../index';
import { FirebaseTable } from '../helper/Constants';
import { firestore } from 'firebase/app';

export function addContactMessageToDb(
    displayName,
    email,
    uid,
    message,
    subject
) {
    const data = {
        createdAt: firestore.FieldValue.serverTimestamp(),
        status: 'NEW',
        name: displayName,
        email: email,
        message: message,
        subject: subject,
        userId: uid,
    };

    return DB.collection(FirebaseTable.CONTACT).add(data);
}
