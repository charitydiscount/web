import * as React from 'react';
import { connect } from 'react-redux';
import { setCurrentPage, setShops } from '../../../redux/actions/ShopsAction';
import { emptyHrefLink } from '../../../helper/Constants';
import { ShopDto } from '../../../rest/ShopsService';
import { FormattedMessage } from 'react-intl';
import { AppState } from '../../../redux/reducer/RootReducer';
import { ICategoryProps, updateShops } from './BaseCategories';

class Category extends React.Component<ICategoryProps> {
    constructor(props: ICategoryProps) {
        super(props);
        this.updateShops = this.updateShops.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    /**
     * This is a function which will trigger parent function to change state
     */
    public onToggle() {
        this.props.onToggle(this.props.id, this.props.name);
    }

    public updateShops(event: React.MouseEvent) {
        event.preventDefault(); // prevent default to not point to href location
        if (this.props.name === 'All') {
            // load all shops in this case
            this.props.setShops(this.props.allShops);
            this.props.setCurrentPage(0);
        } else {
            //load shops from selected category in this case
            const result = this.props.allShops.filter(
                (shop) =>
                    shop.category.toLowerCase() ===
                    this.props.name.toLowerCase()
            );
            this.props.setShops(result);
            this.props.setCurrentPage(0);
        }
        this.onToggle();
        window.scrollTo(0, 0);
    }

    public render() {
        return (
            <React.Fragment>
                <li>
                    <a
                        href={emptyHrefLink}
                        id={this.props.name.toString()}
                        className={this.props.selected ? 'selected' : undefined}
                        onClick={this.updateShops}
                    >
                        <FormattedMessage
                            id={this.props.name.replace(/\s/g, '')}
                        />
                    </a>
                </li>
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

export default connect(mapStateToProps, mapDispatchToProps)(Category);
