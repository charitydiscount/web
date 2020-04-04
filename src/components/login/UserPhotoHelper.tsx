import { auth } from "../../index";
import { fetchProfilePhoto } from "../../rest/StorageService";
import { facebookPictureKey, noImagePath, profilePictureSuffix } from "../../helper/Constants";

export interface UserPhotoState {
    photoURL: string,
    displayName?: string,
    email?: string,
    userId?: string,
    isLoadingPhoto: boolean,
    normalUser?: boolean
}

export async function loadUserIdPhoto(component, photoUrl, userId){
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
    if (auth.currentUser) {
        component.setState({
            photoURL: auth.currentUser.photoURL || '',
            displayName: auth.currentUser.displayName || '',
            email: auth.currentUser.email || '',
            userId: auth.currentUser.uid || ''
        });

        if (!auth.currentUser.photoURL) {
            component.setState({
                isLoadingPhoto: true,
                normalUser: true
            });
            try {
                const response = await fetchProfilePhoto(
                    auth.currentUser.uid
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
            if (auth.currentUser.photoURL.includes(facebookPictureKey)) {
                component.setState({
                    photoURL: auth.currentUser.photoURL + profilePictureSuffix,
                    normalUser: false
                });
            }
        }
    }
}