import * as React from 'react';
import {emptyHrefLink} from "../../helper/Constants";

const FooterLayout = () => {
  return (
    <footer className="footer-area section_gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-3  col-md-6 col-sm-6">
            <div className="single-footer-widget">

            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="single-footer-widget">
              <h6 className="footer_title">Get it on mobile</h6>
              <img src={"img/mobile/app-store-badge.svg"} height={40} width={135} alt={''}/>
              <img src={"img/mobile/google-play-badge.svg"} height={40} width={135} alt={''}/>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="single-footer-widget f_social_wd">
              <h6 className="footer_title">Follow Us</h6>
              <p>Let us be social</p>
              <div className="f_social">
                <a href="#">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="#">
                  <i className="fa fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 col-sm-6">
            <div className="single-footer-widget f_social_wd">
            </div>
          </div>
        </div>

        <div className="row footer-bottom d-flex justify-content-between align-items-center">
          <p className="col-lg-12 footer-text text-center">
            Copyright &copy;
            <a href={emptyHrefLink}>
               CharityDiscount
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
export default FooterLayout;
