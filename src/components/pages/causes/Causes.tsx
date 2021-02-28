import * as React from 'react';
import { store } from '../../../index';
import { NavigationsAction } from '../../../redux/actions/NavigationsAction';
import { Stages } from '../../helper/Stages';
import Cause from './Cause';
import { CauseDto, fetchCauses } from '../../../rest/CauseService';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerCss } from '../../../helper/AppHelper';
import { useEffect, useState } from "react";

const Causes = () => {

    const [causes, setCauses] = useState<CauseDto[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        store.dispatch(NavigationsAction.setStageAction(Stages.CAUSES));
        populateCauses();
    }, []);

    const populateCauses = async () => {
        try {
            let response = await fetchCauses();
            setCauses(response as CauseDto[]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            //causes not loaded
        }
    }

    let causesList = causes
        ? causes.map((cause) => {
            return <Cause key={cause.id} cause={cause}/>;
        })
        : null;

    return (
        <React.Fragment>
            <FadeLoader
                loading={isLoading}
                color={'#e31f29'}
                css={spinnerCss}
            />
            {!isLoading && (
                <section className="product_description_area">
                    <div className="container">
                        <section className="hot_deals_area section_gap">
                            <div className="container-fluid">
                                <div className="row">{causesList}</div>
                            </div>
                        </section>
                    </div>
                </section>
            )}
        </React.Fragment>
    );
}

export default Causes;
