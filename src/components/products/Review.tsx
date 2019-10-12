import * as React from "react";
import {fbStorage} from "../../index";

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
        if (photoUrl.includes("facebook")) {
            photoUrl += '?height=200';
        }
        this.state = {
            photoURL: photoUrl,
        };
    }

    public render() {
        if (!this.props.photoUrl) {
            fbStorage.ref("profilePhotos/" + this.props.userID)
                .child("profilePicture.png")
                .getDownloadURL()
                .then(url => this.setState({photoURL: url}))
                .catch(() => this.setState({
                    photoURL: "/img/no-image.jpg"
                }));
        }

        return (
            <React.Fragment>
                <div className="review_item">
                    <div className="media">
                        <div className="d-flex">
                            <img src={this.state.photoURL} alt="No content" width={80} height={80}
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