import { FirebaseTable } from '../helper/Constants';
import { DB, auth } from '../index';
import { firestore } from 'firebase/app';

export interface WalletWrapper {
    cashback: WalletInfoDto;
    points: WalletInfoDto;
    transactions: TransactionDto[];
}

export interface WalletInfoDto {
    approved: number;
    pending: number;
}

export interface TransactionDto {
    amount: number;
    currency: string;
    date: firestore.Timestamp;
    target: string;
    type: string;
}

export const fetchWallet = () => {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.POINTS)
        .doc(auth.currentUser.uid)
        .get();
};

export interface CommissionDto {
    amount: number;
    createdAt: firestore.Timestamp;
    currency: string;
    shopId: number;
    program: ProgramDto;
    status: string;
}

export interface ProgramDto {
    name: string;
    logo: string;
}

export const fetchCommissions = async (): Promise<CommissionDto[]> => {
    if (!auth.currentUser) {
        return [];
    }

    return DB.collection(FirebaseTable.COMMISSIONS)
        .doc(auth.currentUser.uid)
        .get()
        .then(snap =>
            snap.exists
                ? Object.entries(snap.data() as Map<String, CommissionDto>)
                      .filter(([key, commission]) => key !== 'userId')
                      .map(([key, commission]) => commission)
                : []
        );
};

export function createOtpRequest() {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.OTP_REQUESTS)
        .doc(auth.currentUser.uid)
        .set({
            userId: auth.currentUser.uid,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
}

export function validateOtpCode(code: number) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.OTPS)
        .doc(auth.currentUser.uid)
        .get()
        .then(doc => doc.exists && doc.data()!.code === code)
        .catch(() => false);
}

export function createRequest(amount: number, type: string, targetId: string) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    const data = {
        userId: auth.currentUser.uid,
        type: type,
        amount: amount,
        currency: 'RON',
        target: targetId,
        createdAt: firestore.FieldValue.serverTimestamp(),
        status: 'PENDING',
    };

    return DB.collection(FirebaseTable.REQUESTS).add(data);
}
