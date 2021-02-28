import React from "react";
import { spinnerCss } from "../../../helper/AppHelper";
import FadeLoader from 'react-spinners/FadeLoader';
import { getAllPromotions, PromotionDto } from "../../../rest/DealsService";
import PromotionListElement from "./PromotionListElement";
import { store } from "../../../index";
import { NavigationsAction } from "../../../redux/actions/NavigationsAction";
import { Stages } from "../../helper/Stages";
import ReactPaginate from 'react-paginate';
import GenericInput from '../../input/GenericInput';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { fetchFavoriteShops, ShopDto } from "../../../rest/ShopsService";
import { AppState } from "../../../redux/reducer/RootReducer";
import { connect } from "react-redux";


interface PromotionsProps {
    intl: IntlShape;
    allShops: ShopDto[];
}

interface PromotionsState {
    isLoading: boolean,
    allPromotions: PromotionDto[],
    promotions: PromotionDto[],
    favoriteShops: string[],
    currentPage: number,
    filterState: FilterState
}

enum FilterState {
    NONE,
    FAVORITE_SHOPS,
    EXPIRY_DATE_ASC,
    EXPIRY_DATE_DESC,
}

const pageLimit = 18; // promotions per page

class Promotions extends React.Component<PromotionsProps, PromotionsState> {

    constructor(props: PromotionsProps) {
        super(props);
        this.state = {
            isLoading: true,
            allPromotions: [],
            promotions: [],
            favoriteShops: [],
            currentPage: 0,
            filterState: FilterState.NONE
        }
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.PROMOTIONS));
        let response = await getAllPromotions();
        if (response) {
            this.setState({
                allPromotions: response as PromotionDto[],
                promotions: response as PromotionDto[],
                isLoading: false,
            });
        } else {
            this.setState({
                isLoading: false,
            });
        }

        let favShopResponse = await fetchFavoriteShops(this.props.allShops);
        if (favShopResponse) {
            let favoriteShops = [] as string[];
            (favShopResponse as ShopDto[]).forEach((shop) => {
                favoriteShops.push(shop.name.toLowerCase());
            });
            this.setState({
                favoriteShops: favoriteShops
            })
        }
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.PROMOTIONS));
    }

    generalFilter = (event) => {
        this.setState({
            filterState: event.target.value,
        });
        let promotions;
        switch (event.target.value) {
            case FilterState.FAVORITE_SHOPS:
                promotions = this.state.allPromotions.filter((promotion) => {
                    return this.state.favoriteShops.includes(promotion.program.name.toLowerCase());
                });
                this.setState({
                    promotions: promotions
                });
                break;
            case FilterState.EXPIRY_DATE_ASC:
                promotions = this.state.allPromotions.sort(function (x, y) {
                    let promotionEnd_X = new Date(x.promotionEnd);
                    let Difference_In_Days_X = Math.ceil((promotionEnd_X.getTime() - Date.now()) / (1000 * 3600 * 24));

                    let promotionEnd_Y = new Date(y.promotionEnd);
                    let Difference_In_Days_Y = Math.ceil((promotionEnd_Y.getTime() - Date.now()) / (1000 * 3600 * 24));

                    if (Difference_In_Days_X < Difference_In_Days_Y) return 1;
                    if (Difference_In_Days_X > Difference_In_Days_Y) return -1;
                    return 0;
                });
                this.setState({
                    promotions: promotions
                });
                break;
            case FilterState.EXPIRY_DATE_DESC:
                promotions = this.state.allPromotions.sort(function (x, y) {
                    let promotionEnd_X = new Date(x.promotionEnd);
                    let Difference_In_Days_X = Math.ceil((promotionEnd_X.getTime() - Date.now()) / (1000 * 3600 * 24));

                    let promotionEnd_Y = new Date(y.promotionEnd);
                    let Difference_In_Days_Y = Math.ceil((promotionEnd_Y.getTime() - Date.now()) / (1000 * 3600 * 24));

                    if (Difference_In_Days_X > Difference_In_Days_Y) return 1;
                    if (Difference_In_Days_X < Difference_In_Days_Y) return -1;
                    return 0;
                });
                this.setState({
                    promotions: promotions
                });
                break;
            default:
                this.setState({
                    promotions: this.state.allPromotions
                });
                break;
        }
    };

    updatePageNumber = (data) => {
        if (window.innerWidth > 800) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 1100);
        }

        this.setState({
            currentPage: data.selected
        });
    };

    onSearchUpdateEvent = (event) => {
        if (!event.target.value) {
            this.setState({
                filterState: FilterState.NONE,
                promotions: this.state.allPromotions
            })
        } else {
            const data = this.state.allPromotions.filter((promotion) =>
                promotion.program.name.toLowerCase().includes(event.target.value)
            );
            this.setState({
                filterState: FilterState.NONE,
                promotions: data
            })
        }
    };

    public render() {
        let promotionsList = this.state.promotions && this.state.promotions.length > 0 ?
            this.state.promotions.map((promotion) => {
                return (
                    <PromotionListElement
                        key={'list' + promotion.id}
                        promotion={promotion}
                    />
                );
            }) : [];

        let pageCount = 1;
        if (promotionsList.length > 0) {
            pageCount = promotionsList.length / pageLimit;
            let offset = this.state.currentPage;
            promotionsList = promotionsList
                .slice(offset * pageLimit, (offset + 1) * pageLimit)
        }

        return (
            <React.Fragment>
                <section className="product_description_area section_gap">
                    <div className="container">
                        <div className="product_top_bar shade-container">
                            <GenericInput
                                type={'textfield'}
                                id={'search'}
                                className={'single-input'}
                                placeholder={this.props.intl.formatMessage(
                                    {id: 'shops.search'}
                                )}
                                onKeyUp={this.onSearchUpdateEvent}
                            />
                            <div className="col-lg-3">
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
                                        value={this.state.filterState}
                                        onChange={
                                            this.generalFilter
                                        }
                                    >
                                        <MenuItem value={FilterState.NONE}>
                                            <FormattedMessage
                                                id={'promotions.filter.no.filter'}
                                                defaultMessage="Fara filtru"
                                            />
                                        </MenuItem>
                                        <MenuItem value={FilterState.FAVORITE_SHOPS}>
                                            <FormattedMessage
                                                id={'promotions.filter.favorite.shops'}
                                                defaultMessage="Magazine favorite"
                                            />
                                        </MenuItem>
                                        <MenuItem value={FilterState.EXPIRY_DATE_DESC}>
                                            <FormattedMessage
                                                id={'promotions.filter.sort.by.expiry.date.descending'}
                                                defaultMessage="Data de expirare ↓"
                                            />
                                        </MenuItem>
                                        <MenuItem value={FilterState.EXPIRY_DATE_ASC}>
                                            <FormattedMessage
                                                id={'promotions.filter.sort.by.expiry.date.ascending'}
                                                defaultMessage="Data de expirare ↑"
                                            />
                                        </MenuItem>
                                    </Select>
                                </FormControl>
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
                                    {promotionsList}
                                </React.Fragment>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <nav
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
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        allShops: state.shops.allShops
    };
};


export default connect(mapStateToProps)(injectIntl(Promotions));
