import * as React from "react";
import {DB, store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {CategoryDto} from "./CategoryDto";
import Category from "./Category";

interface ICategoryProps {
}

interface ICategoryState {
    categories: CategoryDto[],
}

class Categories extends React.Component<ICategoryProps, ICategoryState> {

    constructor(props: ICategoryProps) {
        super(props);
        this.state = {
            categories: []
        };
        this.fetchCategories = this.fetchCategories.bind(this);
    }

    public componentDidMount() {
        this.fetchCategories();
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
    }

    public fetchCategories() {
        DB.collection("categories")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data() as CategoryDto);
                this.setState({categories: data});
            });
    }


    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CATEGORIES));
    }

    public render() {
        return (
            <aside className="left_widgets cat_widgets">
                <div className="l_w_title">
                    <h3>Categories</h3>
                </div>
                <div className="widgets_inner">
                    <ul className="list">
                        {
                            this.state.categories.map(data => {
                                return <Category name={data.category}/>
                            })
                        }
                    </ul>
                </div>
            </aside>
        )
    }
}

export default Categories;
