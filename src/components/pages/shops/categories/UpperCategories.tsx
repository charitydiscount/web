import React from "react";
import UpperCategory from "./UpperCategory";
import { AppState } from "../../../../redux/reducer/RootReducer";
import { setCurrentCategory, setSelections } from "../../../../redux/actions/CategoriesAction";
import { connect } from "react-redux";
import { ICategoriesProps, ICategoriesState, loadCategories, onChildToggle } from "./BaseCategories";
import { fetchImportantCategories, ImportantCategoryDto } from "../../../../rest/ConfigService";

class UpperCategories extends React.Component<ICategoriesProps, ICategoriesState> {

    constructor(props: ICategoriesProps) {
        super(props);
        this.state = {
            categories: [],
        };
        this.onChildToggle = this.onChildToggle.bind(this);
    }

    async componentDidMount() {
        await loadCategories(this);
        try {
            let response = await fetchImportantCategories();
            this.setState({
                importantCategories: response as ImportantCategoryDto[],
            });
        } catch (error) {
            //important categories not loaded
        }
    }

    /**
     * This is a callback function, it is invoked from UpperCategories.tsx
     * @param id - the id of the child which will be activated
     * @param name - the category name to change the global state
     */
    public onChildToggle(id, name) {
        onChildToggle(this, id, name);
    }

    public render() {
        return (
            <React.Fragment>
                <section className="blog_categorie_area">
                    {this.state.importantCategories &&
                    <div className="container">
                        <div className="row">
                            {this.state.importantCategories.map(data => {
                                return (
                                    <UpperCategory key={data.name} name={data.name}
                                                   photoName={data.photoName} id={data.name}
                                                   selected={
                                                       this.props.selections &&
                                                       this.props.selections[data.name]
                                                   }
                                                   onToggle={this.onChildToggle}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    }
                </section>
            </React.Fragment>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(UpperCategories);

