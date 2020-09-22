import { firestore } from 'firebase/app';
import { auth, DB } from "../index";
import { FirebaseTable } from "../helper/Constants";

export async function clickSaveAndRedirect(event, programId, cashbackUrl) {
    event.preventDefault();

    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    const userId = auth.currentUser.uid;
    const publicIp = require('public-ip');

    (async () => {
        let ipv4;
        let ipv6;
        try {
            ipv4 = await publicIp.v4();
            ipv6 = await publicIp.v6();
        } catch (e) {
            //failed to get all the info about ip
        }

        //create click info
        const data = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            userId: userId,
            ipAddress: ipv4 || "",
            ipv6Address: ipv6 || "",
            programId: programId,
            deviceType: "web"
        };

        DB.collection(FirebaseTable.CLICKS).add(data);
    })();

    window.open(cashbackUrl, '_blank', 'noopener noreferrer');
}