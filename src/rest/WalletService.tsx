import {getLocalStorage} from "../helper/StorageHelper";
import {StorageKey} from "../helper/Constants";
import {DB} from "../index";
import {LoginDto} from "../components/login/LoginComponent";
import firebase from "firebase";

export interface WalletWrapper {
    cashback: WalletInfoDto,
    points: WalletInfoDto
    transactions: TransactionDto[]
}

export interface WalletInfoDto {
    approved: number,
    pending: number
}

export interface TransactionDto {
    amount: number,
    date: firebase.firestore.Timestamp,
    target: string,
    type: string,
}

export function fetchWalletInfo(walletLayout) {
    var user = getLocalStorage(StorageKey.USER);
    if (user) {
        var keyExist = (JSON.parse(user) as LoginDto).uid;
        if (keyExist) {
            var docRef = DB.collection("points").doc(keyExist);
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    const data = doc.data() as WalletWrapper;
                    walletLayout.setState({
                        cashbackApproved: data.cashback.approved,
                        cashbackPending: data.cashback.pending,
                        pointsApproved: data.points.approved,
                        pointsPending: data.points.pending,
                        totalTransactions: data.transactions ? data.transactions.length : 0,
                        transactions: data.transactions
                    });
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    }
}

export interface CommissionWrapper {
    transactions: CommissionDto[]
}

export interface CommissionDto {
    amount: number,
    createdAt: firebase.firestore.Timestamp,
    shopId: string,
    status: string
}

export function fetchCommissions(walletLayout) {
    var user = getLocalStorage(StorageKey.USER);
    if (user) {
        var keyExist = (JSON.parse(user) as LoginDto).uid;
        if (keyExist) {
            var docRef = DB.collection("commissions").doc(keyExist);
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    const data = doc.data() as CommissionWrapper;
                    walletLayout.setState({
                        commissions: data.transactions
                    });
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    }
}

export function createRequest(amount, type, targetId) {
    var user = getLocalStorage(StorageKey.USER);
    if (user) {
        var keyExist = (JSON.parse(user) as LoginDto).uid;
        if (keyExist) {
            const data = {
                amount: amount,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                currency: "RON",
                target: targetId,
                type: type,
                userId: keyExist
            };

            DB.collection('requests').add(
                data
            ).then(ref => {
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            });
        }
    }
}