import {
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import {
  Button,
  Icon,
  AdvancedSearch,
  Row,
  Col,
} from '@folio/stripes/components';

import {
  SearchTextareaField,
  FilterNavigation,
} from '../';
import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
} from '../../context';
import {
  navigationSegments,
  rawBrowseSearchableIndexes,
  rawDefaultSearchableIndexes,
  advancedSearchIndexes,
  searchableIndexesValues,
} from '../../constants';

import css from './AuthoritiesSearchForm.css';

const propTypes = {
  isAuthoritiesLoading: PropTypes.bool.isRequired,
  onChangeSortOption: PropTypes.func.isRequired,
  onSubmitSearch: PropTypes.func.isRequired,
};

const AuthoritiesSearchForm = ({
  isAuthoritiesLoading,
  onSubmitSearch,
  onChangeSortOption,
}) => {
  const intl = useIntl();
  const location = useLocation();

  const locationSearchParams = queryString.parse(location.search);

  const {
    navigationSegmentValue,
    searchDropdownValue,
    searchInputValue,
    setSearchInputValue,
    setSearchQuery,
    setSearchDropdownValue,
    setSearchIndex,
    setAdvancedSearchRows,
    resetAll,
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedSearchDefaultSearch, setAdvancedSearchDefaultSearch] = useState({
    query: locationSearchParams.query,
    option: locationSearchParams.qindex,
  });

  const searchInputRef = useRef();

  const handleResetAll = () => {
    resetAll();
    setAdvancedSearchDefaultSearch(null);
    onChangeSortOption('');
    setSelectedAuthorityRecordContext(null);
  };

  const handleAdvancedSearch = (searchString, searchRows) => {
    setSearchDropdownValue(searchableIndexesValues.ADVANCED_SEARCH);
    setSearchIndex(searchableIndexesValues.ADVANCED_SEARCH);
    setSearchInputValue(searchString);
    setSearchQuery(searchString);
    setAdvancedSearchRows(searchRows);
    setIsAdvancedSearchOpen(false);
  };

  useEffect(() => {
    setAdvancedSearchDefaultSearch({
      query: searchInputValue,
      option: searchDropdownValue,
    });
  }, [searchInputValue, searchDropdownValue]);

  const rawSearchableIndexes = navigationSegmentValue === navigationSegments.browse
    ? rawBrowseSearchableIndexes
    : rawDefaultSearchableIndexes;

  const searchableIndexes = rawSearchableIndexes.map(index => ({
    label: intl.formatMessage({ id: index.label }),
    value: index.value,
  }));

  const advancedSearchOptions = advancedSearchIndexes.map(index => ({
    label: intl.formatMessage({ id: index.label }),
    value: index.value,
  }));

  const isSearchButtonDisabled = (navigationSegmentValue === navigationSegments.browse && !searchDropdownValue)
    || !searchInputValue
    || isAuthoritiesLoading;

  return (
    <form onSubmit={onSubmitSearch}>
      <FilterNavigation />
      <div className={css.searchGroupWrap}>
        <SearchTextareaField
          textAreaRef={searchInputRef}
          autoFocus
          rows="1"
          name="query"
          id="textarea-authorities-search"
          className={css.searchField}
          searchableIndexes={searchableIndexes}
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
            <Col xs={12} lg={6}>
              <Button
                buttonStyle="none"
                id="clickable-reset-all"
                fullWidth
                disabled={!searchInputValue || isAuthoritiesLoading}
                onClick={() => {
                  resetRows();
                  handleResetAll();
                }}
              >
                <Icon icon="times-circle-solid">
                  {intl.formatMessage({ id: 'stripes-smart-components.resetAll' })}
                </Icon>
              </Button>
            </Col>

            <Col xs="12" sm="6">
              {navigationSegmentValue !== navigationSegments.browse && (
                <Button
                  fullWidth
                  onClick={() => setIsAdvancedSearchOpen(true)}
                >
                  {intl.formatMessage({ id: 'stripes-components.advancedSearch.button' })}
                </Button>
              )}
            </Col>
          </Row>
        )}
      </AdvancedSearch>
    </form>
  );
};

AuthoritiesSearchForm.propTypes = propTypes;

export default AuthoritiesSearchForm;
