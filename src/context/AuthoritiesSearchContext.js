import {
  useState,
  createContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import omit from 'lodash/omit';

import { buildFiltersObj } from '@folio/stripes-acq-components';

import { useDidUpdate } from '../hooks';
import {
  navigationSegments,
  searchableIndexesValues,
} from '../constants';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const AuthoritiesSearchContext = createContext();

const AuthoritiesSearchContextProvider = ({
  children,
}) => {
  const location = useLocation();

  const nonFilterUrlParams = ['query', 'qindex', 'segment', 'excludeSeeFrom', 'sort'];
  const getInitialFilters = () => {
    return omit(buildFiltersObj(location.search), nonFilterUrlParams);
  };
  const locationSearchParams = queryString.parse(location.search);
  const initialSegment = locationSearchParams.segment || navigationSegments.search;
  const initialDropdownValue = initialSegment === navigationSegments.browse
    ? locationSearchParams.qindex || searchableIndexesValues.NONE
    : locationSearchParams.qindex || searchableIndexesValues.KEYWORD;

  const [navigationSegmentValue, setNavigationSegmentValue] = useState(initialSegment);
  const [searchInputValue, setSearchInputValue] = useState(locationSearchParams.query || '');
  const [searchQuery, setSearchQuery] = useState(locationSearchParams.query || '');
  const [searchDropdownValue, setSearchDropdownValue] = useState(initialDropdownValue);
  const [searchIndex, setSearchIndex] = useState(initialDropdownValue);
  const [filters, setFilters] = useState(getInitialFilters());
  const [isExcludedSeeFromLimiter, setIsExcludedSeeFromLimiter] = useState(!!locationSearchParams.excludeSeeFrom);
  const [advancedSearchRows, setAdvancedSearchRows] = useState([]);
  const [isGoingToBaseURL, setIsGoingToBaseURL] = useState(false);

  const resetAll = () => {
    const dropdownValue = initialSegment === navigationSegments.browse
      ? searchableIndexesValues.KEYWORD
      : searchableIndexesValues.KEYWORD

    setSearchInputValue('');
    setSearchQuery('');
    setSearchDropdownValue(dropdownValue);
    setSearchIndex(dropdownValue);
    setFilters({});
    setIsExcludedSeeFromLimiter(false);
    setIsGoingToBaseURL(true);
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
    isExcludedSeeFromLimiter,
    setIsExcludedSeeFromLimiter,
    advancedSearchRows,
    setAdvancedSearchRows,
    resetAll,
    isGoingToBaseURL,
    setIsGoingToBaseURL,
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
