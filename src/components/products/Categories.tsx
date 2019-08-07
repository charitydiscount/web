import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {CategoryDto} from "./CategoryDto";
import Category from "./Category";
import {fetchCategoriesForUi} from "../../rest/CategoriesService";
import {connect} from "react-redux";
import {setCurrentCategory, setSelections} from "../../redux/actions/CategoriesAction";

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

    public componentDidMount() {
        fetchCategoriesForUi(this);
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
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
                        <h3>Categories {this.props.currentCategory &&
                        this.props.currentCategory.length > 0 ? ' -> ' + this.props.currentCategory : null}</h3>
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
