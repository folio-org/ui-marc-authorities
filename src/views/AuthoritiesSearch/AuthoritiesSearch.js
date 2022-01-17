import {
  useState,
  useEffect,
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
  AdvancedSearch,
  Row,
  Col,
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
  SearchTextareaField,
  SearchResultsList,
  SearchFilters,
} from '../../components';
import { useAuthorities } from '../../queries';
import { useSortColumnManager } from '../../hooks';
import {
  searchableIndexesValues,
  rawSearchableIndexes,
  advancedSearchIndexes,
  searchResultListColumns,
  sortOrders,
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
  const [searchIndex, setSearchIndex] = useState(searchableIndexesValues.KEYWORD);
  const [advancedSearchDefaultSearch, setAdvancedSearchDefaultSearch] = useState();
  const [advancedSearchRows, setAdvancedSearchRows] = useState([]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  const nonFilterUrlParams = ['query', 'qindex', 'excludeSeeFrom', 'sort'];

  const getInitialFilters = () => {
    return omit(buildFiltersObj(location.search), nonFilterUrlParams);
  };

  const [filters, setFilters] = useState(getInitialFilters());

  const [isExcludedSeeFromLimiter, setIsExcludedSeeFromLimiter] = useState(false);

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

    let newSearchInputValue = '';
    let newSearchQuery = '';
    let newSearchDropdownValue = '';
    let newSearchIndex = '';

    if (Object.keys(locationSearchParams).length > 0) {
      if (locationSearchParams.query && locationSearchParams.query !== searchQuery) {
        newSearchInputValue = locationSearchParams.query;
        newSearchQuery = locationSearchParams.query;
      }

      if (locationSearchParams.qindex && locationSearchParams.qindex !== searchIndex) {
        newSearchDropdownValue = locationSearchParams.qindex;
        newSearchIndex = locationSearchParams.qindex;
      }

      setSearchInputValue(newSearchInputValue);
      setSearchQuery(newSearchQuery);
      setSearchDropdownValue(newSearchDropdownValue);
      setSearchIndex(newSearchIndex);
      setAdvancedSearchDefaultSearch({
        query: newSearchInputValue,
        option: newSearchDropdownValue,
      });

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
    isExcludedSeeFromLimiter,
    sortOrder,
    sortedColumn,
  ]);

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

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(storedFilterPaneVisibility);

  const toggleFilterPane = () => {
    setIsFilterPaneVisible(!isFilterPaneVisible);
    writeStorage(filterPaneVisibilityKey, !isFilterPaneVisible);
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

  const updateSearchValue = (value) => {
    setSearchInputValue(value);
    setAdvancedSearchDefaultSearch({
      query: value,
      option: searchDropdownValue,
    });
  };

  const resetAll = () => {
    setSearchInputValue('');
    setSearchDropdownValue('');
    setSearchQuery('');
    setSearchIndex('');
    setFilters('');
    setIsExcludedSeeFromLimiter(false);
    setAdvancedSearchDefaultSearch(null);
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

  const handleAdvancedSearch = (searchString, searchRows) => {
    setSearchDropdownValue(searchableIndexesValues.ADVANCED_SEARCH);
    setSearchIndex(searchableIndexesValues.ADVANCED_SEARCH);
    setSearchInputValue(searchString);
    setSearchQuery(searchString);
    setAdvancedSearchRows(searchRows);
    setIsAdvancedSearchOpen(false);
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

  const searchableIndexes = rawSearchableIndexes.map(index => ({
    label: intl.formatMessage({ id: index.label }),
    value: index.value,
  }));
  const advancedSearchOptions = advancedSearchIndexes.map(index => ({
    label: intl.formatMessage({ id: index.label }),
    value: index.value,
  }));

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
            <div className={css.searchGroupWrap}>
              <SearchTextareaField
                value={searchInputValue}
                onChange={(e) => updateSearchValue(e.target.value)}
                autoFocus
                rows="1"
                name="query"
                id="textarea-authorities-search"
                className={css.searchField}
                searchableIndexes={searchableIndexes}
                onChangeIndex={(e) => onChangeIndex(e.target.value)}
                selectedIndex={searchDropdownValue}
                onSubmitSearch={onSubmitSearch}
              />
              <Button
                id="submit-authorities-search"
                type="submit"
                buttonStyle="primary"
                fullWidth
                marginBottom0
                disabled={!searchInputValue || isLoading}
              >
                {intl.formatMessage({ id: 'ui-marc-authorities.label.search' })}
              </Button>
            </div>
            <AdvancedSearch
              open={isAdvancedSearchOpen}
              searchOptions={advancedSearchOptions}
              defaultSearchOptionValue={searchableIndexesValues.KEYWORD}
              firstRowInitialSearch={advancedSearchDefaultSearch}
              onSearch={handleAdvancedSearch}
              onCancel={() => setIsAdvancedSearchOpen(false)}
            >
              {({ resetRows }) => (
                <Row between="xs">
                  <Col xs="12" sm="6">
                    <Button
                      buttonStyle="none"
                      id="clickable-reset-all"
                      fullWidth
                      disabled={!searchInputValue || isLoading}
                      onClick={() => {
                        resetRows();
                        resetAll();
                      }}
                    >
                      <Icon icon="times-circle-solid">
                        {intl.formatMessage({ id: 'stripes-smart-components.resetAll' })}
                      </Icon>
                    </Button>
                  </Col>
                  <Col xs="12" sm="6">
                    <Button
                      fullWidth
                      onClick={() => setIsAdvancedSearchOpen(true)}
                    >
                      {intl.formatMessage({ id: 'stripes-components.advancedSearch.button' })}
                    </Button>
                  </Col>
                </Row>
              )}
            </AdvancedSearch>
          </form>

          <SearchFilters
            activeFilters={filters}
            isSearching={isLoading}
            setFilters={setFilters}
            query={query}
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
