import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {computeUrl, getUserFromStorage} from "../../helper/AppHelper";
import {emptyHrefLink, StorageKey} from "../../helper/Constants";
import Modal from 'react-awesome-modal';
import {getShopById, ShopDto, updateFavoriteShops, verifyInFavoriteShops} from "../../rest/ShopsService";
import Review from "./Review";
import {fetchReviews, ReviewDto, updateReview} from "../../rest/ReviewService";
import {LoginDto} from "../login/LoginComponent";
import {FormattedMessage} from 'react-intl';
import {InjectedIntlProps, injectIntl} from "react-intl";
import {removeLocalStorage} from "../../helper/StorageHelper";

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
    rating: number,
    reviews: Array<ReviewDto>
}

interface IProductReviewProps {
    match: any
}

class ShopReview extends React.Component<IProductReviewProps & InjectedIntlProps, IProductReviewState> {

    constructor(props: IProductReviewProps & InjectedIntlProps) {
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
            rating: 0,
            reviews: []
        };
        this.updateFavoriteShopsTrue = this.updateFavoriteShopsTrue.bind(this);
        this.updateFavoriteShopsFalse = this.updateFavoriteShopsFalse.bind(this);
        this.updateCurrentReview = this.updateCurrentReview.bind(this);
        this.handleStarFocusEnter = this.handleStarFocusEnter.bind(this);
        this.handleStarFocusRemove = this.handleStarFocusRemove.bind(this);
        this.handleShowModalMessage = this.handleShowModalMessage.bind(this);
    }


    /**
     * Used to add favorite shops to DB
     */
    async updateFavoriteShopsTrue() {
        try {
            let response = await updateFavoriteShops(this.state.name, false);
            if (response) {
                this.handleShowModalMessage(this.props.intl.formatMessage({id: "shop.favorite.shop"}) +
                    this.state.name + ' ' +
                    this.props.intl.formatMessage({id: "shop.favorite.shop.added"}), true);
            }
        } catch (error) {
            this.handleShowModalMessage(this.props.intl.formatMessage({id: "favorite.shop.failed.to.update"}), true);
        }
    }

    /**
     * Used to remove favorite shops from DB
     */
    async updateFavoriteShopsFalse() {
        try {
            let response = await updateFavoriteShops(this.state.name, true);
            if (response) {
                this.handleShowModalMessage(this.props.intl.formatMessage({id: "shop.favorite.shop"}) +
                    this.state.name + ' ' +
                    this.props.intl.formatMessage({id: "shop.favorite.shop.removed"}), false);
            }
        } catch (error) {
            this.handleShowModalMessage(this.props.intl.formatMessage({id: "favorite.shop.failed.to.update"}), false);
        }
    }


    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.REVIEW));

        const shop = getShopById(this.props.match.params.id) as ShopDto;
        let favShop = verifyInFavoriteShops(shop.id);
        this.setState({
                fShopVisible: false,
                logoSrc: shop.logoPath,
                name: shop.name,
                id: shop.id,
                category: shop.category,
                mainUrl: shop.mainUrl,
                uniqueCode: shop.uniqueCode,
                favShop: favShop
            }
        );

        try {
            let response = await fetchReviews(shop.uniqueCode);
            if (response) {
                this.setState({
                    reviews: response as Array<ReviewDto>
                });
            }
        } catch (error) {
            //reviews won't be loaded
        }

    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.REVIEW));
    }

    closeModal() {
        this.setState({
            fShopVisible: false
        });
        window.location.reload();
    }

    openModal() {
        this.setState({
            fShopVisible: true
        });
    }

    async updateCurrentReview() {
        if ((this.state.description && this.state.description.length > 0) && this.state.rating > 0) {
            const user = getUserFromStorage();
            if (user) {
                const userParsed = JSON.parse(user) as LoginDto;
                if (userParsed) {
                    try {
                        let response = await updateReview(this.state.uniqueCode, this.state.rating, userParsed.uid,
                            userParsed.photoURL, userParsed.displayName, this.state.description);
                        if (response) {
                            removeLocalStorage(StorageKey.REVIEWS);
                            this.handleShowModalMessage(this.props.intl.formatMessage({id: "review.update.message"}), null);
                        }
                    } catch (error) {
                        this.handleShowModalMessage(this.props.intl.formatMessage({id: "review.failed.to.update.error.message"}), null);
                    }
                }
            }
        } else {
            this.handleShowModalMessage(this.props.intl.formatMessage({id: "review.error.message"}), null);
        }
    }

    handleShowModalMessage(message, favShop) {
        if (favShop !== null) {
            this.setState({
                modalMessage: message,
                favShop: favShop
            });
        } else {
            this.setState({
                modalMessage: message
            });
        }
        this.openModal();
    }

    handleStarClicked(event, starLevel) {
        for (let i = 1; i <= 5; i++) {
            let element = document.getElementById("star-" + i);
            if (i <= starLevel) {
                if (element) {
                    element.className = "fa fa-star star-focus";
                    this.setState({
                        rating: starLevel
                    })
                }
            } else {
                if (element) {
                    element.className = "fa fa-star-o";
                }
            }
        }
    }

    handleStarFocusEnter(event, starLevel) {
        for (let i = 1; i <= starLevel; i++) {
            const element = document.getElementById("star-" + i);
            if (element) {
                if (this.state.rating === 0 || this.state.rating < i) {
                    element.className = "fa fa-star star-focus";
                }
            }
        }
    }

    handleStarFocusRemove(event, starLevel) {
        for (let i = 1; i <= starLevel; i++) {
            let element = document.getElementById("star-" + i);
            if (element) {
                if (this.state.rating === 0 || this.state.rating < i) {
                    element.className = "fa fa-star-o";
                }
            }
        }
    }

    public render() {
        const reviewsList = this.state.reviews && this.state.reviews.length > 0 ? this.state.reviews.map(review => {
            return <Review key={review.reviewer.name} photoUrl={review.reviewer.photoUrl} name={review.reviewer.name}
                           description={review.description} rating={review.rating} userID={review.reviewer.userId}/>
        }) : <FormattedMessage id={"review.no.reviews"} defaultMessage="No reviews yet"/>;

        let reviewAverage = 0;
        let reviewNumber = 0;
        if (this.state.reviews) {
            this.state.reviews.forEach(value => {
                reviewAverage += value.rating;
                reviewNumber += 1;
            });
            reviewAverage = reviewAverage / reviewNumber;
        }

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
                                        {reviewNumber ?
                                            <a href={emptyHrefLink}>
                                                {reviewAverage >= 1 ? <i className="fa fa-star star-focus"/> :
                                                    <i className="fa fa-star-o star-focus"/>}
                                                {reviewAverage >= 2 ? <i className="fa fa-star star-focus"/> :
                                                    reviewAverage > 1 && reviewAverage < 2 ?
                                                        <i className="fa fa-star-half-o star-focus"/> :
                                                        <i className="fa fa-star-o star-focus"/>}
                                                {reviewAverage >= 3 ? <i className="fa fa-star star-focus"/> :
                                                    reviewAverage > 2 && reviewAverage < 3 ?
                                                        <i className="fa fa-star-half-o star-focus"/> :
                                                        <i className="fa fa-star-o star-focus"/>}
                                                {reviewAverage >= 4 ? <i className="fa fa-star star-focus"/> :
                                                    reviewAverage > 3 && reviewAverage < 4 ?
                                                        <i className="fa fa-star-half-o star-focus"/> :
                                                        <i className="fa fa-star-o star-focus"/>}
                                                {reviewAverage >= 5 ? <i className="fa fa-star star-focus"/> :
                                                    reviewAverage > 4 && reviewAverage < 5 ?
                                                        <i className="fa fa-star-half-o star-focus"/> :
                                                        <i className="fa fa-star-o star-focus"/>}
                                                <span> {reviewNumber}</span>
                                            </a>
                                            : ''}

                                        <h3>
                                            <FormattedMessage id={"shop.category"} defaultMessage="Category:"/>
                                            {this.state.category}</h3>
                                        <div className="s_product_text">
                                            <div className="card_area">
                                                <a href={computeUrl(this.state.uniqueCode, this.state.mainUrl)}
                                                   target="_blank"
                                                   rel="noopener noreferrer"
                                                   className="main_btn">
                                                    <FormattedMessage id={"shop.access.button"}
                                                                      defaultMessage="Access"/>
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
                                        <p>
                                            <FormattedMessage id={"review.rating.label"} defaultMessage="Your rating:"/>
                                        </p>
                                        <ul className="list">
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-1'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 1)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 1)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 1)}/>
                                                </a>
                                            </li>
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-2'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 2)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 2)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 2)}/>
                                                </a>
                                            </li>
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-3'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 3)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 3)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 3)}/>
                                                </a>
                                            </li>
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-4'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 4)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 4)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 4)}/>
                                                </a>
                                            </li>
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-5'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 5)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 5)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 5)}/>
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="form-group">
                                             <textarea className="form-control"
                                                       value={this.state.description}
                                                       onChange={event => this.setState({description: event.target.value})}
                                                       placeholder={this.props.intl.formatMessage({id: "review.placeholder"})}>
                                             </textarea>
                                        </div>

                                        <div className="col-md-12 text-right">
                                            <a href={emptyHrefLink} onClick={this.updateCurrentReview}
                                               className="btn submit_btn">
                                                <FormattedMessage id={"review.submit.button"}
                                                                  defaultMessage="Submit review"/>
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

export default injectIntl(ShopReview);