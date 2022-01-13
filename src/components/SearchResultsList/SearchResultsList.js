import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  useLocation,
  useRouteMatch,
} from 'react-router';

import { MultiColumnList } from '@folio/stripes/components';
import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';

import { AuthorityShape } from '../../constants/shapes';
import {
  searchResultListColumns,
} from '../../constants';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  hasFilters: PropTypes.bool.isRequired,
  isFilterPaneVisible: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onHeaderClick: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  sortedColumn: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  toggleFilterPane: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const authorizedTypes = ['Authorized'];

const SearchResultsList = ({
  authorities,
  totalResults,
  loading,
  loaded,
  pageSize,
  onNeedMoreData,
  visibleColumns,
  sortedColumn,
  sortOrder,
  onHeaderClick,
  isFilterPaneVisible,
  query,
  toggleFilterPane,
  hasFilters,
}) => {
  const intl = useIntl();
  const location = useLocation();
  const match = useRouteMatch();

  const columnMapping = {
    [searchResultListColumns.AUTH_REF_TYPE]: intl.formatMessage({ id: 'ui-marc-authorities.search-results-list.authRefType' }),
    [searchResultListColumns.HEADING_REF]: intl.formatMessage({ id: 'ui-marc-authorities.search-results-list.headingRef' }),
    [searchResultListColumns.HEADING_TYPE]: intl.formatMessage({ id: 'ui-marc-authorities.search-results-list.headingType' }),
  };

  const columnWidths = {
    [searchResultListColumns.AUTH_REF_TYPE]: { min: 200 },
    [searchResultListColumns.HEADING_REF]: { min: 400 },
    [searchResultListColumns.HEADING_TYPE]: { min: 200 },
  };

  const formatter = {
    authRefType: (authority) => {
      return authorizedTypes.includes(authority.authRefType)
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

  const source = useMemo(
    () => ({
      loaded: () => (hasFilters || query) && loaded,
      pending: () => loading,
      failure: () => { },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, hasFilters],
  );

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
      autosize
      isEmptyMessage={
        source ? (
          <div data-test-agreements-no-results-message>
            <SearchAndSortNoResultsMessage
              filterPaneIsVisible={isFilterPaneVisible}
              searchTerm={query || ''}
              source={source}
              toggleFilterPane={toggleFilterPane}
            />
          </div>
        ) : '...'
      }
    />
  );
};

SearchResultsList.propTypes = propTypes;

export default SearchResultsList;
