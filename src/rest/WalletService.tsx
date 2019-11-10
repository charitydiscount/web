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
    amount: number;
    date: firestore.Timestamp;
    target: string;
    type: string;
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
                        transactionList.sort(function (x, y) {
                            let a = x.date.toDate(),
                                b = y.date.toDate();
                            if (a > b) return -1;
                            if (a < b) return 1;
                            return 0;
                        });
                        data.transactions = transactionList;
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

export interface CommissionWrapper {
    transactions: CommissionDto[];
}

export interface CommissionDto {
    amount: number;
    createdAt: firestore.Timestamp;
    shopId: string;
    status: string;
}

export function fetchCommissions() {
    return new Promise((resolve, reject) => {
        let keyExist = getUserKeyFromStorage();
        if (keyExist) {
            DB.collection(FirebaseTable.COMMISSIONS).doc(keyExist).get()
                .then(function (doc) {
                    if (doc.exists) {
                        const data = doc.data() as CommissionWrapper;
                        let transactionList = data.transactions as CommissionDto[];
                        transactionList.sort(function (x, y) {
                            let a = x.createdAt.toDate(),
                                b = y.createdAt.toDate();
                            if (a > b) return -1;
                            if (a < b) return 1;
                            return 0;
                        });
                        data.transactions = transactionList;
                        resolve(data);
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
                    resolve(true);
                })
                .catch(() => {
                    reject();
                });
        } else {
            reject()
        }
    })
}


export interface OtpDto {
    generated: firestore.Timestamp;
    code: string;
}

export function validateOtpCode(code) {
    return new Promise((resolve, reject) => {
        let keyExist = getUserKeyFromStorage();
        if (keyExist) {
            DB.collection(FirebaseTable.OTPS).doc(keyExist).get()
                .then(function (doc) {
                    if (doc.exists) {
                        let dbObject = doc.data() as OtpDto;
                        if (dbObject.code === code) {
                            resolve(true);
                        } else {
                            reject(); //code is not right;
                        }
                    } else {
                        reject(); // object doesn't exist;
                    }
                })
                .catch(() => {
                    reject(); //DB not working
                });
        } else {
            reject(); // unreachable state
        }
    })
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
                    }, 4000);
                })
                .catch(() => {
                    reject();
                });
        }
    });
}
