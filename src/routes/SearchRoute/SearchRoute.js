import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
  useAuthorities,
  searchableIndexesValues,
} from '@folio/stripes-authority-components';

import { AuthoritiesSearch } from '../../views';
import { useSortColumnManager } from '../../hooks';
import {
  searchResultListColumns,
  sortOrders,
} from '../../constants';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

const PAGE_SIZE = 100;

const getInitialSortParams = searchParams => {
  const initialOrder = searchParams.sort?.[0] === '-' ? sortOrders.DES : sortOrders.ASC;

  let initialSort;

  if (!searchParams.sort) {
    initialSort = '';
  } else if (initialOrder === sortOrders.DES) {
    initialSort = searchParams.sort.substring(1);
  } else {
    initialSort = searchParams.sort;
  }

  return {
    sort: initialSort,
    order: initialOrder,
  };
};

const SearchRoute = ({ children }) => {
  const location = useLocation();
  const {
    searchQuery,
    searchIndex,
    filters,
    advancedSearchRows,
    setSearchQuery,
    setSearchIndex,
    searchInputValue,
    searchDropdownValue,
    setIsGoingToBaseURL,
    setAdvancedSearchRows,
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const searchParams = queryString.parse(location.search);
  const sortableColumns = [
    searchResultListColumns.AUTH_REF_TYPE,
    searchResultListColumns.HEADING_REF,
    searchResultListColumns.HEADING_TYPE,
  ];
  const {
    sortOrder,
    sortedColumn,
    onChangeSortOption,
    onHeaderClick,
  } = useSortColumnManager({
    sortableColumns,
    initialParams: getInitialSortParams(searchParams),
  });

  const isAdvancedSearch = searchIndex === searchableIndexesValues.ADVANCED_SEARCH;

  const {
    authorities,
    isLoading,
    isLoaded,
    totalRecords,
    setOffset,
    query,
  } = useAuthorities({
    searchQuery,
    searchIndex,
    advancedSearch: advancedSearchRows,
    isAdvancedSearch,
    filters,
    sortOrder,
    sortedColumn,
    pageSize: PAGE_SIZE,
  });

  const onSubmitSearch = (e, advancedSearchRowState) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    setAdvancedSearchRows(advancedSearchRowState);
    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
    setIsGoingToBaseURL(true);
    setSelectedAuthorityRecordContext(null);
  };

  const handleLoadMore = (_pageAmount, offset) => {
    setOffset(offset);
  };

  return (
    <AuthoritiesSearch
      authorities={authorities}
      isLoading={isLoading}
      isLoaded={isLoaded}
      totalRecords={totalRecords}
      query={query}
      pageSize={PAGE_SIZE}
      onChangeSortOption={onChangeSortOption}
      onHeaderClick={onHeaderClick}
      onSubmitSearch={onSubmitSearch}
      handleLoadMore={handleLoadMore}
      sortOrder={sortOrder}
      sortedColumn={sortedColumn}
    >
      {children}
    </AuthoritiesSearch>
  );
};

SearchRoute.propTypes = propTypes;

export default SearchRoute;
