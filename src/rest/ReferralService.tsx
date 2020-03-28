import { auth, DB } from "../index";
import { FirebaseTable, StorageKey } from "../helper/Constants";
import { removeLocalStorage } from "../helper/StorageHelper";
import { firestore } from "firebase";

export interface ReferralDto {
    createdAt: firestore.Timestamp,
    name: string,
    ownerId: string,
    photoUrl: string,
    userId: string
}

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

export const fetchReferrals = async (): Promise<ReferralDto[]> => {
    if (!auth.currentUser) {
        return [];
    }

    const referralRef = DB.collection(FirebaseTable.REFERRALS);
    let snap = await referralRef.where('ownerId', '==', auth.currentUser.uid).get();
    if (snap.empty) {
        return [];
    }

    let referrals = [] as ReferralDto[];
    snap.forEach(doc => {
        referrals.push(doc.data() as ReferralDto);
    });
    return referrals;
};