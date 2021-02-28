import React from 'react';
import { ShopDto } from '../../../../rest/ShopsService';
import { AppState } from '../../../../redux/reducer/RootReducer';
import { setCurrentPage, setShops } from '../../../../redux/actions/ShopsAction';
import { connect } from 'react-redux';
import { emptyHrefLink, noImagePath } from '../../../../helper/Constants';
import { FormattedMessage } from 'react-intl';
import { ICategoryProps, ICategoryState, updateShops } from './BaseCategories';
import { fetchCategoryPhoto } from '../../../../rest/StorageService';

class UpperCategory extends React.Component<ICategoryProps, ICategoryState> {
    constructor(props: ICategoryProps) {
        super(props);
        this.state = {
            photoURL: noImagePath,
        };
        this.updateShops = this.updateShops.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    /**
     * Used to update shops list after a category is selected
     */
    public updateShops(event: React.MouseEvent) {
        updateShops(this, event);
    }

    /**
     * This is a function which will trigger parent function to change state
     */
    public onToggle() {
        this.props.onToggle(this.props.id, this.props.name);
    }

    async componentDidMount() {
        if (this.props.photoName) {
            try {
                const response = await fetchCategoryPhoto(this.props.photoName);
                this.setState({
                    photoURL: response as string,
                });
            } catch (error) {
                this.setState({
                    photoURL: noImagePath,
                });
            }
        }
    }

    public render() {
        return (
            <React.Fragment>
                <div
                    className="col-6 col-lg-2 f_p_item p-2 category"
                    style={{ cursor: 'pointer' }}
                    onClick={this.updateShops}
                >
                    {this.state.photoURL && (
                        <img
                            src={this.state.photoURL}
                            alt="post"
                            height={64}
                            width={64}
                        />
                    )}

                    <a
                        href={emptyHrefLink}
                        className={this.props.selected ? 'selected' : ''}
                    >
                        <FormattedMessage
                            id={this.props.name.replace(/\s/g, '')}
                        />
                    </a>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        allShops: state.shops.allShops,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setShops: (shops: Array<ShopDto>) => dispatch(setShops(shops)),
        setCurrentPage: (currentPage: number) =>
            dispatch(setCurrentPage(currentPage)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpperCategory);
