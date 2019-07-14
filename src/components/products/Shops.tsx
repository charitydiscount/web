import * as React from "react";
import {DB, store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Categories from "./Categories";
import {ShopDto, ShopDtoWrapper} from "./ShopDto";
import {connect} from "react-redux";
import Shop from "./Shop";
import {resetShops, setShops} from "../../redux/actions/ShopsAction";
import GenericInput from "../input/GenericInput";
import {getLocalStorage, setLocalStorage} from "../../helper/WebHelper";
import {StorageKey} from "../../helper/Constants";
import ReactPaginate from 'react-paginate';

interface IShopsProps {
    shops: Array<ShopDto>,

    // global state
    setShops: any,
    resetShops: any,
}

interface IShopsState {
    isLoading: boolean,
    currentPage: number
}

const pageLimit = 50; //50 products per page


class Shops extends React.Component<IShopsProps, IShopsState> {

    constructor(props: IShopsProps) {
        super(props);
        this.state = {
            isLoading: true,
            currentPage: 0
        };
        this.onSearchUpdate = this.onSearchUpdate.bind(this);
        this.updatePageState = this.updatePageState.bind(this);
    }

    public componentDidMount() {
        const shops = getLocalStorage(StorageKey.SHOPS);
        if (shops) {
            this.props.setShops(JSON.parse(shops));
            this.setState({
                isLoading: false,
            });
        } else {
            DB.collection("shops")
                .get()
                .then(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => doc.data() as ShopDtoWrapper);
                    if (data) {
                        var shops = new Array<ShopDto>();
                        data.forEach(element => {
                            element.batch.forEach(
                                shop => shops.push(shop))
                            return;
                        });
                        if (shops) {
                            setLocalStorage(StorageKey.SHOPS, JSON.stringify(shops));
                            this.props.setShops(shops);
                            this.setState({
                                isLoading: false,
                            });
                        }
                    }
                });
        }
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
    }


    public onSearchUpdate(event) {
        if (!event.target.value) {
            const shops = getLocalStorage(StorageKey.SHOPS);
            if (shops) {
                this.props.setShops(JSON.parse(shops));
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

    public updatePageState(){


    }

    public render() {
        const shopsList = this.props.shops ? this.props.shops.map(shop => {
            return <Shop key={shop.name} logoSrc={shop.logoPath} name={shop.name} category={shop.category}
                         mainUrl={shop.mainUrl}/>
        }) : null;

        var paginationLimit = 0;
        var pageCount = 0;
        if(shopsList) {
            paginationLimit = shopsList.length;
            pageCount = paginationLimit / pageLimit + 1;
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
                                                    previousLabel={''}
                                                    nextLabel={''}
                                                    breakLabel={'...'}
                                                    breakClassName={'blank'}
                                                    breakLinkClassName={'page-link'}
                                                    pageCount={pageCount}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={this.updatePageState}
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
        shops: state.shopReducer.shops
    };
};


const mapDispatchToProps = (dispatch: any) => {
    return {
        setShops: (shopWrapper: Array<ShopDto>) =>
            dispatch(setShops(shopWrapper)),
        resetIncidents: () => dispatch(resetShops()),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Shops);


