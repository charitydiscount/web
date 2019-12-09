import axios from 'axios';
import { auth, remoteConfig } from '../index';

export async function getPromotions(programId: number) {
    if (!auth.currentUser) {
        return;
    }

    const token = await auth.currentUser.getIdToken();
    const url = `${remoteConfig.getString(
        'affiliate_endpoint'
    )}/programs/${programId}/promotions`;

    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
}
