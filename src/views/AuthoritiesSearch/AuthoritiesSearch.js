import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import {
  useLocalStorage,
  writeStorage,
} from '@rehooks/local-storage';

import {
  Button,
  Icon,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';

import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  PersistedPaneset,
} from '@folio/stripes/smart-components';

import {
  AppIcon,
  useNamespace,
} from '@folio/stripes/core';

import {
  AcqDateRangeFilter,
  buildFiltersObj,
} from '@folio/stripes-acq-components';

import {
  SearchTextareaField,
  SearchResultsList,
} from '../../components';
import { useAuthorities } from '../../hooks/useAuthorities';
import { rawSearchableIndexes } from '../../constants';

import css from './AuthoritiesSearch.css';

const DATE_FORMAT = 'YYYY-MM-DD';

const AuthoritiesSearch = () => {
  const intl = useIntl();
  const [, getNamespace] = useNamespace();

  const history = useHistory();
  const location = useLocation();

  const filterPaneVisibilityKey = getNamespace({ key: 'marcAuthoritiesFilterPaneVisibility' });

  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [searchDropdownValue, setSearchDropdownValue] = useState('');
  const [searchIndex, setSearchIndex] = useState('');

  const [filters, setFilters] = useState({});

  const locationSearchParams = queryString.parse(location.search);

  useEffect(() => {
    if (Object.keys(locationSearchParams).length > 0) {
      if (locationSearchParams.query && locationSearchParams.query !== searchQuery) {
        setSearchInputValue(locationSearchParams.query);
        setSearchQuery(locationSearchParams.query);
      }

      if (locationSearchParams.qindex && locationSearchParams.qindex !== searchIndex) {
        setSearchDropdownValue(locationSearchParams.qindex);
        setSearchIndex(locationSearchParams.qindex);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { authorities, isLoading, totalRecords } = useAuthorities({
    searchQuery,
    searchIndex,
    filters,
  });

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(storedFilterPaneVisibility);

  const toggleFilterPane = () => {
    setIsFilterPaneVisible(!isFilterPaneVisible);
    writeStorage(filterPaneVisibilityKey, !isFilterPaneVisible);
  };

  const onChangeIndex = (value) => setSearchDropdownValue(value);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
  };

  const updateSearchValue = (value) => setSearchInputValue(value);

  const resetAll = () => {
    setSearchInputValue('');
    setSearchDropdownValue('');

    history.replace({
      pathname: location.pathname,
    });
  };

  const pageSize = 15;

  const onFetchNextPage = () => {};

  const applyFilters = ({ name, values }) => {
    setFilters(currentFilters => {
      return {
        ...currentFilters,
        [name]: values,
      };
    });
  };

  const activeFilters = useMemo(() => buildFiltersObj(location.search), [location.search]);

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

  const searchableIndexes = rawSearchableIndexes.map(index => ({
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

          <AcqDateRangeFilter
            activeFilters={activeFilters?.updatedDate}
            labelId="ui-marc-authorities.updatedDate"
            id="updatedDate"
            name="updatedDate"
            onChange={applyFilters}
            disabled={isLoading}
            closedByDefault
            dateFormat={DATE_FORMAT}
          />
        </Pane>
      }
      <Pane
        id="authority-search-results-pane"
        appIcon={<AppIcon app="marc-authorities" />}
        defaultWidth="fill"
        paneTitle={intl.formatMessage({ id: 'ui-marc-authorities.meta.title' })}
        firstMenu={renderResultsFirstMenu()}
      >
        <SearchResultsList
          authorities={authorities}
          totalResults={totalRecords}
          pageSize={pageSize}
          onNeedMoreData={onFetchNextPage}
        />
      </Pane>
    </PersistedPaneset>
  );
};

export default AuthoritiesSearch;
