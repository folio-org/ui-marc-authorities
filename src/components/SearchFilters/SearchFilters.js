import {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import omit from 'lodash/omit';

import {
  Accordion,
  Checkbox,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  AcqDateRangeFilter,
} from '@folio/stripes-acq-components';

import { MultiSelectionFacet } from '../MultiSelectionFacet';
import { useSectionToggle } from '../../hooks';
import { useFacets } from '../../queries';
import {
  navigationSegments,
  FILTERS,
} from '../../constants';
import { AuthoritiesSearchContext } from '../../context';

const FACETS = {
  HEADING_TYPE: 'headingType',
};

const DATE_FORMAT = 'YYYY-MM-DD';

const propTypes = {
  cqlQuery: PropTypes.string,
  isSearching: PropTypes.bool.isRequired,
};

const SearchFilters = ({
  isSearching,
  cqlQuery,
}) => {
  const intl = useIntl();
  const {
    filters,
    setFilters,
    isExcludedSeeFromLimiter,
    setIsExcludedSeeFromLimiter,
    navigationSegmentValue,
  } = useContext(AuthoritiesSearchContext);

  const isSearchNavigationSegment = navigationSegmentValue === navigationSegments.search;

  const [filterAccordions, { handleSectionToggle }] = useSectionToggle({
    [FACETS.HEADING_TYPE]: false,
  });

  const selectedFacets = Object.keys(filterAccordions).filter(accordion => filterAccordions[accordion]);

  const { isLoading, facets = {} } = useFacets({
    query: cqlQuery,
    selectedFacets,
  });

  const applyFilters = useCallback(({ name, values }) => {
    setFilters(currentFilters => {
      return {
        ...currentFilters,
        [name]: values,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClearFilter = (filter) => {
    setFilters(currentFilters => omit(currentFilters, filter));
  };

  const toggleExcludeSeeFromLimiter = () => {
    setIsExcludedSeeFromLimiter(isExcluded => !isExcluded);
  };

  return (
    <>
      <Accordion
        closedByDefault
        displayClearButton={isExcludedSeeFromLimiter}
        header={FilterAccordionHeader}
        headerProps={{
          label: intl.formatMessage({ id: 'ui-marc-authorities.search.references' }),
        }}
        label={intl.formatMessage({ id: 'ui-marc-authorities.search.references' })}
        aria-label={intl.formatMessage({ id: 'ui-marc-authorities.search.references' })}
        onClearFilter={() => setIsExcludedSeeFromLimiter(false)}
      >
        <Checkbox
          aria-label={intl.formatMessage({ id: 'ui-marc-authorities.search.excludeSeeFrom' })}
          label={intl.formatMessage({ id: 'ui-marc-authorities.search.excludeSeeFrom' })}
          onChange={toggleExcludeSeeFromLimiter}
          checked={isExcludedSeeFromLimiter}
        />
      </Accordion>

      {isSearchNavigationSegment && (
        <>
          <MultiSelectionFacet
            id={FACETS.HEADING_TYPE}
            label={intl.formatMessage({ id: `ui-marc-authorities.search.${FACETS.HEADING_TYPE}` })}
            name={FACETS.HEADING_TYPE}
            open={filterAccordions[FACETS.HEADING_TYPE]}
            options={facets[FACETS.HEADING_TYPE]?.values || []}
            selectedValues={filters[FACETS.HEADING_TYPE]}
            onFilterChange={applyFilters}
            onClearFilter={onClearFilter}
            displayClearButton={!!filters[FACETS.HEADING_TYPE]}
            handleSectionToggle={handleSectionToggle}
            isPending={isLoading}
          />

          <AcqDateRangeFilter
            activeFilters={filters?.createdDate || []}
            labelId="ui-marc-authorities.search.createdDate"
            id={FILTERS.CREATED_DATE}
            name={FILTERS.CREATED_DATE}
            onChange={applyFilters}
            disabled={isLoading}
            closedByDefault
            dateFormat={DATE_FORMAT}
          />

          <AcqDateRangeFilter
            activeFilters={filters?.updatedDate || []}
            labelId="ui-marc-authorities.search.updatedDate"
            id={FILTERS.UPDATED_DATE}
            name={FILTERS.UPDATED_DATE}
            onChange={applyFilters}
            disabled={isSearching}
            closedByDefault
            dateFormat={DATE_FORMAT}
          />
        </>
      )}
    </>
  );
};

SearchFilters.propTypes = propTypes;

export default SearchFilters;
