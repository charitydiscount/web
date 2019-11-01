import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Category from "./Category";
import {CategoryDto, fetchCategories} from "../../rest/CategoriesService";
import {connect} from "react-redux";
import {setCurrentCategory, setSelections} from "../../redux/actions/CategoriesAction";
import {FormattedMessage} from 'react-intl';
import FadeLoader from 'react-spinners/FadeLoader';
import {spinnerCss} from "../../helper/AppHelper";

interface ICategoryProps {
    currentCategory?: String,
    selections?: boolean[]

    //global state
    setCurrentCategory?: any
    setSelections?: any // used for showing a blue color when a category is activated
}

interface ICategoryState {
    categories: CategoryDto[],
    isLoading: boolean,
}

class Categories extends React.Component<ICategoryProps, ICategoryState> {

    constructor(props: ICategoryProps) {
        super(props);
        this.state = {
            isLoading: true,
            categories: [],
        };
        this.onChildToggle = this.onChildToggle.bind(this);
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
        try {
            let response = await fetchCategories();
            this.setState(
                {
                    categories: response as CategoryDto[],
                    isLoading: false
                });
        } catch (error) {
            this.setState(
                {
                    isLoading: true
                });
        }
    }

    /**
     * This is a callback function, it is invoked from Category.tsx
     * @param id - the id of the child which will be activated
     * @param name - the category name to change the global state
     */
    public onChildToggle(id, name) {
        let selections = [] as boolean[];
        selections[id] = true;

        this.props.setSelections(selections);
        this.props.setCurrentCategory(name);
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
                            <FormattedMessage id="categories.title" defaultMessage="Categories"/>
                            {this.props.currentCategory && this.props.currentCategory.length > 0
                                ? "->"
                                : null}
                            {this.props.currentCategory && this.props.currentCategory.length > 0
                                ? <FormattedMessage id={this.props.currentCategory.replace(/\s/g, '')}/>
                                : null}
                        </h3>
                    </div>
                    <div className="widgets_inner">
                        <ul className="list">
                            {!this.state.isLoading &&
                            <React.Fragment>
                                {
                                    this.state.categories.map(data => {
                                        return <Category key={data.category} name={data.category}
                                                         selected={this.props.selections && this.props.selections[data.category]}
                                                         id={data.category} onToggle={this.onChildToggle}/>
                                    })
                                }
                            </React.Fragment>
                            }
                            <FadeLoader
                                loading={this.state.isLoading}
                                color={'#1641ff'}
                                css={spinnerCss}
                            />
                        </ul>
                    </div>
                </aside>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        currentCategory: state.categoryReducer.currentCategory,
        selections: state.categoryReducer.selections
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setCurrentCategory: (currentCategory: String) =>
            dispatch(setCurrentCategory(currentCategory)),
        setSelections: (selections: boolean[]) =>
            dispatch(setSelections(selections))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
