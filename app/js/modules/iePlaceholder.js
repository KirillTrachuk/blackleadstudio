import 'styles/base.sass';
import 'styles/common/ieStyles.sass';

// if ie.html contains images, require them here
import '../../assets/img/iechrome.svg';
import '../../assets/img/iefirefox.svg';
import '../../assets/img/ieopera.svg';
import '../../assets/img/iesafari.svg';

import html from '!raw-loader!../../html/common/ie.html';

export default html;
