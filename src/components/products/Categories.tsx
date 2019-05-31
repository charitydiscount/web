import * as React from "react";
import {DB, store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {CategoryDto} from "./CategoryDto";
import Category from "./Category";
import {getLocalStorage, setLocalStorage} from "../../helper/WebHelper";
import {allCategoriesKey, StorageKey} from "../../helper/Constants";

interface ICategoryProps {
}

interface ICategoryState {
    categories: CategoryDto[],
    isLoading: boolean,
    selections: boolean[]
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
        const categories = getLocalStorage(StorageKey.CATEGORIES);
        if (categories) {
            this.setState({
                categories: JSON.parse(categories),
                isLoading: false,
                selections: []
            });
        } else {
            DB.collection("categories")
                .get()
                .then(querySnapshot => {
                    let data = [] as CategoryDto[];
                    data.push(allCategoriesKey as CategoryDto);
                    querySnapshot.docs.forEach(doc => data.push(doc.data() as CategoryDto));
                    setLocalStorage(StorageKey.CATEGORIES, JSON.stringify(data));
                    if (data) {
                        this.setState({
                            categories: data,
                            isLoading: false,
                            selections: []
                        });
                    }
                });
        }
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
                            </React.Fragment>}
                        </ul>
                    </div>
                </aside>
            </React.Fragment>
        )
    }
}

export default Categories;
