import {FirebaseTable} from '../helper/Constants';
import {DB} from '../index';
import {firestore} from 'firebase/app';
import {getUserKeyFromStorage} from "../helper/AppHelper";

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
    amount: number,
    currency: string,
    date: firestore.Timestamp,
    target: string,
    type: string
}

export function fetchWalletInfo() {
    return new Promise((resolve, reject) => {
        let keyExist = getUserKeyFromStorage();
        if (keyExist) {
            DB.collection(FirebaseTable.POINTS).doc(keyExist).get()
                .then(function (doc) {
                    if (doc.exists) {
                        const data = doc.data() as WalletWrapper;
                        let transactionList = data.transactions as TransactionDto[];
                        if (transactionList) {
                            transactionList.sort(function (x, y) {
                                let a = x.date.toDate(),
                                    b = y.date.toDate();
                                if (a > b) return -1;
                                if (a < b) return 1;
                                return 0;
                            });
                            data.transactions = transactionList;
                        }
                        resolve(data);
                    } else {
                        reject(); //entry doesn't exist in DB
                    }
                })
                .catch(() => {
                    reject(); //DB not working
                })
        } else {
            reject() // not reachable state
        }
    });
}

export interface CommissionDto {
    amount: number;
    createdAt: firestore.Timestamp;
    currency: string,
    shopId: number;
    program: ProgramDto
    status: string;
}

export interface ProgramDto {
    name: string
}

export function fetchCommissions() {
    return new Promise((resolve, reject) => {
        let keyExist = getUserKeyFromStorage();
        if (keyExist) {
            DB.collection(FirebaseTable.COMMISSIONS).doc(keyExist).get()
                .then(function (doc) {
                    if (doc.exists) {
                        const data = doc.data() as Map<String, CommissionDto>;
                        let commissions = [] as CommissionDto[];
                        for (let i = 0; i < (Object.entries(data).length - 1); i++) {
                            let element = Object.entries(data)[i][1] as CommissionDto;
                            commissions.push(element as CommissionDto);
                        }
                        if (commissions) {
                            commissions.sort(function (x, y) {
                                let a = x.createdAt.toDate(),
                                    b = y.createdAt.toDate();
                                if (a > b) return -1;
                                if (a < b) return 1;
                                return 0;
                            });

                        }
                        resolve(commissions);
                    } else {
                        reject(); // entry not found in DB
                    }
                })
                .catch(() => {
                    reject(); //DB not working
                })
        } else {
            reject() // not reachable state
        }
    });
}

export function createOtpRequest() {
    return new Promise((resolve, reject) => {
        let keyExist = getUserKeyFromStorage();
        if (keyExist) {
            const data = {
                userId: keyExist,
                createdAt: firestore.FieldValue.serverTimestamp(),
            };

            DB.collection(FirebaseTable.OTP_REQUESTS).doc(keyExist)
                .set(data)
                .then(() => {
                    setTimeout(function () {
                        resolve(true);
                    }, 2000);
                })
                .catch(() => {
                    reject();
                });
        } else {
            reject()
        }
    })
}

export function validateOtpCode(code: number) {
    let userKey = getUserKeyFromStorage();
    if (!userKey) {
        return false;
    }

    return DB.collection(FirebaseTable.OTPS)
        .doc(userKey)
        .get()
        .then(doc => doc.exists && doc.data()!.code === code)
        .catch(() => false);
}

export function createRequest(amount, type, targetId) {
    return new Promise((resolve, reject) => {
        let keyExist = getUserKeyFromStorage();
        if (keyExist) {
            const data = {
                amount: amount,
                createdAt: firestore.FieldValue.serverTimestamp(),
                currency: 'RON',
                status: 'PENDING',
                target: targetId,
                type: type,
                userId: keyExist,
            };

            DB.collection(FirebaseTable.REQUESTS)
                .add(data)
                .then(() => {
                    setTimeout(function () {
                        resolve(true);
                    }, 6000);
                })
                .catch(() => {
                    reject();
                });
        }
    });
}
