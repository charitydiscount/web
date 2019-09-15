import * as React from "react";

class ClientsLogo extends React.Component {
    public render() {
        return (
            <section className="clients_logo_area">
                <div className="container-fluid">
                    <div className="clients_slider owl-carousel">
                        <div className="item">
                            <img src="img/clients-logo/elefant.png" alt=""/>
                        </div>
                        <div className="item">
                            <img src="img/clients-logo/noriel.jpg" alt=""/>
                        </div>
                        <div className="item">
                            <img src="img/clients-logo/2performant.png" alt=""/>
                        </div>
                        <div className="item">
                            <img src="img/clients-logo/telekom.png" alt=""/>
                        </div>
                        <div className="item">
                            <img src="img/clients-logo/cel.png" alt=""/>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


export default ClientsLogo;
