import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {computeUrl} from "../../helper/AppHelper";
import {emptyHrefLink} from "../../helper/Constants";
import Modal from 'react-awesome-modal';
import {getShopById, ShopDto, updateFavoriteShops} from "../../rest/ShopsService";
import Review from "./Review";

interface IProductReviewStateProps {
    fShopVisible: boolean;
    favShop: boolean;
    logoSrc: string;
    name: string;
    id: number;
    category: string;
    mainUrl: string;
    uniqueCode: string;
}

interface IProductReviewProps {
    match: any
}

class ShopReview extends React.Component<IProductReviewProps, IProductReviewStateProps> {

    constructor(props: IProductReviewProps) {
        super(props);
        this.state = {
            fShopVisible: false,
            favShop: false,
            logoSrc: '',
            name: '',
            id: 0,
            category: '',
            mainUrl: '',
            uniqueCode: ''
        };
        this.updateFavoriteShopsTrue = this.updateFavoriteShopsTrue.bind(this);
        this.updateFavoriteShopsFalse = this.updateFavoriteShopsFalse.bind(this);
    }


    /**
     * Used to add favorite shops to DB
     */
    public updateFavoriteShopsTrue() {
        this.openFShopModal();
        this.setState({
            favShop: true
        });
        updateFavoriteShops(this.state.name, false);
    }

    /**
     * Used to remove favorite shops from DB
     */
    public updateFavoriteShopsFalse() {
        this.openFShopModal();
        this.setState({
            favShop: false
        });
        updateFavoriteShops(this.state.name, true);
    }


    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.REVIEW));
        const shop = getShopById(this.props.match.params.id) as ShopDto;
        this.setState({
                fShopVisible: false,
                favShop: false,
                logoSrc: shop.logoPath,
                name: shop.name,
                id: shop.id,
                category: shop.category,
                mainUrl: shop.mainUrl,
                uniqueCode: shop.uniqueCode
            }
        );
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.REVIEW));
    }

    closeFShopModal() {
        this.setState({
            fShopVisible: false
        });
    }

    openFShopModal() {
        this.setState({
            fShopVisible: true
        });
    }


    public render() {
        return (
            <React.Fragment>
                <Modal
                    visible={this.state.fShopVisible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeFShopModal()}
                >
                    <h3 style={{padding: 15}}>
                        Favorite shop: {this.state.name} {this.state.favShop ? 'added' : 'removed'}
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
                                                    }
                                                    >
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
                                        <p>Outstanding</p>

                                        <div className="form-group">
                                             <textarea className="form-control" name="message" id="message"
                                                       placeholder="Review"/>
                                        </div>

                                        <div className="col-md-12 text-right">
                                            <button type="submit" value="submit"
                                                    className="btn submit_btn">Submit Now
                                            </button>
                                        </div>
                                    </div>
                                    <div className="review_list p_20">
                                        <Review/>
                                        <Review/>
                                        <Review/>
                                        <Review/>
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