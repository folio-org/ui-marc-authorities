import { useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
  useAuthorities,
  searchableIndexesValues,
  searchResultListColumns,
} from '@folio/stripes-authority-components';
import { TitleManager } from '@folio/stripes/core';

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
  const intl = useIntl();
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
    <TitleManager page={intl.formatMessage({ id: 'ui-marc-authorities.documentTitle.search' }, { query: searchQuery })}>
      <AuthoritiesSearch
        authorities={authorities}
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
    </TitleManager>
  );
};

SearchRoute.propTypes = propTypes;

export default SearchRoute;
