import * as React from "react";

const ClientsLogo = () => {
    return (
        <section className="clients_logo_area">
            <div className="container-fluid">
                <div className="clients_slider owl-carousel">
                    <div className="item">
                        <img src="img/clients-logo/c-logo-1.png" alt=""/>
                    </div>
                    <div className="item">
                        <img src="img/clients-logo/c-logo-2.png" alt=""/>
                    </div>
                    <div className="item">
                        <img src="img/clients-logo/c-logo-3.png" alt=""/>
                    </div>
                    <div className="item">
                        <img src="img/clients-logo/c-logo-4.png" alt=""/>
                    </div>
                    <div className="item">
                        <img src="img/clients-logo/c-logo-5.png" alt=""/>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default ClientsLogo;
