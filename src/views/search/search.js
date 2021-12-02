import PropTypes from 'prop-types';

import { Paneset } from '@folio/stripes/components';

import {
  SearchResultsList,
} from '../../components';
import { AuthorityShape } from '../../constants/shapes';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  loading: PropTypes.bool.isRequired,
  onFetchNextPage: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalRecords: PropTypes.number.isRequired,
};

const Search = ({
  authorities,
  pageSize,
  onFetchNextPage,
  children,
  loading,
  totalRecords,
}) => {
  return (
    <Paneset id="authorities-paneset">
      <SearchResultsList
        authorities={authorities}
        totalResults={totalRecords}
        pageSize={pageSize}
        onNeedMoreData={onFetchNextPage}
        loading={loading}
      />
      {children}
    </Paneset>
  );
};

Search.propTypes = propTypes;

export default Search;
