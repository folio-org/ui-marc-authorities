import { useCallback } from 'react';
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

const FACETS = {
  HEADING_TYPE: 'headingType',
};

const DATE_FORMAT = 'YYYY-MM-DD';

const propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyExcludeSeeFromLimiter: PropTypes.func.isRequired,
  isExcludedSeeFromLimiter: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  setFilters: PropTypes.func.isRequired,
  setIsExcludedSeeFromLimiter: PropTypes.func.isRequired,
};

const SearchFilters = ({
  activeFilters,
  isSearching,
  setFilters,
  query,
  isExcludedSeeFromLimiter,
  setIsExcludedSeeFromLimiter,
  applyExcludeSeeFromLimiter,
}) => {
  const intl = useIntl();

  const [filterAccordions, { handleSectionToggle }] = useSectionToggle({
    [FACETS.HEADING_TYPE]: false,
  });

  const selectedFacets = Object.keys(filterAccordions).filter(accordion => filterAccordions[accordion]);

  const { isLoading, facets = {} } = useFacets({
    query,
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

  return (
    <>
      <Accordion
        closedByDefault
        displayClearButton={isExcludedSeeFromLimiter}
        header={FilterAccordionHeader}
        label={intl.formatMessage({ id: 'ui-marc-authorities.search.references' })}
        onClearFilter={() => setIsExcludedSeeFromLimiter(false)}
      >
        <Checkbox
          label={intl.formatMessage({ id: 'ui-marc-authorities.search.excludeSeeFrom' })}
          onChange={applyExcludeSeeFromLimiter}
          checked={isExcludedSeeFromLimiter}
        />
      </Accordion>

      <MultiSelectionFacet
        id={FACETS.HEADING_TYPE}
        label={intl.formatMessage({ id: `ui-marc-authorities.search.${FACETS.HEADING_TYPE}` })}
        name={FACETS.HEADING_TYPE}
        open={filterAccordions[FACETS.HEADING_TYPE]}
        options={facets[FACETS.HEADING_TYPE]?.values || []}
        selectedValues={activeFilters[FACETS.HEADING_TYPE]}
        onFilterChange={applyFilters}
        onClearFilter={onClearFilter}
        displayClearButton={!!activeFilters[FACETS.HEADING_TYPE]}
        handleSectionToggle={handleSectionToggle}
        isPending={isLoading}
      />

      <AcqDateRangeFilter
        activeFilters={activeFilters?.createdDate || []}
        labelId="ui-marc-authorities.createdDate"
        id="createdDate"
        name="createdDate"
        onChange={applyFilters}
        disabled={isLoading}
        closedByDefault
        dateFormat={DATE_FORMAT}
      />

      <AcqDateRangeFilter
        activeFilters={activeFilters?.updatedDate || []}
        labelId="ui-marc-authorities.updatedDate"
        id="updatedDate"
        name="updatedDate"
        onChange={applyFilters}
        disabled={isSearching}
        closedByDefault
        dateFormat={DATE_FORMAT}
      />
    </>
  );
};

SearchFilters.propTypes = propTypes;

export default SearchFilters;
