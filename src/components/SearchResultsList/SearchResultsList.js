import {
  useMemo,
  useContext,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router';
import queryString from 'query-string';

import {
  Checkbox,
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
  selectedRows: PropTypes.object.isRequired,
  sortedColumn: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  toggleFilterPane: PropTypes.func.isRequired,
  toggleRowSelection: PropTypes.func.isRequired,
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
  selectedRows,
  sortedColumn,
  sortOrder,
  onHeaderClick,
  isFilterPaneVisible,
  query,
  toggleFilterPane,
  toggleRowSelection,
  hasFilters,
  hidePageIndices,
}) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();

  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);
  const [selectedAuthorityRecordContext, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const columnMapping = {
    [searchResultListColumns.SELECT]: null,
    [searchResultListColumns.AUTH_REF_TYPE]: intl.formatMessage({ id: 'ui-marc-authorities.search-results-list.authRefType' }),
    [searchResultListColumns.HEADING_REF]: intl.formatMessage({ id: 'ui-marc-authorities.search-results-list.headingRef' }),
    [searchResultListColumns.HEADING_TYPE]: intl.formatMessage({ id: 'ui-marc-authorities.search-results-list.headingType' }),
  };

  const columnWidths = {
    [searchResultListColumns.SELECT]: { min: 30, max: 30 },
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

  useEffect(() => {
    const firstAuthority = authorities[0];
    const isDetailViewNeedsToBeOpen = navigationSegmentValue === navigationSegments.browse
      ? firstAuthority?.isAnchor && firstAuthority?.isExactMatch && totalResults === 1
      : totalResults === 1;

    if (isDetailViewNeedsToBeOpen) {
      history.push(formatAuthorityRecordLink(firstAuthority));
    }
  }, [
    totalResults,
    authorities[0],
    navigationSegmentValue,
  ]);

  const formatter = {
    // eslint-disable-next-line react/prop-types
    select: ({ id, ...rowData }) => id && (
      <div // eslint-disable-line jsx-a11y/click-events-have-key-events
        tabIndex="0"
        role="button"
        onClick={e => e.stopPropagation()}
      >
        <Checkbox
          checked={Boolean(selectedRows[id])}
          aria-label={intl.formatMessage({ id: 'ui-inventory.instances.rows.select' })}
          onChange={() => toggleRowSelection({
            id,
            ...rowData,
          })}
        />
      </div>
    ),
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
    setSelectedAuthorityRecordContext(row);
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
      selectedRow={selectedAuthorityRecordContext}
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
