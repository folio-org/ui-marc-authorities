import {
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { AuthoritiesSearch } from '../../views';
import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
} from '../../context';
import { useAuthoritiesBrowse } from '../../queries';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

const PAGE_SIZE = 100;
const PRECEDING_RECORDS_COUNT = 5;

const BrowseRoute = ({ children }) => {
  const {
    filters,
    searchQuery,
    searchIndex,
    setSearchQuery,
    setSearchIndex,
    searchInputValue,
    searchDropdownValue,
    setIsGoingToBaseURL,
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const {
    authorities,
    hasNextPage,
    hasPrevPage,
    isLoading,
    isLoaded,
    handleLoadMore,
    query,
    totalRecords,
  } = useAuthoritiesBrowse({
    filters,
    searchQuery,
    searchIndex,
    pageSize: PAGE_SIZE,
    precedingRecordsCount: PRECEDING_RECORDS_COUNT,
  });

  const onSubmitSearch = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
    setIsGoingToBaseURL(true);
    setSelectedAuthorityRecordContext(null);
  };

  const formattedAuthoritiesForView = useMemo(() => {
    return authorities.map(authorityItem => {
      const authority = authorityItem.authority || {
        headingRef: authorityItem.headingRef,
      };

      return {
        ...authority,
        isAnchor: !!authorityItem.isAnchor,
        isExactMatch: !!authorityItem.authority,
      };
    });
  }, [authorities]);

  return (
    <AuthoritiesSearch
      authorities={formattedAuthoritiesForView}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      totalRecords={totalRecords}
      isLoading={isLoading}
      isLoaded={isLoaded}
      query={query}
      pageSize={PAGE_SIZE}
      onSubmitSearch={onSubmitSearch}
      handleLoadMore={handleLoadMore}
      hidePageIndices
    >
      {children}
    </AuthoritiesSearch>
  );
};

BrowseRoute.propTypes = propTypes;

export default BrowseRoute;
