import { fetchProfilePhoto } from "../../rest/StorageService";
import { facebookPictureKey, noImagePath, profilePictureSuffix } from "../../helper/Constants";

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