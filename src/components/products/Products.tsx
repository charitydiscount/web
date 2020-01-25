import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { store } from '../../index';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import { fetchConfigInfo } from '../../rest/ConfigService';
import ReactPaginate from 'react-paginate';
import { roundCommission, spinnerCss } from '../../helper/AppHelper';
import GenericInput from '../input/GenericInput';
import { FadeLoader } from 'react-spinners';
import {
    getFeaturedProducts,
    ProductDTO,
    ProductResult,
    searchProduct,
} from '../../rest/ProductsService';
import ProductListElement from './ProductListElement';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FormattedMessage } from 'react-intl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducer/RootReducer';
import { ShopDto } from '../../rest/ShopsService';

interface ProductsProps {
    intl: IntlShape;
    shops: ShopDto[];
}

interface ProductsState {
    isLoading: boolean;
    searchActive: boolean;
    products: Array<ProductDTO>;
    currentPage: number;
    total: number;
}

const pageLimit = 50; // products per page

class Products extends React.Component<ProductsProps, ProductsState> {
    private searchTerm: string = '';
    private minPrice: string = '';
    private maxPrice: string = '';
    private sort: string = '';

    private oldSearchTerm: string = '';
    private oldMinPrice: string = '';
    private oldMaxPrice: string = '';
    private oldSort: string = '';

    constructor(props: ProductsProps) {
        super(props);
        this.state = {
            isLoading: false,
            searchActive: false,
            products: {} as Array<ProductDTO>,
            currentPage: 0,
            total: 50,
        };
        this.startSearch = this.startSearch.bind(this);
        this.searchProducts = this.searchProducts.bind(this);
        this.updatePageNumber = this.updatePageNumber.bind(this);
        this.searchFunction = this.searchFunction.bind(this);
    }

    updatePageNumber(data) {
        if (window.innerWidth > 800) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 400);
        }
        this.setState({
            currentPage: data.selected as number,
        });
        this.searchProducts(
            data.selected,
            this.searchTerm,
            this.minPrice,
            this.maxPrice,
            this.sort
        );
    }

    async componentDidMount() {
        document.addEventListener('keydown', this.searchFunction, false);
        this.setState({
            isLoading: true,
        });
        try {
            await fetchConfigInfo();
        } catch (error) {
            //configs not loaded, important part, refresh app
            window.location.reload();
        }

        try {
            let response = await getFeaturedProducts();
            if (response) {
                this.setState({
                    products: response as Array<ProductDTO>,
                    isLoading: false,
                });
            } else {
                this.setState({
                    isLoading: false,
                });
            }
        } catch (error) {
            this.setState({
                isLoading: false,
            });
            //feature product not loaded, site will keep working
        }

        store.dispatch(NavigationsAction.setStageAction(Stages.PRODUCTS));
    }

    componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.PRODUCTS));
    }

    async searchProducts(pageNumber, title, minPrice, maxPrice, sort) {
        this.oldMaxPrice = maxPrice;
        this.oldMinPrice = minPrice;
        this.oldSort = sort;
        this.oldSearchTerm = title;
        this.setState({
            isLoading: true,
        });
        if (this.searchTerm && this.searchTerm.length > 0) {
            try {
                let response = (await searchProduct(
                    title,
                    minPrice ? minPrice : '0',
                    maxPrice ? maxPrice : '0',
                    sort,
                    pageNumber
                )) as ProductResult;
                if (response) {
                    this.setState({
                        products: response.products,
                        total: response.total,
                        isLoading: false,
                    });
                }
            } catch (e) {
                this.setState({
                    isLoading: false,
                });
            }
        } else {
            try {
                let response = await getFeaturedProducts();
                if (response) {
                    this.setState({
                        products: response as Array<ProductDTO>,
                        isLoading: false,
                    });
                } else {
                    this.setState({
                        isLoading: false,
                    });
                }
            } catch (error) {
                this.setState({
                    isLoading: false,
                });
                //feature product not loaded, site will keep working
            }
        }
    }

    searchFunction(event) {
        if (event.keyCode === 13) {
            this.startSearch();
        }
    }

    async startSearch() {
        if (
            this.oldSearchTerm !== this.searchTerm ||
            this.oldSort !== this.sort ||
            this.oldMinPrice !== this.minPrice ||
            this.oldMaxPrice !== this.maxPrice
        ) {
            this.setState({
                currentPage: 0,
            });

            this.searchProducts(
                0,
                this.searchTerm,
                this.minPrice,
                this.maxPrice,
                this.sort
            );
        }
    }

    public render() {
        let productsState;
        //filter after active products, product's shop present in our shops list
        if (this.state.products && this.state.products.length > 0) {
            productsState = this.state.products
                .filter(
                    product =>
                        this.props.shops.find(
                            shop => shop.id === product.shopId
                        ) !== undefined
                )
                .map(product => {
                    let shop = this.props.shops.find(
                        shop => shop.id === product.shopId
                    );
                    if (shop) {
                        product.commission = roundCommission(
                            (product.price * parseFloat(shop.commission)) / 100
                        );
                    }
                    return product;
                });
        }

        let productsList =
            productsState && productsState.length > 0
                ? productsState.map((product, index) => {
                      //check if active
                      return (
                          <ProductListElement
                              key={'list' + index}
                              keyElement={'list' + index}
                              product={product}
                          />
                      );
                  })
                : null;

        return (
            <React.Fragment>
                <section className="cat_product_area section_gap">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="left_sidebar_area">
                                    <aside className="left_widgets p_filter_widgets">
                                        <div className="l_w_title">
                                            <h3>
                                                <FormattedMessage
                                                    id={'products.filters'}
                                                    defaultMessage="Filters"
                                                />
                                            </h3>
                                        </div>

                                        <div className="widgets_inner">
                                            <h3>
                                                <FormattedMessage
                                                    id={
                                                        'products.filters.price'
                                                    }
                                                    defaultMessage="Price"
                                                />
                                            </h3>
                                            <FormControl
                                                fullWidth
                                                variant="outlined"
                                                disabled={
                                                    !this.state.searchActive
                                                }
                                            >
                                                <InputLabel htmlFor="outlined-adornment-amount">
                                                    Min
                                                </InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-amount"
                                                    type={'number'}
                                                    inputProps={{
                                                        min: '0',
                                                        max: '100000',
                                                    }}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            lei
                                                        </InputAdornment>
                                                    }
                                                    onChange={event => {
                                                        this.minPrice =
                                                            event.target.value;
                                                    }}
                                                    labelWidth={60}
                                                />
                                            </FormControl>
                                            <br />
                                            <br />
                                            <FormControl
                                                fullWidth
                                                variant="outlined"
                                                disabled={
                                                    !this.state.searchActive
                                                }
                                            >
                                                <InputLabel htmlFor="outlined-adornment-amount">
                                                    Max
                                                </InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-amount"
                                                    type={'number'}
                                                    inputProps={{
                                                        min: '0',
                                                        max: '100000',
                                                    }}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            lei
                                                        </InputAdornment>
                                                    }
                                                    onChange={event => {
                                                        this.maxPrice =
                                                            event.target.value;
                                                    }}
                                                    labelWidth={60}
                                                />
                                            </FormControl>
                                        </div>

                                        <div className="widgets_inner">
                                            <h3>
                                                <FormattedMessage
                                                    id={
                                                        'products.filters.sorting'
                                                    }
                                                    defaultMessage="Price sorting"
                                                />
                                            </h3>

                                            <FormControl
                                                fullWidth
                                                disabled={
                                                    !this.state.searchActive
                                                }
                                            >
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
                                                    value={this.sort}
                                                    onChange={event => {
                                                        this.sort = event.target
                                                            .value as string;
                                                        this.startSearch();
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <FormattedMessage
                                                            id={'none.key'}
                                                            defaultMessage="None"
                                                        />
                                                    </MenuItem>
                                                    <MenuItem value={'asc'}>
                                                        <FormattedMessage
                                                            id={
                                                                'products.filters.sorting.ascending'
                                                            }
                                                            defaultMessage="Ascending"
                                                        />
                                                    </MenuItem>
                                                    <MenuItem value={'desc'}>
                                                        <FormattedMessage
                                                            id={
                                                                'products.filters.sorting.descending'
                                                            }
                                                            defaultMessage="Descending"
                                                        />
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </aside>
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="product_top_bar">
                                    <GenericInput
                                        type={'textfield'}
                                        id={'search'}
                                        className={'single-input'}
                                        placeholder={this.props.intl.formatMessage(
                                            { id: 'products.search' }
                                        )}
                                        onKeyUp={event => {
                                            if (event.target.value) {
                                                this.searchTerm =
                                                    event.target.value;
                                                if (!this.state.searchActive) {
                                                    this.setState({
                                                        searchActive: true,
                                                    });
                                                }
                                            } else {
                                                this.setState({
                                                    searchActive: false,
                                                });
                                            }
                                        }}
                                    />
                                </div>
                                <div className="product_top_bar">
                                    <button
                                        type="submit"
                                        value="submit"
                                        className="btn submit_btn"
                                        onClick={this.startSearch}
                                    >
                                        <FormattedMessage
                                            id="products.button.search"
                                            defaultMessage="Search"
                                        />
                                    </button>

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
                                                pageCount={
                                                    this.state.total / pageLimit
                                                }
                                                marginPagesDisplayed={1}
                                                pageRangeDisplayed={2}
                                                forcePage={
                                                    this.state.currentPage
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
                                            {productsList}
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
                                            pageCount={
                                                this.state.total / pageLimit
                                            }
                                            marginPagesDisplayed={1}
                                            pageRangeDisplayed={2}
                                            forcePage={this.state.currentPage}
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
        shops: state.shops.allShops,
    };
};

export default connect(mapStateToProps)(injectIntl(Products));
