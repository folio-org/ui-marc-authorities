import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

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

import { AppIcon } from '@folio/stripes/core';

import { SearchTextareaField, SearchResultsList } from '../../components';
import { useAuthorities } from '../../hooks/useAuthorities';
import { rawSearchableIndexes } from '../../constants';

import css from './AuthoritiesSearch.css';

const filterPaneVisibilityKey = '@folio/marc-authorities/marcAuthoritiesFilterPaneVisibility';

const AuthoritiesSearch = ({
  history,
  location,
}) => {
  const intl = useIntl();

  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDropdownValue, setSearchDropdownValue] = useState('');
  const [searchIndex, setSearchIndex] = useState('');

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


  const { authorities, isLoading, totalRecords } = useAuthorities({ searchQuery, searchIndex, location, history });

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
    >
      {isFilterPaneVisible &&
        <Pane
          defaultWidth="320px"
          id="pane-authorities-filters"
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
                id="input-authorities-search"
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

AuthoritiesSearch.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default AuthoritiesSearch;
