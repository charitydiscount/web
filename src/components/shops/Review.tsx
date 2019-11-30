import * as React from "react";
import {fetchProfilePhoto} from "../../rest/StorageService";
import {facebookPictureKey, noImagePath, profilePictureSuffix} from "../../helper/Constants";

interface IReviewState {
    photoURL: string
}

interface IReviewProps {
    photoUrl: string,
    name: string,
    description: string,
    rating: number,
    userID: string
}

class Review extends React.Component<IReviewProps, IReviewState> {

    constructor(props: IReviewProps) {
        super(props);
        let photoUrl = this.props.photoUrl;
        if (!photoUrl) {
            photoUrl = noImagePath;
        } else {
            if (photoUrl.includes(facebookPictureKey)) {
                photoUrl += profilePictureSuffix;
            }
        }
        this.state = {
            photoURL: photoUrl
        };
    }

    async componentDidMount() {
        if (!this.props.photoUrl) {
            try {
                const response = await fetchProfilePhoto(this.props.userID);
                this.setState({
                    photoURL: response as string,
                });
            } catch (error) {
                //error -> no image content will be shown
            }
        }
    }

    public render() {
        return (
            <React.Fragment>
                <div className="review_item">
                    <div className="media">
                        <div className="d-flex">
                            <img src={this.state.photoURL} alt="N" width={80} height={80}
                                 style={{borderRadius: 70}}/>
                        </div>
                        <div className="media-body">
                            <h4>{this.props.name}</h4>
                            {this.props.rating >= 1 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                            {this.props.rating >= 2 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                            {this.props.rating >= 3 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                            {this.props.rating >= 4 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                            {this.props.rating >= 5 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                        </div>
                    </div>
                    <p>{this.props.description}</p>
                </div>
            </React.Fragment>
        )
    }
}

export default Review;