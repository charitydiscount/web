import * as React from "react";
import {DB, store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {CategoryDto} from "./CategoryDto";
import Category from "./Category";
import {fetchCategoriesForUi} from "../../rest/CategoriesService";

interface ICategoryProps {
}

interface ICategoryState {
    categories: CategoryDto[],
    isLoading: boolean,
    selections: boolean[]  // used for showing a blue color when a category is activated
}

class Categories extends React.Component<ICategoryProps, ICategoryState> {

    constructor(props: ICategoryProps) {
        super(props);
        this.state = {
            isLoading: true,
            categories: [],
            selections: []
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
     */
    public onChildToggle(id) {
        let selections = [] as boolean[];
        selections[id] = true;

        this.setState({
            selections: selections
        });
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CATEGORIES));
    }

    public render() {
        return (
            <React.Fragment>
                <aside className="left_widgets cat_widgets">
                    <div className="l_w_title">
                        <h3>Categories</h3>
                    </div>
                    <div className="widgets_inner">
                        <ul className="list">
                            {!this.state.isLoading &&
                            <React.Fragment>
                                {
                                    this.state.categories.map(data => {
                                        return <Category key={data.category} name={data.category}
                                                         selected={this.state.selections[data.category]}
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

export default Categories;
