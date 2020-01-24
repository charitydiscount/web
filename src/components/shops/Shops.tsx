import * as React from 'react';
import { store } from '../../index';
import {
    NavigationsAction,
    setFavShopsIconFill,
} from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import Categories from './Categories';
import { connect } from 'react-redux';
import {
    setCurrentPage,
    setRatings,
    setShops,
} from '../../redux/actions/ShopsAction';
import GenericInput from '../input/GenericInput';
import { getLocalStorage, setLocalStorage } from '../../helper/StorageHelper';
import { StorageKey } from '../../helper/Constants';
import ReactPaginate from 'react-paginate';
import {
    setCurrentCategory,
    setSelections,
} from '../../redux/actions/CategoriesAction';
import {
    fetchFavoriteShops,
    ShopDto,
    fetchPrograms,
} from '../../rest/ShopsService';
import { fetchReviewRatings, ReviewRating } from '../../rest/ReviewService';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerCss } from '../../helper/AppHelper';
import { injectIntl, IntlShape } from 'react-intl';
import ReactAdBlock from '../../ReactAdBlock';
import ShopListElement from './ShopListElement';
import { fetchConfigInfo } from '../../rest/ConfigService';
import FormControl from '@material-ui/core/FormControl';
import { FormattedMessage } from 'react-intl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel } from '@material-ui/core';

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
    setFavShopsIconFill?: any;

    //parameters favshops redirect
    match: any;
    favShops: string;

    intl: IntlShape;
}

interface IShopsState {
    isLoading: boolean;

    //sort after review
    reviewsSort: string;
}

const pageLimit = 20; // shops per page

class Shops extends React.Component<IShopsProps, IShopsState> {
    constructor(props: IShopsProps) {
        super(props);
        this.state = {
            isLoading: true,
            reviewsSort: '',
        };
        this.onSearchUpdate = this.onSearchUpdate.bind(this);
        this.onSearchUpdateEvent = this.onSearchUpdateEvent.bind(this);
        this.updatePageNumber = this.updatePageNumber.bind(this);
        this.sortAfterReviewsNumber = this.sortAfterReviewsNumber.bind(this);
    }

    async componentDidMount() {
        try {
            await fetchConfigInfo();
        } catch (error) {
            //configs not loaded, important part, refresh app
            window.location.reload();
        }
        try {
            const shopsJson = getLocalStorage(StorageKey.SHOPS);
            let shops: ShopDto[];
            if (shopsJson) {
                shops = JSON.parse(shopsJson);
            } else {
                shops = await fetchPrograms();
                setLocalStorage(StorageKey.SHOPS, JSON.stringify(shops));
            }
            if (shops) {
                this.props.setShops(shops);
                this.setState({
                    isLoading: false,
                });
            }
        } catch (error) {
            //shops not loaded, important part, refresh app
            window.location.reload();
        }
        try {
            const favoriteShops = await fetchFavoriteShops();
            let favShop = this.props.match.params.favShops;
            if (favShop && favShop === 'favShops') {
                if (favoriteShops) {
                    this.props.setShops(favoriteShops);
                }
                this.props.setCurrentCategory('Favorite Shops');
                this.props.setFavShopsIconFill(true);
                this.props.setSelections([]);
            }
        } catch (error) {
            // unexpected error during loading of favorite shops
            // the app can work without them just fine
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

        let searchShop = this.props.match.params.shopName;
        if (searchShop) {
            this.onSearchUpdate(searchShop);
        }

        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
    }

    public onSearchUpdateEvent(event) {
        this.onSearchUpdate(event.target.value);
    }

    public onSearchUpdate(shopName: string) {
        if (!shopName) {
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
                    const data = shops.filter(shop =>
                        shop.name.toLowerCase().includes(shopName.toLowerCase())
                    );
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

    sortAfterReviewsNumber(event) {
        this.setState({
            reviewsSort: event.target.value,
        });
        if (event.target.value) {
            let sortType = event.target.value;
            let shopsFilled = this.props.shops.map(shop => {
                let ratingObj = this.props.ratings.get(shop.uniqueCode);
                let rr = 0;
                let rn = 0;
                if (ratingObj !== undefined) {
                    rr = ratingObj.rating;
                    rn = ratingObj.count;
                }
                shop.reviewsRating = rr;
                shop.totalReviews = rn;

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
                      let rr = 0;
                      let rn = 0;
                      if (ratingObj !== undefined) {
                          rr = ratingObj.rating;
                          rn = ratingObj.count;
                      }
                      shop.reviewsRating = rr;
                      shop.totalReviews = rn;

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
                        let rr = 0;
                        let rn = 0;
                        if (ratingObj !== undefined) {
                            rr = ratingObj.rating;
                            rn = ratingObj.count;
                        }
                        shop.reviewsRating = rr;
                        shop.totalReviews = rn;

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
                <ReactAdBlock />
                <section className="cat_product_area section_gap">
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
                                    <div className="right_page ml-auto">
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
                                <div className="latest_product_inner row">
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

const mapStateToProps = (state: any) => {
    return {
        shops: state.shopReducer.shops,
        ratings: state.shopReducer.ratings,
        currentPage: state.shopReducer.currentPage,
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
            dispatch(setSelections(selections)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Shops));
