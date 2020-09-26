import * as React from 'react';
import { store } from '../../..';
import { NavigationsAction } from '../../../redux/actions/NavigationsAction';
import { Stages } from '../../helper/Stages';
import Category from './Category';
import { connect } from 'react-redux';
import {
    setCurrentCategory,
    setSelections,
} from '../../../redux/actions/CategoriesAction';
import { FormattedMessage } from 'react-intl';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerCss } from '../../../helper/AppHelper';
import { AppState } from '../../../redux/reducer/RootReducer';
import {
    ICategoriesProps,
    ICategoriesState,
    loadCategories,
    onChildToggle,
} from './BaseCategories';

class Categories extends React.Component<ICategoriesProps, ICategoriesState> {
    constructor(props: ICategoriesProps) {
        super(props);
        this.state = {
            isLoading: true,
            categories: [],
        };
        this.onChildToggle = this.onChildToggle.bind(this);
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
        await loadCategories(this);
    }

    /**
     * This is a callback function, it is invoked from Category.tsx
     * @param id - the id of the child which will be activated
     * @param name - the category name to change the global state
     */
    public onChildToggle(id, name) {
        onChildToggle(this, id, name);
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CATEGORIES));
    }

    public render() {
        return (
            <React.Fragment>
                <aside className="left_widgets cat_widgets">
                    <div className="l_w_title">
                        <h3>
                            <FormattedMessage
                                id="categories.title"
                                defaultMessage="Categories"
                            />
                            {this.props.currentCategory &&
                            this.props.currentCategory.length > 0
                                ? ' / '
                                : null}
                            {this.props.currentCategory &&
                            this.props.currentCategory.length > 0 ? (
                                <FormattedMessage
                                    id={this.props.currentCategory.replace(
                                        /\s/g,
                                        ''
                                    )}
                                />
                            ) : null}
                        </h3>
                    </div>
                    <div className="widgets_inner">
                        <ul className="list">
                            {!this.state.isLoading && (
                                <React.Fragment>
                                    {this.state.categories.map((data) => {
                                        return (
                                            <Category
                                                key={data.category}
                                                name={data.category}
                                                selected={
                                                    this.props.selections &&
                                                    this.props.selections[
                                                        data.category
                                                    ]
                                                }
                                                id={data.category}
                                                onToggle={this.onChildToggle}
                                            />
                                        );
                                    })}
                                </React.Fragment>
                            )}
                            <FadeLoader
                                loading={this.state.isLoading}
                                color={'#e31f29'}
                                css={spinnerCss}
                            />
                        </ul>
                    </div>
                </aside>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        currentCategory: state.category.currentCategory,
        selections: state.category.selections,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setCurrentCategory: (currentCategory: String) =>
            dispatch(setCurrentCategory(currentCategory)),
        setSelections: (selections: boolean[]) =>
            dispatch(setSelections(selections)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
