import { useContext } from 'react';
import PropTypes from 'prop-types';

import { AuthoritiesSearch } from '../../views';
import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
} from '../../context';
import { useAuthorities } from '../../queries';
import { useSortColumnManager } from '../../hooks';
import {
  searchableIndexesValues,
  searchResultListColumns,
} from '../../constants';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
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
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

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
  } = useSortColumnManager({ sortableColumns });

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
