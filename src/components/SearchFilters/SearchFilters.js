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

import { MultiSelectionFacet } from '../../components';
import {
  useFacetFilters,
} from '../../hooks';

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
  const {
    isLoading,
    facets = {},
    onFilterToggle,
    openFilters,
  } = useFacetFilters({
    query,
    filters: {
      [FACETS.HEADING_TYPE]: false,
    },
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
        open={openFilters[FACETS.HEADING_TYPE]}
        onToggle={onFilterToggle}
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
    </>
  );
};

SearchFilters.propTypes = propTypes;

export default SearchFilters;
