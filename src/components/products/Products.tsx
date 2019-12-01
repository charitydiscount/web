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
import {getFeaturedProducts, ProductDTO, searchProduct} from "../../rest/ProductsService";
import ReactAdBlock from "../../ReactAdBlock";
import ProductListElement from "./ProductListElement";
import {fetchShops, getShopByName} from "../../rest/ShopsService";

interface ProductsProps {

}

interface ProductsState {
    isLoading: boolean,
    products: Array<ProductDTO>,
    currentPage: number
}

const pageLimit = 30; // products per page

class Products extends React.Component<ProductsProps & InjectedIntlProps, ProductsState> {

    constructor(props: ProductsProps & InjectedIntlProps) {
        super(props);
        this.state = {
            isLoading: false,
            products: {} as Array<ProductDTO>,
            currentPage: 0
        };
        this.onSearchUpdate = this.onSearchUpdate.bind(this);
        this.updatePageNumber = this.updatePageNumber.bind(this);
    }

    updatePageNumber(data) {
        this.setState({
            currentPage: data.selected as number
        })
    }

    async componentDidMount() {
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
                    products: response as Array<ProductDTO>
                })
            }
        } catch (error) {
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

    async onSearchUpdate(event) {
        this.setState({
            isLoading: true
        });
        if (event.target.value) {
            try {
                let product = await searchProduct(event.target.value);
                if (product) {
                    this.setState({
                        products: product as ProductDTO[],
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

    public render() {
        let productsState;
        //filter after active products, product's shop present in our shops list
        if (this.state.products && this.state.products.length > 0) {
            productsState = this.state.products.filter(product => getShopByName(product.shopName) !== undefined);
        }

        let productsList = productsState &&
        productsState > 0 ? productsState.map((product, index) => {
            //check if active
            return <ProductListElement key={"list" + index} keyElement={"list" + index} product={product}/>
        }) : null;

        let pageCount = 0;
        if (productsState && productsState.length > 0) {
            if (productsState.length > pageLimit) {
                pageCount = productsState.length / pageLimit;
                let offset = this.state.currentPage;
                productsList = productsState.slice(offset * pageLimit, (offset + 1) * pageLimit).map((product, index) => {
                    //check if active
                    return <ProductListElement key={"list" + index} keyElement={"list" + index} product={product}/>
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
                            <div className="col-md-12">
                                <div className="product_top_bar">
                                    <GenericInput type={"textfield"} id={"search"} className={"single-input"}
                                                  placeholder={this.props.intl.formatMessage({id: "products.search"})}
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
                                            pageCount={pageCount}
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