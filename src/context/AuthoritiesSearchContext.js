import {
  useState,
  createContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import pick from 'lodash/pick';

import { buildFiltersObj } from '@folio/stripes-acq-components';

import { useDidUpdate } from '../hooks';
import {
  navigationSegments,
  searchableIndexesValues,
  FILTERS,
} from '../constants';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const AuthoritiesSearchContext = createContext();

const AuthoritiesSearchContextProvider = ({
  children,
}) => {
  const location = useLocation();

  const filterUrlParams = Object.values(FILTERS);

  const getInitialFilters = () => {
    return pick(buildFiltersObj(location.search), filterUrlParams);
  };

  const locationSearchParams = queryString.parse(location.search);
  const initialSegment = locationSearchParams.segment || navigationSegments.search;

  const initialDropdownValue = initialSegment === navigationSegments.browse
    ? locationSearchParams.qindex || ''
    : locationSearchParams.qindex || searchableIndexesValues.KEYWORD;

  const [navigationSegmentValue, setNavigationSegmentValue] = useState(initialSegment);
  const [searchInputValue, setSearchInputValue] = useState(locationSearchParams.query || '');
  const [searchQuery, setSearchQuery] = useState(locationSearchParams.query || '');
  const [searchDropdownValue, setSearchDropdownValue] = useState(initialDropdownValue);
  const [searchIndex, setSearchIndex] = useState(initialDropdownValue);
  const [filters, setFilters] = useState(getInitialFilters());
  const [advancedSearchRows, setAdvancedSearchRows] = useState([]);
  const [isGoingToBaseURL, setIsGoingToBaseURL] = useState(false);
  const [advancedSearchDefaultSearch, setAdvancedSearchDefaultSearch] = useState({
    query: locationSearchParams.query,
    option: locationSearchParams.qindex,
  });

  const resetAll = () => {
    const dropdownValue = initialSegment === navigationSegments.browse
      ? ''
      : searchableIndexesValues.KEYWORD;

    setSearchInputValue('');
    setSearchQuery('');
    setSearchDropdownValue(dropdownValue);
    setSearchIndex(dropdownValue);
    setFilters({});
    setIsGoingToBaseURL(true);
    setAdvancedSearchDefaultSearch(null);
  };

  useDidUpdate(() => {
    resetAll();
  }, [navigationSegmentValue]);

  const contextValue = {
    searchInputValue,
    setSearchInputValue,
    searchQuery,
    setSearchQuery,
    searchDropdownValue,
    setSearchDropdownValue,
    searchIndex,
    setSearchIndex,
    filters,
    setFilters,
    navigationSegmentValue,
    setNavigationSegmentValue,
    advancedSearchRows,
    setAdvancedSearchRows,
    resetAll,
    isGoingToBaseURL,
    setIsGoingToBaseURL,
    advancedSearchDefaultSearch,
    setAdvancedSearchDefaultSearch,
  };

  return (
    <AuthoritiesSearchContext.Provider
      value={contextValue}
    >
      {children}
    </AuthoritiesSearchContext.Provider>
  );
};

AuthoritiesSearchContextProvider.propTypes = propTypes;

export {
  AuthoritiesSearchContext,
  AuthoritiesSearchContextProvider,
};
