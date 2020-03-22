import { auth, DB } from "../index";
import { FirebaseTable, StorageKey } from "../helper/Constants";
import { removeLocalStorage } from "../helper/StorageHelper";
import { firestore } from "firebase";

export async function updateReferralForKey(referralCode) {
    if (!auth.currentUser) {
        return;
    }

    if (auth.currentUser.uid.localeCompare(referralCode) === 0) {
        removeLocalStorage(StorageKey.REFERRAL_KEY);
        return;
    }

    const data = {
        newUserId: auth.currentUser.uid,
        referralCode: referralCode,
        createdAt: firestore.FieldValue.serverTimestamp(),
    };

    return DB.collection(FirebaseTable.REFERRAL_REQUESTS).add(data)
        .then(() => {
            removeLocalStorage(StorageKey.REFERRAL_KEY)
        });
}