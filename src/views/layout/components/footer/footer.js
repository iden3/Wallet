import React, { PureComponent } from 'react';
import {
  Icon,
  Footer as FooterCmpt,
} from 'base_components';

import './footer.scss';

class Footer extends PureComponent {
  render() {
    return (
      <FooterCmpt className="i3-ww-footer" target="_blank" rel="noopener noreferrer">
        <div className="i3-ww-footer__icons">
          <a href="https://github.com/iden3">
            <Icon type="github" />
          </a>
          <a href="https://twitter.com/identhree" target="_blank" rel="noopener noreferrer">
            <Icon type="twitter" />
          </a>
        </div>
        <div className="i3-ww-footer__links">
          <a href="https://iden3.io" target="_blank" rel="noopener noreferrer">
            Contact
          </a>
        </div>
      </FooterCmpt>
    );
  }
}

export default Footer;
