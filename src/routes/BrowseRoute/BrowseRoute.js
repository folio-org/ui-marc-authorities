import {
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { AuthoritiesSearch } from '../../views';
import { AuthoritiesSearchContext } from '../../context';
import { useAuthoritiesBrowse } from '../../queries';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

const PAGE_SIZE = 100;
const PRECEDING_RECORDS_COUNT = 5;

const BrowseRoute = ({ children }) => {
  const {
    searchQuery,
    searchIndex,
    isExcludedSeeFromLimiter,
    setSearchQuery,
    setSearchIndex,
    searchInputValue,
    searchDropdownValue,
  } = useContext(AuthoritiesSearchContext);

  const {
    authorities,
    isLoading,
    isLoaded,
    handleLoadMore,
    query,
    totalRecords,
  } = useAuthoritiesBrowse({
    searchQuery,
    searchIndex,
    isExcludedSeeFromLimiter,
    pageSize: PAGE_SIZE,
    precedingRecordsCount: PRECEDING_RECORDS_COUNT,
  });

  const onSubmitSearch = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
  };

  const formattedAuthoritiesForView = useMemo(() => {
    return authorities.map(authorityItem => {
      const authority = authorityItem.authority || {
        headingRef: authorityItem.headingRef,
      };

      return {
        ...authority,
        isAnchor: authorityItem.isAnchor,
      };
    });
  }, [authorities]);

  return (
    <AuthoritiesSearch
      authorities={formattedAuthoritiesForView}
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
