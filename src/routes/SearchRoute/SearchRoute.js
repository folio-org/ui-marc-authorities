import { useContext } from 'react';
import PropTypes from 'prop-types';

import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
  useAuthorities,
  searchableIndexesValues,
  searchResultListColumns,
} from '@folio/stripes-authority-components';

import { AuthoritiesSearch } from '../../views';
import { useSortColumnManager } from '../../hooks';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

const PAGE_SIZE = 100;

const SearchRoute = ({ children }) => {
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
    navigationSegmentValue,
    offset,
    setOffset,
    sortOrder,
    sortedColumn,
    setSortOrder,
    setSortedColumn,
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const sortableColumns = [
    searchResultListColumns.AUTH_REF_TYPE,
    searchResultListColumns.HEADING_REF,
    searchResultListColumns.HEADING_TYPE,
  ];
  const {
    onHeaderClick,
  } = useSortColumnManager({
    sortOrder,
    sortedColumn,
    setSortOrder,
    setSortedColumn,
    sortableColumns,
  });

  const isAdvancedSearch = searchIndex === searchableIndexesValues.ADVANCED_SEARCH;

  const {
    authorities,
    isLoading,
    isLoaded,
    totalRecords,
    query,
    error,
  } = useAuthorities({
    searchQuery,
    searchIndex,
    advancedSearch: advancedSearchRows,
    isAdvancedSearch,
    filters,
    sortOrder,
    sortedColumn,
    pageSize: PAGE_SIZE,
    offset,
    setOffset,
    navigationSegmentValue,
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

  const handleLoadMore = (_pageAmount, _offset) => {
    setOffset(_offset);
  };

  return (
    <AuthoritiesSearch
      authorities={authorities}
      error={error}
      isLoading={isLoading}
      isLoaded={isLoaded}
      totalRecords={totalRecords}
      query={query}
      pageSize={PAGE_SIZE}
      onHeaderClick={onHeaderClick}
      onSubmitSearch={onSubmitSearch}
      handleLoadMore={handleLoadMore}
    >
      {children}
    </AuthoritiesSearch>
  );
};

SearchRoute.propTypes = propTypes;

export default SearchRoute;
