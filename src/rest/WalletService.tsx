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
    createdAt: firebase.firestore.Timestamp,
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
                        totalTransactions: data.transactions.length,
                        transactions: data.transactions
                    });
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    }
}