import {storage} from "../index";
import {profilePictureDefaultName, StorageRef} from "../helper/Constants";

export function fetchProfilePhoto(userId) {
    return new Promise((resolve, reject) => {
        storage.ref(StorageRef.PROFILE_PHOTOS + userId)
            .child(profilePictureDefaultName)
            .getDownloadURL()
            .then(url => {
                resolve(url);
            })
            .catch(() => {
                reject();
            })
    });
}