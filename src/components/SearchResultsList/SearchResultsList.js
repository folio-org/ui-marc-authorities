import {
  useMemo,
  useContext,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router';
import queryString from 'query-string';
import { differenceBy } from 'lodash';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import filter from 'lodash/filter';
import pick from 'lodash/pick';

import {
  MultiColumnList,
  TextLink,
  Icon,
} from '@folio/stripes/components';
import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';

import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
} from '../../context';

import { AuthorityShape } from '../../constants/shapes';
import {
  navigationSegments,
  searchResultListColumns,
} from '../../constants';

import css from './SearchResultsList.css';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  hasFilters: PropTypes.bool.isRequired,
  hidePageIndices: PropTypes.bool,
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
  hidePageIndices,
}) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const prevAuthorities = useRef();

  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);
  const [selectedAuthorityRecord, setSelectedAuthorityRecord] = useContext(SelectedAuthorityRecordContext);

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

  const formatAuthorityRecordLink = (authority) => {
    const search = queryString.parse(location.search);
    const newSearch = queryString.stringify({
      ...search,
      headingRef: authority.headingRef,
      authRefType: authority.authRefType,
    });

    return `${match.path}/authorities/${authority.id}?${newSearch}`;
  };

  const redirectToAuthorityRecord = (authority) => {
    history.push(formatAuthorityRecordLink(authority));
  };

  const areRecordsEqual = (a, b) => {
    const comparedProperties = ['authRefType', 'headingRef', 'id', 'headingType'];

    return isEqual(pick(a, comparedProperties), pick(b, comparedProperties));
  };

  const findRecordToHighlight = () => {
    // first we have to check that there still exists a record that exactly matches what we have in context
    // is it exists - that means that edited fields were not related to Heading/Ref
    const exactMatchExists = !!authorities.find(authority => areRecordsEqual(authority, selectedAuthorityRecord));

    if (exactMatchExists) {
      return;
    }

    // if exact match doesn't exist we have to search for a record which Heading/Ref changed after editing
    // this `difference` will remove all records whose Heading/Ref did not change
    // and we're left with records whose Heading/Ref changed
    const diff = differenceBy(filter(authorities, (val) => !isNil(val)), prevAuthorities.current, 'headingRef');

    if (diff.length === 1) {
      setSelectedAuthorityRecord(diff[0]);
      redirectToAuthorityRecord(diff[0]);
    }
  };

  useEffect(() => {
    if (totalResults !== 1) {
      return;
    }

    const firstAuthority = authorities[0];
    const isDetailViewNeedsToBeOpen = navigationSegmentValue === navigationSegments.browse
      ? firstAuthority?.isAnchor && firstAuthority?.isExactMatch
      : true;

    if (isDetailViewNeedsToBeOpen) {
      redirectToAuthorityRecord(firstAuthority);
    }
  }, [totalResults, authorities, navigationSegmentValue]);

  useEffect(() => {
    if (prevAuthorities.current === authorities) {
      return;
    }

    findRecordToHighlight();
  }, [authorities]);

  useEffect(() => {
    prevAuthorities.current = authorities;
  }, [authorities]);

  const formatter = {
    authRefType: (authority) => {
      return authorizedTypes.includes(authority.authRefType)
        ? <b>{authority.authRefType}</b>
        : authority.authRefType;
    },
    headingRef: (authority) => (
      authority.isAnchor && !authority.isExactMatch
        ? (
          <Icon
            icon="exclamation-circle"
            status="error"
            iconRootClass={css.anchorLink}
          >
            {authority.headingRef}
            &nbsp;
            <span className={css.browseNoMatchText}>
              {intl.formatMessage({ id: 'ui-marc-authorities.browse.noMatch.wouldBeHereLabel' })}
            </span>
          </Icon>
        )
        : (
          <TextLink
            className={authority.isAnchor ? css.anchorLink : undefined}
            to={formatAuthorityRecordLink(authority)}
          >
            {authority.headingRef}
          </TextLink>
        )
    ),
  };

  const onRowClick = (e, row) => {
    setSelectedAuthorityRecord(row);
  };

  const checkIsRowSelected = ({ item, criteria }) => {
    return areRecordsEqual(item, criteria);
  };

  const source = useMemo(
    () => ({
      loaded: () => (hasFilters || query) && loaded,
      pending: () => loading,
      failure: () => null,
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
      selectedRow={selectedAuthorityRecord}
      isSelected={checkIsRowSelected}
      onRowClick={onRowClick}
      totalCount={totalResults}
      pagingType="prev-next"
      pageAmount={pageSize}
      loading={loading}
      sortedColumn={sortedColumn}
      sortOrder={sortOrder}
      onHeaderClick={onHeaderClick}
      autosize
      hidePageIndices={hidePageIndices}
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
