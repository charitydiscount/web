import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { store } from '../../index';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import ReactPaginate from 'react-paginate';
import { spinnerCss } from '../../helper/AppHelper';
import GenericInput from '../input/GenericInput';
import { FadeLoader } from 'react-spinners';
import {
    getFeaturedProducts,
    Product,
    ProductResult,
    searchProduct,
} from '../../rest/ProductsService';
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
import { ProductSearch } from "../../redux/reducer/ProductReducer";
import { ProductActions } from "../../redux/actions/ProductsAction";
import { filterProducts } from "./ProductHelper";
import {Routes} from "../helper/Routes";

interface ProductsProps {
    intl: IntlShape,
    shops: ShopDto[],

    productSearch: ProductSearch,
    setProductSearch: (productSearch: ProductSearch) => void
    setBackLink: (backLink: string) => void
}

interface ProductsState {
    isLoading: boolean
    products: Array<Product>
    currentPage: number
    total: number
    searchTerm: string
    minPrice: string
    maxPrice: string
    sort: string
}

const pageLimit = 50; // products per page

class Products extends React.Component<ProductsProps, ProductsState> {
    private oldSearchTerm: string = '';
    private oldMinPrice: string = '';
    private oldMaxPrice: string = '';
    private oldSort: string = '';

    constructor(props: ProductsProps) {
        super(props);
        this.state = {
            isLoading: false,
            products: {} as Array<Product>,
            currentPage: 0,
            total: 50,
            searchTerm: '',
            sort: '',
            minPrice: '',
            maxPrice: ''
        };
        document.addEventListener('keydown', this.searchFunction, false);
    }

    updatePageNumber = (data) => {
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
            this.state.searchTerm,
            this.state.minPrice,
            this.state.maxPrice,
            this.state.sort
        );
    };

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.PRODUCTS));
        this.setState({
            isLoading: true
        });

        this.props.setBackLink(Routes.PRODUCTS);

        if (this.props.productSearch && this.props.productSearch.products.length > 0) {
            this.setState({
                maxPrice: this.props.productSearch.maxPrice,
                minPrice: this.props.productSearch.minPrice,
                searchTerm: this.props.productSearch.searchTerm,
                sort: this.props.productSearch.sort,
                currentPage: this.props.productSearch.currentPage,
                products: this.props.productSearch.products,
                total: this.props.productSearch.total,
                isLoading: false
            })
        } else {
            await this.handleFeaturedProduct();
        }
    }

    componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.PRODUCTS));
    }

    searchProducts = async (pageNumber, searchTerm, minPrice, maxPrice, sort) => {
        this.oldMaxPrice = maxPrice;
        this.oldMinPrice = minPrice;
        this.oldSort = sort;
        this.oldSearchTerm = searchTerm;
        this.setState({
            isLoading: true
        });
        if (searchTerm && searchTerm.length > 0) {
            try {
                let response = (await searchProduct(
                    searchTerm,
                    minPrice ? minPrice : '0',
                    maxPrice ? maxPrice : '0',
                    sort,
                    pageNumber
                )) as ProductResult;
                if (response) {
                    this.props.setProductSearch({
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        currentPage: pageNumber,
                        sort: sort,
                        searchTerm: searchTerm,
                        products: response.products,
                        total: response.total
                    });
                    this.setState({
                        products: response.products,
                        total: response.total,
                        isLoading: false
                    });
                }
            } catch (e) {
                this.setState({
                    isLoading: false,
                });
            }
        } else {
            await this.handleFeaturedProduct();
        }
    };

    handleFeaturedProduct = async () => {
        try {
            let response = await getFeaturedProducts();
            if (response) {
                this.props.setProductSearch({
                    minPrice: '',
                    maxPrice: '',
                    currentPage: 0,
                    sort: '',
                    searchTerm: '',
                    products: response as Array<Product>,
                    total: 50
                });
                this.setState({
                    products: response as Array<Product>,
                    isLoading: false,
                    currentPage: 0,
                    total: 50,
                    searchTerm: '',
                    sort: '',
                    minPrice: '',
                    maxPrice: ''
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        } catch (error) {
            this.setState({
                isLoading: false
            });
            //feature product not loaded, site will keep working
        }
    }

    searchFunction = (event) => {
        if (event.keyCode === 13) {
            this.startSearch();
        }
    };

    startSearch = async () => {
        if (
            this.oldSearchTerm !== this.state.searchTerm ||
            this.oldSort !== this.state.sort ||
            this.oldMinPrice !== this.state.minPrice ||
            this.oldMaxPrice !== this.state.maxPrice
        ) {
            this.setState({
                currentPage: 0,
            });

            this.searchProducts(
                0,
                this.state.searchTerm,
                this.state.minPrice,
                this.state.maxPrice,
                this.state.sort
            );
        }
    };

    public render() {
        let productsList;
        if (this.state.products && this.state.products.length > 0) {
            productsList = filterProducts(this.state.products, this.props.shops, false);
        }

        return (
            <React.Fragment>
                <section className="product_description_area section_gap">
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
                                                    value={this.state.minPrice}
                                                    onChange={(event) => {
                                                        this.setState({
                                                            minPrice: event.target.value
                                                        })
                                                    }}
                                                    labelWidth={60}
                                                />
                                            </FormControl>
                                            <br/>
                                            <br/>
                                            <FormControl
                                                fullWidth
                                                variant="outlined"
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
                                                    value={this.state.maxPrice}
                                                    onChange={(event) => {
                                                        this.setState({
                                                            maxPrice: event.target.value
                                                        })
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

                                            <FormControl fullWidth>
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
                                                    value={this.state.sort}
                                                    onChange={(event) => {
                                                        this.setState({
                                                            sort: event.target.value as string
                                                        })
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
                                            {id: 'products.search'}
                                        )}
                                        value={this.state.searchTerm}
                                        handleChange={(event) => {
                                            this.setState({
                                                searchTerm: event.target.value
                                            })
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
                                    color={'#e31f29'}
                                    css={spinnerCss}
                                />
                                <div
                                    className="latest_product_inner row d-flex align-items-stretch shops-container shade-container">
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
                                style={{marginTop: 30}}
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
        productSearch: state.product.productSearch
    };
};

const
    mapDispatchToProps = (dispatch: any) => {
        return {
            setProductSearch: (productSearch: ProductSearch) =>
                dispatch(ProductActions.setProductSearch(productSearch)),
            setBackLink: (backLink: string) =>
                dispatch(ProductActions.setBackLink(backLink))
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Products));
