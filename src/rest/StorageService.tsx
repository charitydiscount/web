import { storage } from '../index';
import { profilePictureDefaultName, StorageRef } from '../helper/Constants';

export const fetchProfilePhoto = (userId: string) =>
    storage
        .ref(StorageRef.PROFILE_PHOTOS + userId)
        .child(profilePictureDefaultName)
        .getDownloadURL();
