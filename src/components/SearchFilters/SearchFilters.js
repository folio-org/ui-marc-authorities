import {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import omit from 'lodash/omit';

import {
  Accordion,
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

};

const SearchFilters = ({
  activeFilters,
  isSearching,
  setFilters,
  query,
}) => {
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
  }, []);

  const onClearFilter = (filter) => {
    setFilters(currentFilters => omit(currentFilters, filter));
  };

  return (
    <>
      <Accordion
        label={<FormattedMessage id={`ui-marc-authorities.filters.${FACETS.HEADING_TYPE}`} />}
        id={FACETS.HEADING_TYPE}
        open={filterAccordions[FACETS.HEADING_TYPE]}
        onToggle={handleSectionToggle}
        name={FACETS.HEADING_TYPE}
        separator={false}
        header={FilterAccordionHeader}
        displayClearButton={!!activeFilters[FACETS.HEADING_TYPE]}
        onClearFilter={() => onClearFilter(FACETS.HEADING_TYPE)}
      >
        <MultiSelectionFacet
          id="headingTypeSelect"
          name={FACETS.HEADING_TYPE}
          options={facets[FACETS.HEADING_TYPE]?.values || []}
          selectedValues={activeFilters[FACETS.HEADING_TYPE]}
          onFilterChange={applyFilters}
          isPending={isLoading}
        />
      </Accordion>

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
