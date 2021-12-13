import {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes-components';
import {
  AcqDateRangeFilter,
} from '@folio/stripes-acq-components';

import { MultiSelectionFacet } from '../../components';
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
  const [accordions, {
    handleSectionToggle,
  }] = useSectionToggle({
    headingType: false,
  });
  const { isLoading, facets = {} } = useFacets({
    query,
    selectedFacets: ['headingType'],
  });

  const applyFilters = useCallback(({ name, values }) => {
    setFilters(currentFilters => {
      return {
        ...currentFilters,
        [name]: values,
      };
    });
  }, []);

  const onClearFilter = (filter) => {};

  console.log(activeFilters);

  return (
    <AccordionSet accordionStatus={accordions} onToggle={handleSectionToggle}>
      <Accordion
        label={<FormattedMessage id={`ui-marc-authorities.filters.${FACETS.HEADING_TYPE}`} />}
        id={FACETS.HEADING_TYPE}
        name={FACETS.HEADING_TYPE}
        separator={false}
        header={FilterAccordionHeader}
        displayClearButton={true}
        onClearFilter={() => onClearFilter(FACETS.HEADING_TYPE)}
      >
        <MultiSelectionFacet
          id="headingTypeSelect"
          name={FACETS.HEADING_TYPE}
          options={facets[FACETS.HEADING_TYPE]?.values || []}
          value={activeFilters[FACETS.HEADING_TYPE]}
          selectedValues={activeFilters[FACETS.HEADING_TYPE]}
          onFilterChange={applyFilters}
          isPending={isLoading}
          // onFetch={handleFetchFacets}
        />
      </Accordion>

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
    </AccordionSet>
  );
};

SearchFilters.propTypes = propTypes;

export default SearchFilters;
