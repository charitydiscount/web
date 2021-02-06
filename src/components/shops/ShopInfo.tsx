import * as React from 'react';
import { store } from '../../index';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import { spinnerCss } from '../../helper/AppHelper';
import { emptyHrefLink, StorageKey } from '../../helper/Constants';
import { ShopDto } from '../../rest/ShopsService';
import { fetchReviews, ReviewDto, saveReview } from '../../rest/ReviewService';
import { FormattedMessage } from 'react-intl';
import { injectIntl, IntlShape } from 'react-intl';
import {
    removeLocalStorage,
    setLocalStorage,
} from '../../helper/StorageHelper';
import FadeLoader from 'react-spinners/FadeLoader';
import ShopElement from './ShopElement';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducer/RootReducer';
import { UserInfoDto } from '../login/AuthHelper';
import InfoModal from '../modals/InfoModal';
import { Review } from "./Review";
import { Link } from "react-router-dom";
import {getProductsForProgram, Product} from "../../rest/ProductsService";
import {filterProducts} from "../products/ProductHelper";
import {ProductActions} from "../../redux/actions/ProductsAction";
import {Routes} from "../helper/Routes";

interface IProductReviewState {
    modalVisible: boolean;
    modalMessage: string;

    shop: ShopDto;

    //reviews
    description: string;
    rating: number;
    reviews: Array<ReviewDto>;
    reviewsLoading: boolean;

    //products for program
    productsFromProgram: Product[],
    productsLoading: boolean
}

interface IProductReviewProps {
    match: any;
    intl: IntlShape;

    setBackLink: (backLink:string) => void

    //global state
    userInfo: UserInfoDto
    shops: ShopDto[];
}

class ShopInfo extends React.Component<IProductReviewProps,
    IProductReviewState> {
    constructor(props: IProductReviewProps) {
        super(props);
        this.state = {
            shop:
                props.shops.find(
                    // eslint-disable-next-line
                    (shop) => shop.id == this.props.match.params.id
                ) || ({} as ShopDto),
            description: '',
            modalMessage: '',
            modalVisible: false,
            rating: 0,
            reviews: [],
            reviewsLoading: true,
            productsFromProgram: [],
            productsLoading: true
        };
    }

    escFunction = (event) => {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    };

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.REVIEW));
        document.addEventListener('keydown', this.escFunction, false);
        setLocalStorage(StorageKey.SELECTED_SHOP, this.state.shop.name);
        let reviews = await fetchReviews(this.state.shop.uniqueCode);
        if (reviews) {
            this.setState({
                reviews: reviews,
                reviewsLoading: false,
            });
        } else {
            this.setState({
                reviewsLoading: false,
            });
        }
        try {
            let response = await getProductsForProgram(this.state.shop.name);
            if (response) {
                this.setState({
                    productsFromProgram: response,
                    productsLoading: false
                });
                this.props.setBackLink(Routes.SHOP_INFO + '/' + this.state.shop.id);
            } else {
                this.setState({
                    productsLoading: false
                })
            }
        } catch (e) {
            //products for program not loaded
            this.setState({
                productsLoading: false
            })
        }
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.REVIEW));
    }

    closeModal = () => {
        this.setState({
            modalVisible: false,
        });
    };

    openModal = () => {
        this.setState({
            modalVisible: true,
        });
    };

    updateCurrentReview = async () => {
        if (this.state.rating > 0) {
            try {
                await saveReview(
                    this.state.shop.uniqueCode,
                    this.state.rating,
                    this.state.description,
                    {
                        userId: this.props.userInfo.uid,
                        name:
                            this.props.userInfo.displayName || this.props.userInfo.email || '-',
                        photoUrl: this.props.userInfo.photoURL
                    }
                );
                removeLocalStorage(StorageKey.REVIEWS_RATINGS);
                removeLocalStorage(StorageKey.SHOPS);
                this.handleShowModalMessage(
                    this.props.intl.formatMessage({
                        id: 'review.update.message',
                    }),
                    null
                );
                let reviews = await fetchReviews(this.state.shop.uniqueCode);
                if (reviews) {
                    this.setState({
                        reviews: reviews,
                    });
                }
            } catch (error) {
                this.handleShowModalMessage(
                    this.props.intl.formatMessage({
                        id: 'review.failed.to.update.error.message',
                    }),
                    null
                );
            }
        } else {
            this.handleShowModalMessage(
                this.props.intl.formatMessage({id: 'review.error.message'}),
                null
            );
        }
    };

    handleShowModalMessage = (message, favShop) => {
        if (favShop !== null) {
            this.setState({
                modalMessage: message,
            });
        } else {
            this.setState({
                modalMessage: message,
            });
        }
        this.openModal();
    };

    handleStarClicked = (event, starLevel: number) => {
        this.setState({
            rating: starLevel,
        });
    };

    handleStarFocusEnter = (event, starLevel) => {
        for (let i = 1; i <= starLevel; i++) {
            const element = document.getElementById('star-' + i);
            if (element) {
                if (this.state.rating === 0 || this.state.rating < i) {
                    element.className = 'fa fa-star star-focus fa-lg';
                }
            }
        }
    };

    handleStarFocusRemove = (event, starLevel) => {
        for (let i = 1; i <= starLevel; i++) {
            let element = document.getElementById('star-' + i);
            if (element) {
                if (this.state.rating === 0 || this.state.rating < i) {
                    element.className = 'fa fa-star-o fa-lg';
                }
            }
        }
    };

    public render() {
        const reviewsList =
            this.state.reviews && this.state.reviews.length > 0 ? (
                this.state.reviews.map((review, position) => {
                    return (
                        <Review key={"key" + position} review={review}/>
                    );
                })
            ) : (
                <div className="text-muted">
                    <FormattedMessage
                        id={'review.no.reviews'}
                        defaultMessage="No reviews yet"
                    />
                </div>
            );

        const rating = [1, 2, 3, 4, 5].map((star) => (
            <li key={`star-${star}`}>
                <a href={emptyHrefLink}>
                    {star < this.state.rating ? (
                        <i
                            id={`star-${star}`}
                            className="fa fa-star fa-lg"
                            onClick={() => this.handleStarClicked(this, star)}
                            onMouseEnter={() =>
                                this.handleStarFocusEnter(this, star)
                            }
                            onMouseLeave={() =>
                                this.handleStarFocusRemove(this, star)
                            }
                        />
                    ) : (
                        <i
                            id={`star-${star}`}
                            className="fa fa-star-o fa-lg"
                            onClick={() => this.handleStarClicked(this, star)}
                            onMouseEnter={() =>
                                this.handleStarFocusEnter(this, star)
                            }
                            onMouseLeave={() =>
                                this.handleStarFocusRemove(this, star)
                            }
                        />
                    )}
                </a>
            </li>
        ));

        let productsList;
        if (this.state.productsFromProgram && this.state.productsFromProgram.length > 0) {
            productsList = filterProducts(this.state.productsFromProgram, this.props.shops, true);
        }

        return (
            <React.Fragment>
                <InfoModal
                    visible={this.state.modalVisible}
                    message={this.state.modalMessage}
                    onClose={() => this.closeModal()}
                />
                <section className={'product_description_area'}>
                    <div className={'container'}>
                        <div className="row" style={{marginTop: 70}}>
                            <div className="col-lg-1" style={{maxWidth: 1}}>
                                <Link to={"/shops"} className="increase_clickable_area">
                                    <i className="fa fa-arrow-left" style={{marginTop: 30, fontSize: 30, color: "red"}}/>
                                </Link>
                            </div>
                            <div className="col-lg-6">
                                <ShopElement
                                    key={this.state.shop.name}
                                    shop={this.state.shop}
                                    comingFromShopInfo={true}
                                />
                                <FadeLoader
                                    loading={this.state.productsLoading}
                                    color={'#e31f29'}
                                    css={spinnerCss}
                                />
                                {!this.state.productsLoading &&
                                <React.Fragment>
                                    <div className="text-center" style={{padding: "30px 30px 0px 30px"}}>
                                        <h3>
                                            <FormattedMessage
                                                id={'shop.info.products'}
                                                defaultMessage="Produse"
                                            />
                                        </h3>
                                    </div>
                                    <div
                                        className="latest_product_inner row d-flex align-items-stretch shops-container shade-container">
                                        {productsList && productsList.length > 0 ?
                                            productsList :
                                            <div>
                                                <FormattedMessage
                                                    id={'shop.info.products.empty'}
                                                    defaultMessage="Nu avem date..."
                                                />
                                            </div>
                                        }
                                    </div>
                                </React.Fragment>
                                }
                            </div>
                            <div className="col-lg-5">
                                <div
                                    className="tab-pane fade show active p_20"
                                    id="review"
                                >
                                    <div className="review_box">
                                        <p>
                                            <FormattedMessage
                                                id={'review.rating.label'}
                                                defaultMessage="Your rating:"
                                            />
                                        </p>
                                        <ul className="list">{rating}</ul>
                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                value={this.state.description}
                                                onChange={(event) =>
                                                    this.setState({
                                                        description:
                                                        event.target.value,
                                                    })
                                                }
                                                placeholder={this.props.intl.formatMessage(
                                                    {id: 'review.placeholder'}
                                                )}
                                            ></textarea>
                                        </div>

                                        <div className="col-md-12 text-right">
                                            <a
                                                href={emptyHrefLink}
                                                onClick={() =>
                                                    this.updateCurrentReview()
                                                }
                                                className="btn submit_btn"
                                            >
                                                <FormattedMessage
                                                    id={'review.submit.button'}
                                                    defaultMessage="Submit review"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="review_list p_20">
                                        <FadeLoader
                                            loading={this.state.reviewsLoading}
                                            color={'#e31f29'}
                                            css={spinnerCss}
                                        />
                                        {!this.state.reviewsLoading &&
                                        reviewsList}
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

const mapStateToProps = (state: AppState) => {
    return {
        shops: state.shops.allShops,
        userInfo: state.user.userInfo
    };
};

const
    mapDispatchToProps = (dispatch: any) => {
        return {
            setBackLink: (backLink: string) =>
                dispatch(ProductActions.setBackLink(backLink))
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ShopInfo));
