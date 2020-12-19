import * as React from 'react';
import { fetchProfilePhoto } from '../../rest/StorageService';
import {
    facebookPictureKey,
    noImagePath,
    profilePictureSuffix,
} from '../../helper/Constants';
import { ReviewDto } from "../../rest/ReviewService";
import { addDefaultImgSrc, dateOptions } from "../../helper/AppHelper";

interface IReviewState {
    photoURL: string;
}

interface IReviewProps {
    review: ReviewDto,
}

class Review extends React.Component<IReviewProps, IReviewState> {
    constructor(props: IReviewProps) {

        super(props);
        let photoUrl = this.props.review.reviewer.photoUrl;
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
        if (!this.props.review.reviewer.photoUrl) {
            try {
                const response = await fetchProfilePhoto(this.props.review.reviewer.userId);
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
            star <= this.props.review.rating ? (
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

        let creationDate;
        try {
            creationDate = <h5>{this.props.review.createdAt
                .toDate()
                .toLocaleDateString('ro-RO', dateOptions)}</h5>
        } catch (e) {
            //creation date not parsed
        }

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
                                onError={addDefaultImgSrc}
                            />
                        </div>
                        <div className="media-body">
                            <h4>{this.props.review.reviewer.name}</h4>
                            {creationDate}
                            {rating}
                        </div>
                    </div>
                    <p>{this.props.review.description}</p>
                </div>
            </React.Fragment>
        );
    }
}

export default Review;
