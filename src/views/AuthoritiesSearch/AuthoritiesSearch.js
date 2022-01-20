import {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  useLocalStorage,
  writeStorage,
} from '@rehooks/local-storage';
import omit from 'lodash/omit';

import {
  Button,
  Icon,
  Pane,
  PaneMenu,
  MenuSection,
  Select,
} from '@folio/stripes/components';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  PersistedPaneset,
  useColumnManager,
  ColumnManagerMenu,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  useNamespace,
} from '@folio/stripes/core';
import {
  buildFiltersObj,
  buildSearch,
} from '@folio/stripes-acq-components';

import {
  FilterNavigation,
  SearchTextareaField,
  SearchResultsList,
  SearchFilters,
} from '../../components';
import { useAuthorities } from '../../queries';
import { useSortColumnManager } from '../../hooks';
import {
  rawDefaultSearchableIndexes,
  rawBrowseSearchableIndexes,
  searchResultListColumns,
  sortOrders,
  navigationSegments,
} from '../../constants';
import css from './AuthoritiesSearch.css';

const prefix = 'authorities';
const PAGE_SIZE = 100;

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

const AuthoritiesSearch = ({ children }) => {
  const intl = useIntl();
  const [, getNamespace] = useNamespace();

  const history = useHistory();
  const location = useLocation();

  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [searchDropdownValue, setSearchDropdownValue] = useState('');
  const [searchIndex, setSearchIndex] = useState('');

  const nonFilterUrlParams = ['query', 'qindex', 'segment', 'excludeSeeFrom', 'sort'];

  const getInitialFilters = () => {
    return omit(buildFiltersObj(location.search), nonFilterUrlParams);
  };

  const [filters, setFilters] = useState(getInitialFilters());

  const [navigationSegmentValue, setNavigationSegmentValue] = useState('');

  const [isExcludedSeeFromLimiter, setIsExcludedSeeFromLimiter] = useState(false);

  const searchInputRef = useRef(null);

  const columnMapping = {
    [searchResultListColumns.AUTH_REF_TYPE]: <FormattedMessage id="ui-marc-authorities.search-results-list.authRefType" />,
    [searchResultListColumns.HEADING_REF]: <FormattedMessage id="ui-marc-authorities.search-results-list.headingRef" />,
    [searchResultListColumns.HEADING_TYPE]: <FormattedMessage id="ui-marc-authorities.search-results-list.headingType" />,
  };
  const {
    visibleColumns,
    toggleColumn,
  } = useColumnManager(prefix, columnMapping);

  const filterPaneVisibilityKey = getNamespace({ key: 'marcAuthoritiesFilterPaneVisibility' });

  const {
    sortOrder,
    sortedColumn,
    onChangeSortOption,
    onHeaderClick,
  } = useSortColumnManager();

  useEffect(() => {
    const locationSearchParams = queryString.parse(location.search);

    if (Object.keys(locationSearchParams).length > 0) {
      if (locationSearchParams.query && locationSearchParams.query !== searchQuery) {
        setSearchInputValue(locationSearchParams.query);
        setSearchQuery(locationSearchParams.query);
      }

      if (locationSearchParams.qindex && locationSearchParams.qindex !== searchIndex) {
        setSearchDropdownValue(locationSearchParams.qindex);
        setSearchIndex(locationSearchParams.qindex);
      }

      if (locationSearchParams.segment && locationSearchParams.segment !== navigationSegmentValue) {
        setNavigationSegmentValue(locationSearchParams.segment);
      }

      if (locationSearchParams.excludeSeeFrom) {
        setIsExcludedSeeFromLimiter(locationSearchParams.excludeSeeFrom);
      }

      if (locationSearchParams.sort) {
        if (locationSearchParams.sort[0] === '-') {
          onChangeSortOption(locationSearchParams.sort.substring(1), sortOrders.DES);
        } else {
          onChangeSortOption(locationSearchParams.sort, sortOrders.ASC);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const queryParams = {
      query: searchQuery,
      qindex: searchIndex,
      ...filters,
    };

    if (navigationSegmentValue) {
      queryParams.segment = navigationSegmentValue;
    }

    if (isExcludedSeeFromLimiter) {
      queryParams.excludeSeeFrom = isExcludedSeeFromLimiter;
    }

    if (sortOrder && sortedColumn) {
      const order = sortOrder === sortOrders.ASC ? '' : '-';

      queryParams.sort = `${order}${sortedColumn}`;
    }

    const searchString = `${buildSearch(queryParams)}`;

    history.replace({
      pathname: '/marc-authorities',
      search: searchString,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    searchIndex,
    filters,
    navigationSegmentValue,
    isExcludedSeeFromLimiter,
    sortOrder,
    sortedColumn,
  ]);

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
    filters,
    isExcludedSeeFromLimiter,
    sortOrder,
    sortedColumn,
    pageSize: PAGE_SIZE,
  });

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(storedFilterPaneVisibility);

  const toggleFilterPane = () => {
    setIsFilterPaneVisible(!isFilterPaneVisible);
    writeStorage(filterPaneVisibilityKey, !isFilterPaneVisible);
  };

  const setSearchInputRef = element => {
    searchInputRef.current = element;
  };

  const handleFilterNavigationChange = () => {
    setNavigationSegmentValue(currentSegment => {
      const isNavigationSegment = currentSegment !== '';

      return isNavigationSegment && currentSegment === navigationSegments.browse
        ? navigationSegments.search
        : navigationSegments.browse;
    });

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const onChangeIndex = (value) => setSearchDropdownValue(value);

  const onSubmitSearch = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
  };

  const updateSearchValue = (value) => setSearchInputValue(value);

  const resetAll = () => {
    setSearchInputValue('');
    setSearchDropdownValue('');
    setSearchQuery('');
    setSearchIndex('');
    setFilters('');
    setNavigationSegmentValue('');
    setIsExcludedSeeFromLimiter(false);
    onChangeSortOption('');
  };

  const applyExcludeSeeFromLimiter = () => {
    setIsExcludedSeeFromLimiter(isExcluded => !isExcluded);
  };

  const handleLoadMore = (_pageAmount, offset) => {
    setOffset(offset);
  };

  const renderResultsFirstMenu = () => {
    if (isFilterPaneVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  const options = Object.values(searchResultListColumns).map((option) => ({
    value: option,
    label: intl.formatMessage({ id: `ui-marc-authorities.search-results-list.${option}` }),
  }));

  const sortByOptions = [
    {
      value: '',
      label: intl.formatMessage({ id: 'ui-marc-authorities.actions.menuSection.sortBy.relevance' }),
    },
    ...options,
  ];

  const renderActionMenu = () => {
    return (
      <>
        <MenuSection
          data-testid="menu-section-sort-by"
          label={intl.formatMessage({ id: 'ui-marc-authorities.actions.menuSection.sortBy' })}
        >
          <Select
            data-testid="sort-by-selection"
            dataOptions={sortByOptions}
            value={sortedColumn}
            onChange={e => onChangeSortOption(e.target.value)}
          />
        </MenuSection>
        <ColumnManagerMenu
          prefix={prefix}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
          columnMapping={columnMapping}
          excludeColumns={[searchResultListColumns.HEADING_REF]}
        />
      </>
    );
  };

  const rawSearchableIndexes = navigationSegmentValue === navigationSegments.browse
    ? rawBrowseSearchableIndexes
    : rawDefaultSearchableIndexes;

  const searchableIndexes = rawSearchableIndexes.map(index => ({
    label: intl.formatMessage({ id: index.label }),
    value: index.value,
  }));

  const isSearchButtonDisabled = (navigationSegmentValue === navigationSegments.browse && !searchDropdownValue)
    || !searchInputValue
    || isLoading;

  return (
    <PersistedPaneset
      appId="@folio/marc-authorities"
      id="marc-authorities-paneset"
      data-testid="marc-authorities-paneset"
    >
      {isFilterPaneVisible &&
        <Pane
          defaultWidth="320px"
          id="pane-authorities-filters"
          data-testid="pane-authorities-filters"
          fluidContentWidth
          paneTitle={intl.formatMessage({ id: 'ui-marc-authorities.search.searchAndFilter' })}
          lastMenu={(
            <PaneMenu>
              <CollapseFilterPaneButton onClick={toggleFilterPane} />
            </PaneMenu>
          )}
        >
          <form onSubmit={onSubmitSearch}>
            <FilterNavigation
              segment={navigationSegmentValue || undefined}
              onChange={handleFilterNavigationChange}
            />
            <div className={css.searchGroupWrap}>
              <SearchTextareaField
                value={searchInputValue}
                onChange={(e) => updateSearchValue(e.target.value)}
                inputRef={setSearchInputRef}
                autoFocus
                rows="1"
                name="query"
                id="textarea-authorities-search"
                className={css.searchField}
                searchableIndexes={searchableIndexes}
                placeholder={navigationSegmentValue === navigationSegments.browse ? 'None' : ''}
                onChangeIndex={(e) => onChangeIndex(e.target.value)}
                selectedIndex={searchDropdownValue}
                onSubmitSearch={onSubmitSearch}
              />
              <Button
                id="submit-authorities-search"
                data-testid="submit-authorities-search"
                type="submit"
                buttonStyle="primary"
                fullWidth
                marginBottom0
                disabled={isSearchButtonDisabled}
              >
                {intl.formatMessage({ id: 'ui-marc-authorities.label.search' })}
              </Button>
            </div>
            <Button
              buttonStyle="none"
              id="clickable-reset-all"
              disabled={!searchInputValue || isLoading}
              onClick={resetAll}
            >
              <Icon icon="times-circle-solid">
                {intl.formatMessage({ id: 'stripes-smart-components.resetAll' })}
              </Icon>
            </Button>
          </form>

          <SearchFilters
            activeFilters={filters}
            isSearching={isLoading}
            setFilters={setFilters}
            query={query}
            segment={navigationSegmentValue || navigationSegments.search}
            isExcludedSeeFromLimiter={isExcludedSeeFromLimiter}
            setIsExcludedSeeFromLimiter={setIsExcludedSeeFromLimiter}
            applyExcludeSeeFromLimiter={applyExcludeSeeFromLimiter}
          />
        </Pane>
      }
      <Pane
        id="authority-search-results-pane"
        appIcon={<AppIcon app="marc-authorities" />}
        defaultWidth="fill"
        paneTitle={intl.formatMessage({ id: 'ui-marc-authorities.meta.title' })}
        paneSub={(
          intl.formatMessage({
            id: 'ui-marc-authorities.search-results-list.paneSub',
          }, {
            totalRecords,
          })
        )}
        firstMenu={renderResultsFirstMenu()}
        actionMenu={renderActionMenu}
        padContent={false}
        noOverflow
      >
        <SearchResultsList
          authorities={authorities}
          totalResults={totalRecords}
          pageSize={PAGE_SIZE}
          onNeedMoreData={handleLoadMore}
          loading={isLoading}
          loaded={isLoaded}
          visibleColumns={visibleColumns}
          sortedColumn={sortedColumn}
          sortOrder={sortOrder}
          onHeaderClick={onHeaderClick}
          isFilterPaneVisible={isFilterPaneVisible}
          toggleFilterPane={toggleFilterPane}
          hasFilters={!!filters.length}
          query={searchQuery}
        />
      </Pane>
      {children}
    </PersistedPaneset>
  );
};

AuthoritiesSearch.propTypes = propTypes;

export default AuthoritiesSearch;
