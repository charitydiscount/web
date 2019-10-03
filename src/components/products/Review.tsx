import * as React from "react";
import {ProviderType, StorageKey} from "../../helper/Constants";
import {getLocalStorage} from "../../helper/StorageHelper";
import {LoginDto} from "../login/LoginComponent";

interface IReviewProps {
    photoUrl: string,
    name: string,
    description: string,
    rating: number
}

class Review extends React.Component<IReviewProps> {

    public render() {
        let photoUrl = this.props.photoUrl;
        const userSt = getLocalStorage(StorageKey.USER);
        if (userSt) {
            var user = JSON.parse(userSt) as LoginDto;
            if (user && user.providerType == ProviderType.FACEBOOK) {
                photoUrl += '?height=200';
            }
        }

        return (
            <React.Fragment>
                <div className="review_item">
                    <div className="media">
                        <div className="d-flex">
                            <img src={photoUrl} alt="No content" width={80} height={80} style={{borderRadius: 70}}/>
                        </div>
                        <div className="media-body">
                            <h4>{this.props.name}</h4>
                            {this.props.rating >= 1 ? <i className="fa fa-star"></i> :
                                <i className="fa fa-star-o"></i>}
                            {this.props.rating >= 2 ? <i className="fa fa-star"></i> :
                                <i className="fa fa-star-o"></i>}
                            {this.props.rating >= 3 ? <i className="fa fa-star"></i> :
                                <i className="fa fa-star-o"></i>}
                            {this.props.rating >= 4 ? <i className="fa fa-star"></i> :
                                <i className="fa fa-star-o"></i>}
                            {this.props.rating >= 5 ? <i className="fa fa-star"></i> :
                                <i className="fa fa-star-o"></i>}
                        </div>
                    </div>
                    <p>{this.props.description}</p>
                </div>
            </React.Fragment>
        )
    }
}

export default Review;