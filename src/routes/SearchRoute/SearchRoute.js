import { useContext } from 'react';
import PropTypes from 'prop-types';

import { AuthoritiesSearch } from '../../views';
import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
} from '../../context';
import { useAuthorities } from '../../queries';
import { useSortColumnManager } from '../../hooks';
import { searchableIndexesValues } from '../../constants';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

const PAGE_SIZE = 100;

const SearchRoute = ({ children }) => {
  const {
    searchQuery,
    searchIndex,
    filters,
    isExcludedSeeFromLimiter,
    advancedSearchRows,
    setSearchQuery,
    setSearchIndex,
    searchInputValue,
    searchDropdownValue,
    setIsGoingToBaseURL,
    setAdvancedSearchDefaultSearch,
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const {
    sortOrder,
    sortedColumn,
    onChangeSortOption,
    onHeaderClick,
  } = useSortColumnManager();

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
    isExcludedSeeFromLimiter,
    sortOrder,
    sortedColumn,
    pageSize: PAGE_SIZE,
  });

  const onSubmitSearch = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (searchIndex === searchableIndexesValues.ADVANCED_SEARCH) {
      setAdvancedSearchDefaultSearch({
        query: searchInputValue,
        option: searchDropdownValue,
      });
    }

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
    >
      {children}
    </AuthoritiesSearch>
  );
};

SearchRoute.propTypes = propTypes;

export default SearchRoute;
