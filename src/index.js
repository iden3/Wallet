import React from 'react';
import ReactDom from 'react-dom';
import Root from './views/root';

import './styles/_fonts.scss';
import './styles/_variables.scss';
import './styles/_mixins.scss';
import './styles/_app.scss';
import './styles/theme.scss';

ReactDom.render(<Root />, document.getElementById('i3-ww-root'));
