import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  useLocation,
  useRouteMatch,
} from 'react-router';

import { MultiColumnList } from '@folio/stripes/components';

import { AuthorityShape } from '../../constants/shapes';
import {
  searchResultListColumns,
} from '../../constants';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  loading: PropTypes.bool,
  onHeaderClick: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  sortedColumn: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  totalResults: PropTypes.number,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const authRef = 'Auth/Ref';

const SearchResultsList = ({
  authorities,
  totalResults,
  loading,
  pageSize,
  onNeedMoreData,
  visibleColumns,
  sortedColumn,
  sortOrder,
  onHeaderClick,
}) => {
  const location = useLocation();
  const match = useRouteMatch();

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

  const rowFormatter = (row) => {
    const {
      rowIndex,
      rowClass,
      rowData,
      cells,
      rowProps,
      labelStrings,
    } = row;

    return (
      <div
        key={`row-${rowIndex}`}
      >
        <Link
          to={`${match.path}/authorities/${rowData.id}${location.search}`}
          data-label={labelStrings && labelStrings.join('...')}
          className={rowClass}
          {...rowProps}
        >
          {cells}
        </Link>
      </div>
    );
  };

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      contentData={authorities}
      formatter={formatter}
      id="authority-result-list"
      onNeedMoreData={onNeedMoreData}
      visibleColumns={visibleColumns}
      rowFormatter={rowFormatter}
      totalCount={totalResults}
      pagingType="prev-next"
      pageAmount={pageSize}
      loading={loading}
      sortedColumn={sortedColumn}
      sortOrder={sortOrder}
      onHeaderClick={onHeaderClick}
    />
  );
};

SearchResultsList.propTypes = propTypes;

export default SearchResultsList;
