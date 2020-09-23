import { fetchProfilePhoto } from "../../rest/StorageService";
import { facebookPictureKey, noImagePath, profilePictureSuffix } from "../../helper/Constants";
import { getUserInfo } from "./AuthHelper";

export interface UserPhotoState {
    photoURL: string,
    displayName?: string,
    email?: string,
    userId?: string,
    isLoadingPhoto: boolean,
    normalUser?: boolean
}

export async function loadUserIdPhoto(component, photoUrl, userId) {
    if (!photoUrl) {
        component.setState({
            isLoadingPhoto: true
        });
        try {
            const response = await fetchProfilePhoto(
                userId
            );
            component.setState({
                photoURL: response as string,
                isLoadingPhoto: false
            });
        } catch (error) {
            component.setState({
                photoURL: noImagePath,
                isLoadingPhoto: false
            });
        }
    } else {
        if (photoUrl.includes(facebookPictureKey)) {
            component.setState({
                photoURL: photoUrl + profilePictureSuffix,
                normalUser: false
            });
        }
    }
}


export async function loadCurrentUserPhoto(component) {
    let currentUser = getUserInfo();
    component.setState({
        photoURL: currentUser.photoURL || '',
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        userId: currentUser.uid || ''
    });

    if (!currentUser.photoURL) {
        component.setState({
            isLoadingPhoto: true,
            normalUser: true
        });
        try {
            const response = await fetchProfilePhoto(
                currentUser.uid
            );
            component.setState({
                photoURL: response as string,
                isLoadingPhoto: false,
                normalUser: true
            });
        } catch (error) {
            component.setState({
                photoURL: noImagePath,
                isLoadingPhoto: false,
                normalUser: true
            });
        }
    } else {
        if (currentUser.photoURL && currentUser.photoURL.includes(facebookPictureKey)) {
            component.setState({
                photoURL: currentUser.photoURL + profilePictureSuffix,
                normalUser: false
            });
        }
    }
}