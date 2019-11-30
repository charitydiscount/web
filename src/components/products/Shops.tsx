import * as React from "react";
import {store} from "../../index";
import {NavigationsAction, setFavShopsIconFill} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Categories from "./Categories";
import {connect} from "react-redux";
import {setCurrentPage, setRatings, setShops} from "../../redux/actions/ShopsAction";
import GenericInput from "../input/GenericInput";
import {getLocalStorage} from "../../helper/StorageHelper";
import {StorageKey} from "../../helper/Constants";
import ReactPaginate from 'react-paginate';
import {setCurrentCategory, setSelections} from "../../redux/actions/CategoriesAction";
import {fetchFavoriteShops, fetchShops, ShopDto} from "../../rest/ShopsService";
import {fetchReviewRatings, ReviewRating} from "../../rest/ReviewService";
import FadeLoader from 'react-spinners/FadeLoader';
import {spinnerCss} from "../../helper/AppHelper";
import {InjectedIntlProps, injectIntl} from "react-intl";
import ReactAdBlock from "../../ReactAdBlock";
import ShopListElement from "./ShopListElement";
import {fetchConfigInfo} from "../../rest/ConfigService";

interface IShopsProps {
    shops: Array<ShopDto>,
    ratings: Map<String, ReviewRating>,
    currentPage: number

    // global state
    setShops: any,
    resetShops: any,
    setCurrentPage: any,
    setRatings: any,

    //used to refresh categories
    setCurrentCategory: any,
    setSelections: any,
    setFavShopsIconFill?: any;

    //parameters favshops redirect
    match: any,
    favShops: string
}

interface IShopsState {
    isLoading: boolean
}

const pageLimit = 20; // products per page

class Shops extends React.Component<IShopsProps & InjectedIntlProps, IShopsState> {

    constructor(props: IShopsProps & InjectedIntlProps) {
        super(props);
        this.state = {
            isLoading: true
        };
        this.onSearchUpdate = this.onSearchUpdate.bind(this);
        this.updatePageNumber = this.updatePageNumber.bind(this);
    }

    async componentDidMount() {
        try {
            await fetchConfigInfo();
        } catch (error) {
            //configs not loaded, important part, refresh app
            window.location.reload();
        }
        try {
            let response = await fetchShops();
            if (response) {
                this.props.setShops(response as ShopDto[]);
                this.setState(
                    {
                        isLoading: false
                    });
            }
        } catch (error) {
            //shops not loaded, important part, refresh app
            window.location.reload();
        }
        try {
            await fetchFavoriteShops();
        } catch (error) {
            //favorite shops not loaded
        }

        let favShop = this.props.match.params.favShops;
        if (favShop && favShop === "favShops") {
            const favoriteShops = getLocalStorage(StorageKey.FAVORITE_SHOPS);
            if (favoriteShops) {
                this.props.setShops(JSON.parse(favoriteShops));
            }
            this.props.setCurrentCategory('Favorite Shops');
            this.props.setFavShopsIconFill(true);
            this.props.setSelections([]);
        }

        try {
            let response = await fetchReviewRatings();
            if (response) {
                this.props.setRatings(new Map(Object.entries(response as Map<String, ReviewRating>)));
            }
        } catch (error) {
            //ratings not loaded
        }
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
    }


    public onSearchUpdate(event) {
        if (!event.target.value) {
            const shops = getLocalStorage(StorageKey.SHOPS);
            if (shops) {
                this.props.setShops(JSON.parse(shops));
                this.props.setSelections([]);
                this.props.setCurrentCategory(String(''));
                this.props.setFavShopsIconFill(false);
                this.props.setCurrentPage(0);
                this.setState({
                    isLoading: false,
                });
            }
        } else {
            const storage = getLocalStorage(StorageKey.SHOPS);
            if (storage) {
                const shops = JSON.parse(storage) as Array<ShopDto>;
                if (shops) {
                    const data = shops.filter(shop => shop.name.toLowerCase().includes(event.target.value.toLowerCase()));
                    if (data) {
                        this.props.setShops(data);
                        this.props.setSelections([]);
                        this.props.setCurrentCategory(String(''));
                        this.props.setFavShopsIconFill(false);
                        this.props.setCurrentPage(0);
                        this.setState({
                            isLoading: false,
                        });
                    }
                }
            }
        }
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CATEGORIES));
    }

    public updatePageNumber(data) {
        this.props.setCurrentPage(data.selected);
    }

    public render() {
        let shopsList = this.props.shops && this.props.ratings &&
        this.props.shops.length > 0 && this.props.ratings.size > 0 ? this.props.shops.map(shop => {
            let ratingObj = this.props.ratings.get(shop.uniqueCode);
            let rr = 0;
            let rn = 0;
            if (ratingObj !== undefined) {
                rr = ratingObj.rating;
                rn = ratingObj.count;
            }
            shop.reviewsRating = rr;
            shop.totalReviews = rn;

            return <ShopListElement key={"list" + shop.name} shop={shop}/>
        }) : null;

        let pageCount = 0;
        if (this.props.shops && this.props.ratings && this.props.shops.length > 0 && this.props.ratings.size > 0) {
            if (this.props.shops.length > pageLimit) {
                pageCount = this.props.shops.length / pageLimit;
                let offset = this.props.currentPage;
                shopsList = this.props.shops.slice(offset * pageLimit, (offset + 1) * pageLimit).map(shop => {
                    let ratingObj = this.props.ratings.get(shop.uniqueCode);
                    let rr = 0;
                    let rn = 0;
                    if (ratingObj !== undefined) {
                        rr = ratingObj.rating;
                        rn = ratingObj.count;
                    }
                    shop.reviewsRating = rr;
                    shop.totalReviews = rn;

                    return <ShopListElement key={"list" + shop.name} shop={shop}/>
                });
            } else {
                pageCount = 1;
            }
        }

        return (
            <React.Fragment>
                <ReactAdBlock/>
                <section className="cat_product_area section_gap">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="left_sidebar_area">
                                    <Categories/>
                                </div>
                            </div>

                            <div className="col-lg-9">
                                <div className="product_top_bar">
                                    <GenericInput type={"textfield"} id={"search"} className={"single-input"}
                                                  placeholder={this.props.intl.formatMessage({id: "shops.search"})}
                                                  onKeyUp={this.onSearchUpdate}/>
                                    <div className="right_page ml-auto">
                                        <nav className="cat_page" aria-label="Page navigation example">
                                            <ReactPaginate
                                                previousLabel={'<'}
                                                previousLinkClassName={'page-link'}
                                                nextLabel={'>'}
                                                nextLinkClassName={'page-link'}
                                                breakLabel={'...'}
                                                breakClassName={'blank'}
                                                breakLinkClassName={'page-link'}
                                                pageCount={pageCount}
                                                marginPagesDisplayed={1}
                                                pageRangeDisplayed={2}
                                                forcePage={this.props.currentPage}
                                                onPageChange={this.updatePageNumber}
                                                containerClassName={'pagination'}
                                                pageClassName={'page-item'}
                                                pageLinkClassName={'page-link'}
                                                activeClassName={'active'}
                                            />
                                        </nav>
                                    </div>
                                </div>
                                <FadeLoader
                                    loading={this.state.isLoading}
                                    color={'#1641ff'}
                                    css={spinnerCss}
                                />
                                <div className="latest_product_inner row">
                                    {
                                        !this.state.isLoading &&
                                        <React.Fragment>
                                            {shopsList}
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <nav style={{marginTop: 30}} className="cat_page mx-auto"
                                 aria-label="Page navigation example">
                                <div className="right_page ml-auto">
                                    <nav className="cat_page" aria-label="Page navigation example">
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            previousLinkClassName={'page-link'}
                                            nextLabel={'>'}
                                            nextLinkClassName={'page-link'}
                                            breakLabel={'...'}
                                            breakClassName={'blank'}
                                            breakLinkClassName={'page-link'}
                                            pageCount={pageCount}
                                            marginPagesDisplayed={1}
                                            pageRangeDisplayed={2}
                                            forcePage={this.props.currentPage}
                                            onPageChange={this.updatePageNumber}
                                            containerClassName={'pagination'}
                                            pageClassName={'page-item'}
                                            pageLinkClassName={'page-link'}
                                            activeClassName={'active'}
                                        />
                                    </nav>
                                </div>
                            </nav>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        shops: state.shopReducer.shops,
        ratings: state.shopReducer.ratings,
        currentPage: state.shopReducer.currentPage
    };
};


const mapDispatchToProps = (dispatch: any) => {
    return {
        setShops: (shopWrapper: Array<ShopDto>) =>
            dispatch(setShops(shopWrapper)),
        setRatings: (ratings: Map<String, ReviewRating>) =>
            dispatch(setRatings(ratings)),
        setCurrentPage: (currentPage: number) =>
            dispatch(setCurrentPage(currentPage)),
        setFavShopsIconFill: (favShopsIconFill: boolean) =>
            dispatch(setFavShopsIconFill(favShopsIconFill)),
        setCurrentCategory: (currentCategory: String) =>
            dispatch(setCurrentCategory(currentCategory)),
        setSelections: (selections: boolean[]) =>
            dispatch(setSelections(selections))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Shops));


