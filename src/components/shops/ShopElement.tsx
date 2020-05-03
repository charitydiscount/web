import { emptyHrefLink } from '../../helper/Constants';
import { Link } from 'react-router-dom';
import { Routes } from '../helper/Routes';
import * as React from 'react';
import {
    ShopDto,
    updateFavoriteShops,
    verifyInFavoriteShops,
    fetchFavoriteShops,
} from '../../rest/ShopsService';
import { injectIntl, IntlShape } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { getPromotions, PromotionDTO } from '../../rest/DealsService';
import Promotion from '../promotions/Promotion';
import { Button } from '@material-ui/core';
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";

interface IShopElementProps {
    shop: ShopDto;
    allShops: ShopDto[];
    comingFromShopReview?: boolean;
    onCloseModal?: () => void;
    intl: IntlShape;
}

interface IShopElementState {
    favShop: boolean;
    promotions: PromotionDTO[];
    promotionLoading: boolean;
}

class ShopElement extends React.Component<IShopElementProps,
    IShopElementState> {
    constructor(props: IShopElementProps) {
        super(props);
        this.state = {
            favShop: false,
            promotions: [],
            promotionLoading: true,
        };
        this.updateFavoriteShops = this.updateFavoriteShops.bind(this);
    }

    async componentDidMount() {
        if (verifyInFavoriteShops(this.props.shop.id)) {
            this.setState({
                favShop: true,
            });
        }
        let response = await getPromotions(this.props.shop.id);
        if (response) {
            this.setState({
                promotions: response as PromotionDTO[],
                promotionLoading: false,
            });
        } else {
            this.setState({
                promotionLoading: false,
            });
        }
    }

    /**
     * Used to add/remove favorite shops from DB
     */
    async updateFavoriteShops(remove: boolean) {
        this.setState({
            favShop: !remove,
        });
        try {
            await updateFavoriteShops(this.props.shop, remove).then(async () => {
               await fetchFavoriteShops(this.props.allShops);
            });
        } catch (error) {
            alert(
                this.props.intl.formatMessage({
                    id: 'favorite.shop.failed.to.update',
                })
            );
        }
    }

    public render() {
        let sellingCountries =
            this.props.shop.sellingCountries &&
            this.props.shop.sellingCountries.length > 0 &&
            this.props.shop.sellingCountries
                .map(country => {
                    return country.name;
                })
                .join(', ');

        let promotions =
            this.state.promotions &&
            this.state.promotions.length > 0 &&
            this.state.promotions
                .filter(promotion => {
                    let startDate = new Date(promotion.promotionStart);
                    let endDate = new Date(promotion.promotionEnd);
                    return startDate < new Date() && endDate > new Date();
                })
                .map(promotion => {
                    return (
                        <Promotion
                            key={promotion.id}
                            promotion={promotion}
                            comingFromShopReview={
                                this.props.comingFromShopReview
                            }
                        />
                    );
                });

        const rating = [1, 2, 3, 4, 5].map(star =>
            star <= this.props.shop.reviewsRating ? (
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
                <div className="text-center p-4">
                    {!this.props.comingFromShopReview && (
                        <div style={{textAlign: 'right'}}>
                            <i
                                onClick={this.props.onCloseModal}
                                className="fa fa-times"
                            />
                        </div>
                    )}
                    <h4 className="blue-color">
                        <FormattedMessage
                            id={'shop.cashback'}
                            defaultMessage="Cashback:"
                        />
                        {this.props.shop.uiCommission}
                        <br/>
                        <small className="text-muted text-small">
                            <FormattedMessage
                                id={'shop.cashback.without.vat.and.transport'}
                                defaultMessage="of the value without VAT and transport"
                            />
                        </small>
                    </h4>
                    <h6>
                        {!!this.props.shop.averagePaymentTime ? (
                            <span>
                                <FormattedMessage
                                    id={'average.waiting.time'}
                                    defaultMessage="Average waiting time: "
                                />
                                {this.props.shop.averagePaymentTime}
                                <FormattedMessage
                                    id={'average.waiting.time.days'}
                                    defaultMessage=" days"
                                />
                            </span>
                        ) : (
                            ''
                        )}
                    </h6>
                    <img src={this.props.shop.logoPath} alt="" style={{
                        maxWidth: 300,
                        maxHeight: 300
                    }}/>
                    <div className="blog_details">
                        <h2>{this.props.shop.name}</h2>
                        <h6
                            style={
                                this.props.comingFromShopReview
                                    ? {}
                                    : {maxWidth: 300}
                            }
                        >
                            <FormattedMessage
                                id={'shop.available.in'}
                                defaultMessage="Available in: "
                            />
                            {sellingCountries}
                        </h6>
                        <h5
                            style={
                                this.props.comingFromShopReview
                                    ? {}
                                    : {maxWidth: 300}
                            }
                        >
                            <FormattedMessage
                                id={'shop.category'}
                                defaultMessage="Category:"
                            />
                            {this.props.shop.category && (
                                <FormattedMessage
                                    id={this.props.shop.category.replace(
                                        /\s/g,
                                        ''
                                    )}
                                />
                            )}
                        </h5>
                        <div className="mt-4">
                            {this.props.shop.reviewsRating ? (
                                <Link
                                    to={
                                        Routes.REVIEW + '/' + this.props.shop.id
                                    }
                                >
                                    <p className="mt-4">
                                        {rating}
                                        <span>
                                            {' '}
                                            ({this.props.shop.totalReviews})
                                        </span>
                                    </p>
                                </Link>
                            ) : this.props.comingFromShopReview ? (
                                ''
                            ) : (
                                <Link
                                    to={
                                        Routes.REVIEW + '/' + this.props.shop.id
                                    }
                                >
                                    <Button color="secondary">
                                        <span className="text-lowercase">
                                            {this.props.intl.formatMessage({
                                                id: 'review.tell.us',
                                            })}
                                        </span>
                                    </Button>
                                </Link>
                            )}
                        </div>
                        <div
                            className="s_product_text"
                            style={{marginTop: 20, marginBottom: 20}}
                        >
                            <div className="card_area p_20">
                                <a
                                    href={this.props.shop.computeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="main_btn"
                                >
                                    <FormattedMessage
                                        id={'shop.access.button'}
                                        defaultMessage="Access"
                                    />
                                </a>
                                <div
                                    style={{padding: 0}}
                                    className={'icon_btn p_icon'}
                                >
                                    <a
                                        href={emptyHrefLink}
                                        onClick={() =>
                                            this.updateFavoriteShops(
                                                this.state.favShop
                                            )
                                        }
                                    >
                                        <i
                                            className={
                                                this.state.favShop
                                                    ? 'fa fa-heart'
                                                    : 'fa fa-heart-o'
                                            }
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!this.state.promotionLoading && (
                        <React.Fragment>
                            {promotions && promotions.length > 0 && (
                                <div>
                                    <h3>
                                        <FormattedMessage
                                            id={'shop.promotions'}
                                            defaultMessage={'Promotions'}
                                        />
                                    </h3>
                                    <div
                                        className="table-responsive"
                                        style={
                                            !this.props.comingFromShopReview
                                                ? {
                                                    overflowY: 'auto',
                                                    maxHeight: 200,
                                                }
                                                : {}
                                        }
                                    >
                                        <table
                                            className="table"
                                            style={
                                                !this.props.comingFromShopReview
                                                    ? {
                                                        maxWidth: 300,
                                                    }
                                                    : {}
                                            }
                                        >
                                            <tbody>{promotions}</tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        allShops: state.shops.allShops
    };
};

export default connect(mapStateToProps)(injectIntl(ShopElement));
