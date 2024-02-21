import {
  useContext,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
  useAuthoritiesBrowse,
} from '@folio/stripes-authority-components';
import { TitleManager } from '@folio/stripes/core';

import { AuthoritiesSearch } from '../../views';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

const PAGE_SIZE = 100;
const PRECEDING_RECORDS_COUNT = 5;

const BrowseRoute = ({ children }) => {
  const intl = useIntl();
  const {
    filters,
    searchQuery,
    searchIndex,
    setSearchQuery,
    setSearchIndex,
    searchInputValue,
    searchDropdownValue,
    setIsGoingToBaseURL,
    navigationSegmentValue,
    setBrowsePageQuery,
    browsePageQuery,
    browsePage,
    setBrowsePage,
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
    firstPageQuery,
    totalRecords,
  } = useAuthoritiesBrowse({
    filters,
    searchQuery,
    searchIndex,
    pageSize: PAGE_SIZE,
    precedingRecordsCount: PRECEDING_RECORDS_COUNT,
    setBrowsePageQuery,
    browsePageQuery,
    browsePage,
    setBrowsePage,
    navigationSegmentValue,
  });

  const onSubmitSearch = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    setSearchQuery(searchInputValue.trim());
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

  const pageTitle = useMemo(() => {
    if (searchQuery) {
      return intl.formatMessage({ id: 'ui-marc-authorities.documentTitle.browse' }, { query: searchQuery });
    }

    return intl.formatMessage({ id: 'ui-marc-authorities.meta.title' });
  }, [searchQuery, intl]);

  return (
    <TitleManager page={pageTitle}>
      <AuthoritiesSearch
        authorities={formattedAuthoritiesForView}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        totalRecords={totalRecords}
        isLoading={isLoading}
        isLoaded={isLoaded}
        query={query}
        firstPageQuery={firstPageQuery}
        pageSize={PAGE_SIZE}
        onSubmitSearch={onSubmitSearch}
        handleLoadMore={handleLoadMore}
        hidePageIndices
      >
        {children}
      </AuthoritiesSearch>
    </TitleManager>
  );
};

BrowseRoute.propTypes = propTypes;

export default BrowseRoute;
