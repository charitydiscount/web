import * as React from 'react';

const DownLayout = () => {
  return (
    <footer className="footer-area section_gap">
      <div className="container">
        <div className="row footer-bottom d-flex justify-content-between align-items-center">
          <p className="col-lg-12 footer-text text-center">
            Copyright &copy;
            Made with
            <i className="fa fa-heart-o" aria-hidden="true"></i> by{' '}
            <a
              href="https://colorlib.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Colorlib
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
export default DownLayout;
