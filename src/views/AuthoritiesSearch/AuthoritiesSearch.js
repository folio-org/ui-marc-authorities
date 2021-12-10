import {
  useState,
  useEffect,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
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
  useColumnManager,
  ColumnManagerMenu,
} from '@folio/stripes/smart-components';

import {
  AppIcon,
  useNamespace,
} from '@folio/stripes/core';

import {
  SearchTextareaField,
  SearchResultsList,
  SearchFilters,
} from '../../components';
import { useAuthorities } from '../../queries';
import {
  rawSearchableIndexes,
  searchResultListColumns,
} from '../../constants';
import css from './AuthoritiesSearch.css';

const prefix = 'authorities';
const PAGE_SIZE = 10;

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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    authorities,
    isLoading,
    totalRecords,
    setOffset,
  } = useAuthorities({
    searchQuery,
    searchIndex,
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

  const renderActionMenu = () => {
    return (
      <ColumnManagerMenu
        prefix={prefix}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        columnMapping={columnMapping}
        excludeColumns={[searchResultListColumns.HEADING_REF]}
      />
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

          <SearchFilters />
        </Pane>
      }
      <Pane
        id="authority-search-results-pane"
        appIcon={<AppIcon app="marc-authorities" />}
        defaultWidth="fill"
        paneTitle={intl.formatMessage({ id: 'ui-marc-authorities.meta.title' })}
        firstMenu={renderResultsFirstMenu()}
        actionMenu={renderActionMenu}
      >
        <SearchResultsList
          authorities={authorities}
          totalResults={totalRecords}
          pageSize={PAGE_SIZE}
          onNeedMoreData={handleLoadMore}
          loading={isLoading}
          visibleColumns={visibleColumns}
        />
      </Pane>
      {children}
    </PersistedPaneset>
  );
};

AuthoritiesSearch.propTypes = propTypes;

export default AuthoritiesSearch;
