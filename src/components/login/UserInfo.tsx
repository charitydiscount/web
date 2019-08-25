import {store} from '../../index';
import {NavigationsAction} from '../../redux/actions/NavigationsAction';
import {Stages} from '../helper/Stages';
import * as React from 'react';

class UserInfo extends React.Component {
    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.USER));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.USER));
    }

    public render() {
        return (

            <div className="product_image_area">
                <div className="container p_120">
                    <div className="row s_product_inner">
                        <div className="col-lg-4"/>
                        <div className="col-lg-4">
                            <div className="s_product_img">
                                <div className="blog_right_sidebar">
                                    <aside className="single_sidebar_widget author_widget">
                                        <img className="author_img rounded-circle" src="img/blog/author.png"
                                             alt=""/>
                                        <h4>Charlie Barber</h4>
                                        <p>Senior blog writer</p>
                                        <div className="br"></div>
                                    </aside>
                                    <aside className="single_sidebar_widget popular_post_widget">
                                        <div className="col-md-12 text-center p_05">
                                            <a href={"#"} className="btn submit_btn">Change password</a>
                                        </div>
                                        <div className="col-md-12 text-center p_05">
                                            <a href={"#"} className="btn submit_btn">Change password</a>
                                        </div>
                                        <div className="col-md-12 text-center p_05">
                                            <a href={"#"} className="btn submit_btn">Change password</a>
                                        </div>
                                    </aside>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserInfo;
