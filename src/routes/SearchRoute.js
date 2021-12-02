import { stripesConnect } from '@folio/stripes/core';
import PropTypes from 'prop-types';

import { AuthoritiesSearch } from '../views';

const propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

const SearchRoute = (props) => {
  return (
    <AuthoritiesSearch {...props} />
  );
};

SearchRoute.propTypes = propTypes;

export default stripesConnect(SearchRoute);
