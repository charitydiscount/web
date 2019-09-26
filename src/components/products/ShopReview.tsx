import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {computeUrl} from "../../helper/AppHelper";
import {emptyHrefLink, StorageKey} from "../../helper/Constants";
import Modal from 'react-awesome-modal';
import {getShopById, ShopDto, updateFavoriteShops} from "../../rest/ShopsService";
import Review from "./Review";
import {fetchReviews, ReviewDto, updateReview} from "../../rest/ReviewService";
import {getLocalStorage} from "../../helper/StorageHelper";
import {LoginDto} from "../login/LoginComponent";

interface IProductReviewState {
    fShopVisible: boolean;
    favShop: boolean;
    logoSrc: string;
    name: string;
    id: number;
    category: string;
    mainUrl: string;
    uniqueCode: string,
    description: string,
    modalMessage: string,
    reviews: Array<ReviewDto>
}

interface IProductReviewProps {
    match: any
}

class ShopReview extends React.Component<IProductReviewProps, IProductReviewState> {

    constructor(props: IProductReviewProps) {
        super(props);
        this.state = {
            fShopVisible: false,
            logoSrc: '',
            favShop: false,
            name: '',
            id: 0,
            category: '',
            mainUrl: '',
            uniqueCode: '',
            description: '',
            modalMessage: '',
            reviews: []
        };
        this.updateFavoriteShopsTrue = this.updateFavoriteShopsTrue.bind(this);
        this.updateFavoriteShopsFalse = this.updateFavoriteShopsFalse.bind(this);
        this.updateCurrentReview = this.updateCurrentReview.bind(this);
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    }


    /**
     * Used to add favorite shops to DB
     */
    public updateFavoriteShopsTrue() {
        this.setState({
            modalMessage: "Favorite shop: " + this.state.name + "added",
            favShop: true
        });
        this.openModal();
        updateFavoriteShops(this.state.name, false);
    }

    /**
     * Used to remove favorite shops from DB
     */
    public updateFavoriteShopsFalse() {
        this.setState({
            modalMessage: "Favorite shop: " + this.state.name + "removed",
            favShop: false
        });
        this.openModal();
        updateFavoriteShops(this.state.name, true);
    }


    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.REVIEW));

        const shop = getShopById(this.props.match.params.id) as ShopDto;
        this.setState({
                fShopVisible: false,
                logoSrc: shop.logoPath,
                name: shop.name,
                id: shop.id,
                category: shop.category,
                mainUrl: shop.mainUrl,
                uniqueCode: shop.uniqueCode
            }
        );
        fetchReviews(shop.uniqueCode, this);
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.REVIEW));
    }

    closeModal() {
        this.setState({
            fShopVisible: false
        });
    }

    openModal() {
        this.setState({
            fShopVisible: true
        });
    }

    updateCurrentReview() {
        if (this.state.description && this.state.description.length > 0) {
            const userSt = getLocalStorage(StorageKey.USER);
            if (userSt) {
                var user = JSON.parse(userSt) as LoginDto;
                if (user) {
                    updateReview(this.state.uniqueCode, user.uid, user.photoURL, user.displayName, this.state.description);
                    this.setState({
                        modalMessage: "Review added"
                    });
                    this.openModal();
                }
            }
        }
    }

    handleTextAreaChange(event) {
        this.setState(
            {
                description: event.target.value
            });
    }

    public render() {
        var reviewsList = this.state.reviews ? this.state.reviews.map(review => {
            return <Review photoUrl={review.reviewer.photoUrl} name={review.reviewer.name}
                           description={review.description}/>
        }) : null;

        return (
            <React.Fragment>
                <Modal
                    visible={this.state.fShopVisible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <h3 style={{padding: 15}}>
                        {this.state.modalMessage}
                    </h3>
                </Modal>
                <section className={"product_description_area"}>
                    <div className={"container"}>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="text-center p_20">
                                    <img src={this.state.logoSrc} alt=""/>
                                    <div className="blog_details">
                                        <a href={emptyHrefLink}>
                                            <h2>{this.state.name}</h2>
                                        </a>
                                        <h3>{'Category: ' + this.state.category}</h3>
                                        <div className="s_product_text">
                                            <div className="card_area">
                                                <a href={computeUrl(this.state.uniqueCode, this.state.mainUrl)}
                                                   target="_blank"
                                                   rel="noopener noreferrer"
                                                   className="main_btn">
                                                    Access
                                                </a>
                                                <div
                                                    className={this.state.favShop === true ? 'icon_btn p_iconUpdate' : 'icon_btn p_icon'}>
                                                    <a href={emptyHrefLink} onClick={
                                                        this.state.favShop === true
                                                            ? this.updateFavoriteShopsFalse
                                                            : this.updateFavoriteShopsTrue
                                                    }>
                                                        <i className="lnr lnr-heart"/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tab-pane fade show active p_20" id="review">
                                    <div className="review_box">
                                        <p>Your Rating:</p>
                                        <ul className="list">
                                            <li>
                                                <a href="#">
                                                    <i className="fa fa-star"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <i className="fa fa-star"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <i className="fa fa-star"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <i className="fa fa-star"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <i className="fa fa-star"></i>
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="form-group">
                                             <textarea className="form-control"
                                                       value={this.state.description}
                                                       onChange={this.handleTextAreaChange}
                                                       placeholder={"Review"}>
                                             </textarea>
                                        </div>

                                        <div className="col-md-12 text-right">
                                            <a href={emptyHrefLink} onClick={this.updateCurrentReview}
                                               className="btn submit_btn">Submit Now
                                            </a>
                                        </div>
                                    </div>
                                    <div className="review_list p_20">
                                        {reviewsList}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default ShopReview;