import * as React from "react";
import {DB, store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {CategoryDto} from "./CategoryDto";
import Category from "./Category";
import {getLocalStorage, setLocalStorage} from "../../helper/WebHelper";
import {StorageKey} from "../../helper/Constants";

interface ICategoryProps {
}

interface ICategoryState {
    categories: CategoryDto[],
    isLoading: boolean
}

class Categories extends React.Component<ICategoryProps, ICategoryState> {

    constructor(props: ICategoryProps) {
        super(props);
        this.state = {
            isLoading: true,
            categories: []
        };
    }

    public componentDidMount() {
        const categories = getLocalStorage(StorageKey.CATEGORIES);
        if (categories) {
            this.setState({
                categories: JSON.parse(categories),
                isLoading: false,
            });
        } else {
            DB.collection("categories")
                .get()
                .then(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => doc.data() as CategoryDto);
                    setLocalStorage(StorageKey.CATEGORIES, JSON.stringify(data));
                    if (data) {
                        this.setState({
                            categories: data,
                            isLoading: false,
                        });
                    }
                });
        }
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
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
                                        return <Category key = {data.category} name={data.category}/>
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
