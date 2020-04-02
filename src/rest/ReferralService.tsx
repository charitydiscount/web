import { auth, DB, remoteConfig } from '../index';
import { FirebaseTable, StorageKey } from '../helper/Constants';
import { removeLocalStorage } from '../helper/StorageHelper';
import { firestore } from 'firebase/app';
import axios from 'axios';

export interface ReferralDto {
    createdAt: firestore.Timestamp;
    name: string;
    ownerId: string;
    photoUrl: string;
    userId: string;
}

export async function updateReferralForKey(referralCode: string) {
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

    return DB.collection(FirebaseTable.REFERRAL_REQUESTS)
        .add(data)
        .then(() => {
            removeLocalStorage(StorageKey.REFERRAL_KEY);
        });
}

export const fetchReferrals = async (): Promise<ReferralDto[]> => {
    if (!auth.currentUser) {
        return [];
    }

    const referralRef = DB.collection(FirebaseTable.REFERRALS);
    let snap = await referralRef
        .where('ownerId', '==', auth.currentUser.uid)
        .get();
    if (snap.empty) {
        return [];
    }

    let referrals = [] as ReferralDto[];
    snap.forEach(doc => {
        referrals.push(doc.data() as ReferralDto);
    });
    return referrals;
};

let _cachedDynamicLink: string;

export const buildDynamicLink = async (
    metaTitle: string,
    metaDescription: string
): Promise<string> => {
    if (_cachedDynamicLink) {
        return _cachedDynamicLink;
    }

    const targetBase =
        remoteConfig.getString('dynamic_link_target') ||
        'https://charitydiscount.ro';

    const response = await axios.post(
        `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.REACT_APP_FB_API_KEY}`,
        {
            dynamicLinkInfo: {
                domainUriPrefix: remoteConfig.getString('dynamic_link_prefix'),
                link: `${targetBase}/referral/${auth.currentUser?.uid}`,
                androidInfo: {
                    androidPackageName: 'com.clover.charity_discount',
                    androidMinPackageVersionCode: '500',
                },
                iosInfo: {
                    iosBundleId: 'com.clover.CharityDiscount',
                    iosAppStoreId: '1492115913',
                    iosMinimumVersion: '500',
                },
                analyticsInfo: {
                    googlePlayAnalytics: {
                        utmCampaign: 'referrals',
                        utmMedium: 'social',
                        utmSource: 'mobile',
                    },
                },
                socialMetaTagInfo: {
                    socialTitle: metaTitle,
                    socialDescription: metaDescription,
                    socialImageLink: remoteConfig.getString('meta_image_url'),
                },
            },
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    _cachedDynamicLink = response.data.shortLink;
    return _cachedDynamicLink;
};
