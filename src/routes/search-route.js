import { stripesConnect } from '@folio/stripes/core';
import PropTypes from 'prop-types';

import { useAuthorities } from '../hooks/useAuthorities';
import { AuthoritiesSearch } from '../views';

const propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

const SearchRoute = (props) => {
  const { query, authorities, isLoading, totalRecords } = useAuthorities();

  return (
    <AuthoritiesSearch
      query={query}
      authorities={authorities}
      isLoading={isLoading}
      totalRecords={totalRecords}
      {...props}
    />
  );
};

SearchRoute.propTypes = propTypes;

SearchRoute.manifest = Object.freeze({
  records: {
    type: 'okapi',
    records: null,
    path: 'search/authorities',
    perRequest: 100,
  },
});

export default stripesConnect(SearchRoute);
