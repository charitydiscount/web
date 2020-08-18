import * as React from 'react';
import { store } from '../../index';
import {
    NavigationsAction,
} from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import Categories from './categories/Categories';
import { connect } from 'react-redux';
import {
    setCurrentPage,
    setRatings,
    setShops,
} from '../../redux/actions/ShopsAction';
import GenericInput from '../input/GenericInput';
import ReactPaginate from 'react-paginate';
import {
    setCurrentCategory,
    setSelections,
} from '../../redux/actions/CategoriesAction';
import { fetchFavoriteShops, ShopDto } from '../../rest/ShopsService';
import { fetchReviewRatings, ReviewRating } from '../../rest/ReviewService';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerCss } from '../../helper/AppHelper';
import { injectIntl, IntlShape } from 'react-intl';
import ShopListElement from './ShopListElement';
import { fetchConfigInfo } from '../../rest/ConfigService';
import FormControl from '@material-ui/core/FormControl';
import { FormattedMessage } from 'react-intl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel } from '@material-ui/core';
import { AppState } from '../../redux/reducer/RootReducer';
import UpperCategories from "./categories/UpperCategories";
import { getLocalStorage, removeLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";
import ShopModalElement from "./ShopModalElement";

interface IShopsProps {
    shops: Array<ShopDto>;
    ratings: Map<String, ReviewRating>;
    currentPage: number;

    // global state
    setShops: any;
    setCurrentPage: any;
    setRatings: any;

    //used to refresh categories
    setCurrentCategory: any;
    setSelections: any;

    //parameters favshops redirect
    match: any;
    favShops: string;

    intl: IntlShape;
    allShops: ShopDto[];
}

interface IShopsState {
    isLoading: boolean;

    //sort after review
    reviewsSort: string;

    currentShopModal?: ShopDto,
    currentShopModalVisible:boolean
}

const pageLimit = 20; // shops per page

class Shops extends React.Component<IShopsProps, IShopsState> {
    constructor(props: IShopsProps) {
        super(props);
        this.state = {
            isLoading: true,
            reviewsSort: '',
            currentShopModalVisible: false,
        };
        this.onSearchUpdate = this.onSearchUpdate.bind(this);
        this.onSearchUpdateEvent = this.onSearchUpdateEvent.bind(this);
        this.updatePageNumber = this.updatePageNumber.bind(this);
        this.sortAfterReviewsNumber = this.sortAfterReviewsNumber.bind(this);
        this.findShopAndOpen = this.findShopAndOpen.bind(this);
        this.closeCurrentShopModal = this.closeCurrentShopModal.bind(this);
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));

        try {
            await fetchConfigInfo();
        } catch (error) {
            //configs not loaded, important part, refresh app
            window.location.reload();
        }

        this.props.setShops(this.props.allShops);

        try {
            const favoriteShops = await fetchFavoriteShops(this.props.allShops);
            let favShop = this.props.match.params.favShops;
            if (favShop && favShop === 'favShops') {
                if (favoriteShops) {
                    this.props.setShops(favoriteShops);
                }
                this.props.setCurrentCategory('Favorite Shops');
                this.props.setSelections([]);
            }
        } catch (error) {
            // unexpected error during loading of favorite shops
        }

        try {
            let response = await fetchReviewRatings();
            if (response) {
                this.props.setRatings(
                    new Map(
                        Object.entries(response as Map<String, ReviewRating>)
                    )
                );
            }
        } catch (error) {
            //ratings not loaded
        }

        //open shop modal ----------------------------------------------------------------------------------------------
        let shopToShow = this.props.match.params.shopName;
        let shopFromStorage = getLocalStorage(StorageKey.SELECTED_SHOP);
        if (shopFromStorage) {
            shopToShow = shopFromStorage;
            removeLocalStorage(StorageKey.SELECTED_SHOP);
        }
        if (shopToShow) {
            this.findShopAndOpen(shopToShow);
        }
        //--------------------------------------------------------------------------------------------------------------


        this.setState({
            isLoading: false,
        });
    }

    public onSearchUpdateEvent(event) {
        this.onSearchUpdate(event.target.value);
    }

    public onSearchUpdate(shopName: string) {
        if (!shopName) {
            this.props.setShops(this.props.allShops);
            this.props.setSelections([]);
            this.props.setCurrentCategory(String(''));
            this.props.setCurrentPage(0);
            this.setState({
                isLoading: false,
            });
        } else {
            const data = this.props.allShops.filter(shop =>
                shop.name.toLowerCase().includes(shopName.toLowerCase())
            );
            if (data) {
                this.props.setShops(data);
                this.props.setSelections([]);
                this.props.setCurrentCategory(String(''));
                this.props.setCurrentPage(0);
                this.setState({
                    isLoading: false,
                });
            }
        }
    }

    findShopAndOpen(shopName: string) {
        const shopFound = this.props.allShops.find(shop =>
            shop.name.toLowerCase().includes(shopName.toLowerCase())
        );
        if (shopFound) {
            this.setState({
                currentShopModal: shopFound,
                currentShopModalVisible: true
            });
        }
    }

    closeCurrentShopModal() {
        this.setState({
            currentShopModalVisible: false
        })
    }

    sortAfterReviewsNumber(event) {
        this.setState({
            reviewsSort: event.target.value,
        });
        if (event.target.value) {
            let sortType = event.target.value;
            let shopsFilled = this.props.shops.map(shop => {
                let ratingObj = this.props.ratings.get(shop.uniqueCode);
                shop.reviewsRating = !!ratingObj ? ratingObj.rating : 0;
                shop.totalReviews = !!ratingObj ? ratingObj.count : 0;

                return shop;
            });

            if (sortType === 'ascReview' || sortType === 'descReview') {
                shopsFilled.sort(function(x, y) {
                    let a = x.totalReviews,
                        b = y.totalReviews;
                    if (sortType === 'ascReview') {
                        if (a > b) return 1;
                        if (a < b) return -1;
                    } else {
                        if (a > b) return -1;
                        if (a < b) return 1;
                    }
                    return 0;
                });
            } else if (
                sortType === 'ascCommission' ||
                sortType === 'descCommission'
            ) {
                shopsFilled.sort(function(x, y) {
                    let a = parseFloat(x.commission),
                        b = parseFloat(y.commission);
                    if (sortType === 'ascCommission') {
                        if (a > b) return 1;
                        if (a < b) return -1;
                    } else {
                        if (a > b) return -1;
                        if (a < b) return 1;
                    }
                    return 0;
                });
            } else if (sortType === 'ascAtoZ' || sortType === 'descAtoZ') {
                shopsFilled.sort(function(x, y) {
                    let a = x.name.toLowerCase(),
                        b = y.name.toLowerCase();
                    if (sortType === 'ascAtoZ') {
                        if (a > b) return 1;
                        if (a < b) return -1;
                    } else {
                        if (a > b) return -1;
                        if (a < b) return 1;
                    }
                    return 0;
                });
            }

            this.props.setShops(shopsFilled);
        }
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CATEGORIES));
    }

    public updatePageNumber(data) {
        if (window.innerWidth > 800) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 1100);
        }
        this.props.setCurrentPage(data.selected);
    }

    public render() {
        let shopsList =
            this.props.shops &&
            this.props.ratings &&
            this.props.shops.length > 0 &&
            this.props.ratings.size > 0
                ? this.props.shops.map(shop => {
                      let ratingObj = this.props.ratings.get(shop.uniqueCode);
                      shop.reviewsRating = !!ratingObj ? ratingObj.rating : 0;
                      shop.totalReviews = !!ratingObj ? ratingObj.count : 0;

                      return (
                          <ShopListElement
                              key={'list' + shop.name}
                              shop={shop}
                          />
                      );
                  })
                : null;

        let pageCount = 0;
        if (
            this.props.shops &&
            this.props.ratings &&
            this.props.shops.length > 0 &&
            this.props.ratings.size > 0
        ) {
            if (this.props.shops.length > pageLimit) {
                pageCount = this.props.shops.length / pageLimit;
                let offset = this.props.currentPage;
                shopsList = this.props.shops
                    .slice(offset * pageLimit, (offset + 1) * pageLimit)
                    .map(shop => {
                        let ratingObj = this.props.ratings.get(shop.uniqueCode);
                        shop.reviewsRating = !!ratingObj ? ratingObj.rating : 0;
                        shop.totalReviews = !!ratingObj ? ratingObj.count : 0;

                        return (
                            <ShopListElement
                                key={'list' + shop.name}
                                shop={shop}
                            />
                        );
                    });
            } else {
                pageCount = 1;
            }
        }

        return (
            <React.Fragment>
                {this.state.currentShopModal &&
                    <ShopModalElement shop={this.state.currentShopModal}
                                  modalVisible={this.state.currentShopModalVisible}
                                  onCloseModal={this.closeCurrentShopModal}/>}
                <UpperCategories/>
                <section className="cat_product_area">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="left_sidebar_area">
                                    <Categories />
                                </div>
                            </div>

                            <div className="col-lg-9">
                                <div className="product_top_bar">
                                    <GenericInput
                                        type={'textfield'}
                                        id={'search'}
                                        className={'single-input'}
                                        placeholder={this.props.intl.formatMessage(
                                            { id: 'shops.search' }
                                        )}
                                        onKeyUp={this.onSearchUpdateEvent}
                                    />
                                </div>
                                <div className="product_top_bar">
                                    <div className="col-lg-3">
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                <FormattedMessage
                                                    id={'sort.key'}
                                                    defaultMessage="Sort"
                                                />
                                            </InputLabel>
                                            <Select
                                                MenuProps={{
                                                    disableScrollLock: true,
                                                    getContentAnchorEl: null,
                                                    anchorOrigin: {
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    },
                                                }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={this.state.reviewsSort}
                                                onChange={
                                                    this.sortAfterReviewsNumber
                                                }
                                            >
                                                <MenuItem value="">
                                                    <FormattedMessage
                                                        id={'none.key'}
                                                        defaultMessage="None"
                                                    />
                                                </MenuItem>
                                                <MenuItem value={'ascAtoZ'}>
                                                    <FormattedMessage
                                                        id={
                                                            'shops.filters.sorting.atoz.asc'
                                                        }
                                                        defaultMessage="Sort after name ascending"
                                                    />
                                                </MenuItem>
                                                <MenuItem value={'descAtoZ'}>
                                                    <FormattedMessage
                                                        id={
                                                            'shops.filters.sorting.atoz.desc'
                                                        }
                                                        defaultMessage="Sort after name descending"
                                                    />
                                                </MenuItem>
                                                <MenuItem
                                                    value={'ascCommission'}
                                                >
                                                    <FormattedMessage
                                                        id={
                                                            'shops.filters.sorting.commission.ascending'
                                                        }
                                                        defaultMessage="Sort after commissions ascending"
                                                    />
                                                </MenuItem>
                                                <MenuItem
                                                    value={'descCommission'}
                                                >
                                                    <FormattedMessage
                                                        id={
                                                            'shops.filters.sorting.commission.descending'
                                                        }
                                                        defaultMessage="Sort after commissions descending"
                                                    />
                                                </MenuItem>
                                                <MenuItem value={'ascReview'}>
                                                    <FormattedMessage
                                                        id={
                                                            'shops.filters.sorting.ascending'
                                                        }
                                                        defaultMessage="Sort after review numbers ascending"
                                                    />
                                                </MenuItem>
                                                <MenuItem value={'descReview'}>
                                                    <FormattedMessage
                                                        id={
                                                            'shops.filters.sorting.descending'
                                                        }
                                                        defaultMessage="Sort after review numbers descending"
                                                    />
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="right_page ml-auto d-none d-md-block">
                                        <nav
                                            className="cat_page"
                                            aria-label="Page navigation example"
                                        >
                                            <ReactPaginate
                                                previousLabel={'<'}
                                                previousLinkClassName={
                                                    'page-link'
                                                }
                                                nextLabel={'>'}
                                                nextLinkClassName={'page-link'}
                                                breakLabel={'...'}
                                                breakClassName={'blank'}
                                                breakLinkClassName={'page-link'}
                                                pageCount={pageCount}
                                                marginPagesDisplayed={1}
                                                pageRangeDisplayed={2}
                                                forcePage={
                                                    this.props.currentPage
                                                }
                                                onPageChange={
                                                    this.updatePageNumber
                                                }
                                                containerClassName={
                                                    'pagination'
                                                }
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
                                <div className="latest_product_inner row d-flex align-items-stretch">
                                    {!this.state.isLoading && (
                                        <React.Fragment>
                                            {shopsList}
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <nav
                                style={{ marginTop: 30 }}
                                className="cat_page mx-auto"
                                aria-label="Page navigation example"
                            >
                                <div className="right_page ml-auto">
                                    <nav
                                        className="cat_page"
                                        aria-label="Page navigation example"
                                    >
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
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        shops: state.shops.shops,
        allShops: state.shops.allShops,
        ratings: state.shops.ratings,
        currentPage: state.shops.currentPage,
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
        setCurrentCategory: (currentCategory: String) =>
            dispatch(setCurrentCategory(currentCategory)),
        setSelections: (selections: boolean[]) =>
            dispatch(setSelections(selections))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Shops));
