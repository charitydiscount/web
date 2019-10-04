import * as React from 'react';
import Modal from 'react-awesome-modal';
import {emptyHrefLink} from '../../helper/Constants';
import {
    isInFavoriteShops,
    updateFavoriteShops,
} from '../../rest/ShopsService';
import {computeUrl} from '../../helper/AppHelper';
import {Link} from "react-router-dom";
import {Routes} from "../helper/Routes";

interface IProductInfoState {
    visible: boolean;
    fShopVisible: boolean;
    favShop: boolean
}

interface IProductProps {
    logoSrc: string;
    name: string;
    id: number;
    category: string;
    mainUrl: string;
    uniqueCode: string;
    reviewRating: number;
}

class Shop extends React.Component<IProductProps, IProductInfoState> {
    constructor(props: IProductProps) {
        super(props);
        this.state = {
            visible: false,
            fShopVisible: false,
            favShop: false,
        };
        this.updateFavoriteShopsTrue = this.updateFavoriteShopsTrue.bind(this);
        this.updateFavoriteShopsFalse = this.updateFavoriteShopsFalse.bind(this);
        isInFavoriteShops(this.props.id, this);
    }

    closeModal() {
        this.setState({
            visible: false
        });
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

    openModal() {
        this.setState({
            visible: true
        });
    }

    /**
     * Used to add favorite shops to DB
     */
    public updateFavoriteShopsTrue() {
        this.closeModal();
        this.openFShopModal();
        this.setState({
            favShop: true
        });
        updateFavoriteShops(this.props.name, false);
    }

    /**
     * Used to remove favorite shops from DB
     */
    public updateFavoriteShopsFalse() {
        this.closeModal();
        this.openFShopModal();
        this.setState({
            favShop: false
        });
        updateFavoriteShops(this.props.name, true);
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
                        Favorite shop: {this.props.name} {this.state.favShop ? 'added' : 'removed'}
                    </h3>
                </Modal>
                <Modal
                    visible={this.state.visible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div className="text-center p_20">
                        <img src={this.props.logoSrc} alt=""/>
                        <div className="blog_details">
                            <a href={emptyHrefLink}>
                                <h2>{this.props.name}</h2>
                            </a>
                            {this.props.reviewRating >= 1 ? <i className="fa fa-star star-focus"></i> :
                                <i className="fa fa-star-o star-focus"></i>}
                            {this.props.reviewRating >= 2 ? <i className="fa fa-star star-focus"></i> :
                                this.props.reviewRating > 1 && this.props.reviewRating < 2 ?
                                    <i className="fa fa-star-half-o star-focus"></i> :
                                    <i className="fa fa-star-o star-focus"></i>}
                            {this.props.reviewRating >= 3 ? <i className="fa fa-star star-focus"></i> :
                                this.props.reviewRating > 2 && this.props.reviewRating < 3 ?
                                    <i className="fa fa-star-half-o star-focus"></i> :
                                    <i className="fa fa-star-o star-focus"></i>}
                            {this.props.reviewRating >= 4 ? <i className="fa fa-star star-focus"></i> :
                                this.props.reviewRating > 3 && this.props.reviewRating < 4 ?
                                    <i className="fa fa-star-half-o star-focus"></i> :
                                    <i className="fa fa-star-o star-focus"></i>}
                            {this.props.reviewRating >= 5 ? <i className="fa fa-star star-focus"></i> :
                                this.props.reviewRating > 4 && this.props.reviewRating < 5 ?
                                    <i className="fa fa-star-half-o star-focus"></i> :
                                    <i className="fa fa-star-o star-focus"></i>}
                            <h3>{'Category: ' + this.props.category}</h3>
                            <div className="s_product_text">
                                <div className="card_area p_20">
                                    <a href={computeUrl(this.props.uniqueCode, this.props.mainUrl)}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="main_btn">
                                        Access
                                    </a>
                                    <div className={"icon_btn p_icon p_05"}>
                                        <Link to={Routes.REVIEW + "/" + this.props.id}>
                                            <i className="lnr lnr-bubble"/>
                                        </Link>
                                    </div>

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
                </Modal>
                <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="f_p_item">
                        <div className="f_p_img">
                            <a href={emptyHrefLink} onClick={() => this.openModal()}>
                                <img
                                    className="img-fluid img-min img"
                                    src={this.props.logoSrc}
                                    alt=""
                                />
                            </a>
                        </div>
                        <a href={emptyHrefLink} onClick={() => this.openModal()}>
                            <h4>{this.props.name}</h4>
                        </a>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Shop;
