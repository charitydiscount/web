import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {fetchConfigInfo} from "../../rest/ConfigService";
import ReactPaginate from 'react-paginate';
import {spinnerCss} from "../../helper/AppHelper";
import GenericInput from "../input/GenericInput";
import {FadeLoader} from "react-spinners";
import {
    getFeaturedProducts,
    ProductDTO,
    ProductResult, ProductSearchInfo,
    searchProduct
} from "../../rest/ProductsService";
import ReactAdBlock from "../../ReactAdBlock";
import ProductListElement from "./ProductListElement";
import {fetchShops, getShopByName} from "../../rest/ShopsService";
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import {FormattedMessage} from 'react-intl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

interface ProductsProps {

}

interface ProductsState {
    isLoading: boolean,
    productName: string,
    products: Array<ProductDTO>,
    currentPage: number,
    minPrice: string,
    maxPrice: string,
    sort: string,
    total: number,
    productSearchInfo: ProductSearchInfo

}

const pageLimit = 50; // products per page

class Products extends React.Component<ProductsProps & InjectedIntlProps, ProductsState> {

    constructor(props: ProductsProps & InjectedIntlProps) {
        super(props);
        this.state = {
            isLoading: false,
            productName: '',
            products: {} as Array<ProductDTO>,
            currentPage: 0,
            minPrice: '',
            maxPrice: '',
            sort: 'asc',
            total: 50,
            productSearchInfo: {} as ProductSearchInfo
        };
        this.startSearch = this.startSearch.bind(this);
        this.searchProducts = this.searchProducts.bind(this);
        this.updatePageNumber = this.updatePageNumber.bind(this);
    }

    updatePageNumber(data) {
        this.setState({
            currentPage: data.selected as number
        });
        this.searchProducts(data.selected, this.state.productSearchInfo.productName, this.state.productSearchInfo.minPrice,
            this.state.productSearchInfo.maxPrice, this.state.productSearchInfo.sort);
    }

    async componentDidMount() {
        this.setState({
            isLoading: true
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
                    isLoading: false
                })
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

        try {
            await fetchShops();
        } catch (error) {
            //shops not loaded
        }

        store.dispatch(NavigationsAction.setStageAction(Stages.PRODUCTS));
    }

    componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.PRODUCTS));
    }

    async searchProducts(pageNumber, title, minPrice, maxPrice, sort) {
        this.setState({
            isLoading: true
        });
        if (this.state.productName && this.state.productName.length > 0) {
            try {
                let response = await searchProduct(title,
                    minPrice ? minPrice : '0',
                    maxPrice ? maxPrice : '0',
                    sort,
                    pageNumber) as ProductResult;
                if (response) {
                    this.setState({
                        products: response.products,
                        total: response.total,
                        isLoading: false
                    });
                }
            } catch (e) {
                this.setState({
                    isLoading: false
                });
            }
        } else {
            try {
                let response = await getFeaturedProducts();
                if (response) {
                    this.setState({
                        products: response as Array<ProductDTO>,
                        isLoading: false
                    })
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
    }

    async startSearch() {
        this.setState({
            currentPage: 0,
            productSearchInfo: {
                productName: this.state.productName,
                minPrice: this.state.minPrice,
                maxPrice: this.state.maxPrice,
                sort: this.state.sort
            }
        });

        this.searchProducts(0, this.state.productName, this.state.minPrice, this.state.maxPrice, this.state.sort);
    }

    public render() {
        let productsState;
        //filter after active products, product's shop present in our shops list
        if (this.state.products && this.state.products.length > 0) {
            productsState = this.state.products.filter(product => getShopByName(product.shopName) !== undefined);
        }

        let productsList = productsState &&
        productsState.length > 0 ? productsState.map((product, index) => {
            //check if active
            return <ProductListElement key={"list" + index} keyElement={"list" + index} product={product}/>
        }) : null;

        return (
            <React.Fragment>
                <ReactAdBlock/>
                <section className="cat_product_area section_gap">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="left_sidebar_area">
                                    <aside className="left_widgets p_filter_widgets">
                                        <div className="l_w_title">
                                            <h3>
                                                <FormattedMessage id={"products.filters"}
                                                                  defaultMessage="Filters"/>
                                            </h3>
                                        </div>

                                        <div className="widgets_inner">
                                            <h3>
                                                <FormattedMessage id={"products.filters.price"}
                                                                  defaultMessage="Price"/>
                                            </h3>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-amount">Min</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-amount"
                                                    value={this.state.minPrice}
                                                    type={"number"}
                                                    inputProps={{
                                                        min: "0",
                                                        max: "100000"
                                                    }}
                                                    endAdornment={<InputAdornment position="end">lei</InputAdornment>}
                                                    onChange={event => this.setState({minPrice: event.target.value})}
                                                    labelWidth={60}
                                                />
                                            </FormControl>
                                            <br/>
                                            <br/>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-amount">Max</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-amount"
                                                    value={this.state.maxPrice}
                                                    type={"number"}
                                                    inputProps={{
                                                        min: "0",
                                                        max: "100000"
                                                    }}
                                                    endAdornment={<InputAdornment position="end">lei</InputAdornment>}
                                                    onChange={event => {
                                                        if (event.target.value) {
                                                            this.setState({maxPrice: event.target.value})
                                                        }
                                                    }}
                                                    labelWidth={60}
                                                />
                                            </FormControl>
                                        </div>

                                        <div className="widgets_inner">
                                            <h3>
                                                <FormattedMessage id={"products.filters.sorting"}
                                                                  defaultMessage="Price sorting"/>
                                            </h3>

                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={this.state.sort}
                                                    onChange={event => this.setState({
                                                        sort: event.target.value as string
                                                    })}
                                                >
                                                    <MenuItem value={'asc'}>
                                                        <FormattedMessage id={"products.filters.sorting.ascending"}
                                                                          defaultMessage="Ascending"/>
                                                    </MenuItem>
                                                    <MenuItem value={'desc'}>
                                                        <FormattedMessage id={"products.filters.sorting.descending"}
                                                                          defaultMessage="Descending"/>
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>

                                        </div>
                                    </aside>
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="product_top_bar">
                                    <GenericInput type={"textfield"} id={"search"} className={"single-input"}
                                                  placeholder={this.props.intl.formatMessage({id: "products.search"})}
                                                  onKeyUp={event => this.setState({productName: event.target.value})}/>
                                </div>
                                <div className="product_top_bar">
                                    <button type="submit" value="submit" className="btn submit_btn"
                                            onClick={this.startSearch}>
                                        <FormattedMessage id="products.button.search"
                                                          defaultMessage="Search"/>
                                    </button>

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
                                                pageCount={this.state.total / pageLimit}
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
                                            {productsList}
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
                                            pageCount={this.state.total / pageLimit}
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
        )
    }
}

export default injectIntl(Products);