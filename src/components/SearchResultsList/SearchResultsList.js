import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import { AuthorityShape } from '../../constants/shapes';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  loading: PropTypes.bool,
  onNeedMoreData: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalResults: PropTypes.number,
};

const authRef = 'Auth/Ref';

const searchResultListColumns = {
  AUTH_REF_TYPE: 'authRefType',
  HEADING_REF: 'headingRef',
  HEADING_TYPE: 'headingType',
};

const SearchResultsList = ({
  authorities,
  totalResults,
  loading,
  pageSize,
  onNeedMoreData,
}) => {
  const columnMapping = {
    [searchResultListColumns.AUTH_REF_TYPE]: <FormattedMessage id="ui-marc-authorities.search-results-list.authRefType" />,
    [searchResultListColumns.HEADING_REF]: <FormattedMessage id="ui-marc-authorities.search-results-list.headingRef" />,
    [searchResultListColumns.HEADING_TYPE]: <FormattedMessage id="ui-marc-authorities.search-results-list.headingType" />,
  };
  const columnWidths = {
    [searchResultListColumns.AUTH_REF_TYPE]: '25%',
    [searchResultListColumns.HEADING_REF]: '40%',
    [searchResultListColumns.HEADING_TYPE]: '35%',
  };
  const formatter = {
    authRefType: (authority) => {
      return authority.authRefType === authRef
        ? <b>{authority.authRefType}</b>
        : authority.authRefType;
    },
  };
  const visibleColumns = [
    searchResultListColumns.AUTH_REF_TYPE,
    searchResultListColumns.HEADING_REF,
    searchResultListColumns.HEADING_TYPE,
  ];

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      contentData={authorities}
      formatter={formatter}
      id="authority-result-list"
      onNeedMoreData={onNeedMoreData}
      visibleColumns={visibleColumns}
      totalCount={totalResults}
      pagingType="prev-next"
      pageAmount={pageSize}
      loading={loading}
    />
  );
};

SearchResultsList.propTypes = propTypes;

export default SearchResultsList;
