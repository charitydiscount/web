import * as React from 'react';
import { fetchProfilePhoto } from '../../rest/StorageService';
import {
    facebookPictureKey,
    noImagePath,
    profilePictureSuffix,
} from '../../helper/Constants';

interface IReviewState {
    photoURL: string;
}

interface IReviewProps {
    photoUrl: string;
    name: string;
    description: string;
    rating: number;
    userID: string;
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
            photoURL: photoUrl,
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
                this.setState({
                    photoURL: noImagePath
                });
            }
        }
    }

    public render() {
        const rating = [1, 2, 3, 4, 5].map(star =>
            star <= this.props.rating ? (
                <i
                    key={`star-${star}`}
                    className="fa fa-star star-focus fa-lg"
                />
            ) : (
                <i
                    key={`star-${star}`}
                    className="fa fa-star-o star-focus fa-lg"
                />
            )
        );

        return (
            <React.Fragment>
                <div className="review_item">
                    <div className="media">
                        <div className="d-flex">
                            <img
                                src={this.state.photoURL}
                                alt="N"
                                width={80}
                                height={80}
                                style={{ borderRadius: 70 }}
                                onError={() =>
                                    this.setState({
                                        photoURL: noImagePath
                                    })
                                }
                            />
                        </div>
                        <div className="media-body">
                            <h4>{this.props.name}</h4>
                            {rating}
                        </div>
                    </div>
                    <p>{this.props.description}</p>
                </div>
            </React.Fragment>
        );
    }
}

export default Review;
