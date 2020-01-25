import {DB} from "../index";
import {FirebaseTable} from "../helper/Constants";

export function addContactMessageToDb(displayName, email, uid, message, subject) {
    const data = {
        name: displayName,
        email: email,
        message: message,
        subject: subject,
        userId: uid
    };

    return DB.collection(FirebaseTable.CONTACT).add(
        data
    );
}