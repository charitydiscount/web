import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Categories from "./Categories";
import {connect} from "react-redux";
import Shop from "./Shop";
import {resetShops, setCurrentPage, setShops} from "../../redux/actions/ShopsAction";
import GenericInput from "../input/GenericInput";
import {getLocalStorage} from "../../helper/StorageHelper";
import {StorageKey} from "../../helper/Constants";
import ReactPaginate from 'react-paginate';
import {setCurrentCategory, setSelections} from "../../redux/actions/CategoriesAction";
import {fetchShops, ShopDto} from "../../rest/ShopsService";

interface IShopsProps {
    shops: Array<ShopDto>,
    currentPage: number

    // global state
    setShops: any,
    resetShops: any,
    setCurrentPage: any,

    //used to refresh categories
    setCurrentCategory: any
    setSelections: any
}

interface IShopsState {
    isLoading: boolean,
}

const pageLimit = 24; // products per page

class Shops extends React.Component<IShopsProps, IShopsState> {

    constructor(props: IShopsProps) {
        super(props);
        this.state = {
            isLoading: true,
        };
        this.onSearchUpdate = this.onSearchUpdate.bind(this);
        this.updatePageNumber = this.updatePageNumber.bind(this);
    }

    public componentDidMount() {
        fetchShops(this);
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
    }


    public onSearchUpdate(event) {
        if (!event.target.value) {
            const shops = getLocalStorage(StorageKey.SHOPS);
            if (shops) {
                this.props.setShops(JSON.parse(shops));
                this.props.setSelections([]);
                this.props.setCurrentCategory(String(''));
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
        var shopsList = this.props.shops ? this.props.shops.map(shop => {
            return <Shop key={shop.name} logoSrc={shop.logoPath} name={shop.name} category={shop.category}
                         mainUrl={shop.mainUrl} id={shop.id} uniqueCode={shop.uniqueCode}/>
        }) : null;

        var pageCount = 0;
        if (this.props.shops) {
            if (this.props.shops.length > pageLimit) {
                pageCount = this.props.shops.length / pageLimit;
                var offset = this.props.currentPage;
                shopsList = this.props.shops.slice(offset * pageLimit, (offset + 1) * pageLimit).map(shop => {
                    return <Shop key={shop.name} logoSrc={shop.logoPath} name={shop.name} category={shop.category}
                                 mainUrl={shop.mainUrl} id={shop.id} uniqueCode={shop.uniqueCode}/>
                });
            } else {
                pageCount = 1;
            }
        }

        return (
            <React.Fragment>
                <section className="cat_product_area section_gap">
                    <div className="container-fluid">
                        <div className="row flex-row-reverse">
                            <div className="col-lg-9">
                                <div className="product_top_bar">
                                    <GenericInput type={"textfield"} id={"search"} className={"single-input"}
                                                  placeholder={"Search..."} onKeyUp={this.onSearchUpdate}/>
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
                                <div className="latest_product_inner row">
                                    {
                                        !this.state.isLoading &&
                                        <React.Fragment>
                                            {shopsList}
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="left_sidebar_area">
                                    <Categories/>
                                </div>
                            </div>
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
        currentPage: state.shopReducer.currentPage
    };
};


const mapDispatchToProps = (dispatch: any) => {
    return {
        setShops: (shopWrapper: Array<ShopDto>) =>
            dispatch(setShops(shopWrapper)),
        setCurrentPage: (currentPage: number) =>
            dispatch(setCurrentPage(currentPage)),
        setCurrentCategory: (currentCategory: String) =>
            dispatch(setCurrentCategory(currentCategory)),
        setSelections: (selections: boolean[]) =>
            dispatch(setSelections(selections))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Shops);


