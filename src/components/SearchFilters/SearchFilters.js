import {
  useState,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  useLocation,
} from 'react-router-dom';

import {
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes-components';
import {
  AcqDateRangeFilter,
  buildFiltersObj,
} from '@folio/stripes-acq-components';

import { MultiSelectionFacet } from '../../components';
import { useSectionToggle } from '../../hooks';

const FACETS = {
  HEADING_TYPE: 'headingType',
};

const DATE_FORMAT = 'YYYY-MM-DD';

const propTypes = {

};

const SearchFilters = ({
  isSearching,
  setFilters,
}) => {
  const location = useLocation();
  const [accordions, {
    handleSectionToggle,
  }] = useSectionToggle({
    headingType: false,
  });

  const applyFilters = useCallback(({ name, values }) => {
    setFilters(currentFilters => {
      return {
        ...currentFilters,
        [name]: values,
      };
    });
  }, []);

  const activeFilters = useMemo(() => buildFiltersObj(location.search), [location.search]);

  const onClearFilter = (filter) => {};

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
        {/* <MultiSelectionFacet
          name={FACETS.HEADING_TYPE}
          dataOptions={facetsOptions[FACETS_OPTIONS.HEADING_TYPE_OPTIONS]}
          selectedValues={activeFilters[FACETS.HEADING_TYPE]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.HEADING_TYPE)}
          onFetch={handleFetchFacets}
        /> */}
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
