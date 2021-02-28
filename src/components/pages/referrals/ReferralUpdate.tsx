import React from 'react';
import { getLocalStorage } from '../../../helper/StorageHelper';
import { StorageKey } from '../../../helper/Constants';
import { updateReferralForKey } from '../../../rest/ReferralService';

class ReferralUpdate extends React.Component {
    async componentDidMount() {
        let referralKey = getLocalStorage(StorageKey.REFERRAL_KEY);
        if (referralKey) {
            await updateReferralForKey(referralKey);
        }
    }

    public render() {
        return <React.Fragment />;
    }
}

export default ReferralUpdate;
