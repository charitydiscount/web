import {DB} from "../index";
import {FirebaseTable} from "../helper/Constants";
import {LoginDto} from "../components/login/LoginComponent";

export function addContactMessageToDb(user, message, subject) {
    const data = {
        name: (JSON.parse(user) as LoginDto).displayName,
        email: (JSON.parse(user) as LoginDto).email,
        message: message,
        subject: subject,
        userId: (JSON.parse(user) as LoginDto).uid
    };

    return DB.collection(FirebaseTable.CONTACT).add(
        data
    );
}