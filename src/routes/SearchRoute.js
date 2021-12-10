import PropTypes from 'prop-types';

import { AuthoritiesSearch } from '../views';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

const SearchRoute = ({ children }) => {
  return (
    <AuthoritiesSearch>
      {children}
    </AuthoritiesSearch>
  );
};

SearchRoute.propTypes = propTypes;

export default SearchRoute;
