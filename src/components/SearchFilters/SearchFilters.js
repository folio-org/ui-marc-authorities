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
  facetsTypes,
  subjectHeadingsMap,
} from '../../constants';
import { AuthoritiesSearchContext } from '../../context';

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
    [facetsTypes.HEADING_TYPE]: false,
    [facetsTypes.SUBJECT_HEADINGS]: false,
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

  const getSubjectHeadingsFacetOptions = () => {
    return facets[facetsTypes.SUBJECT_HEADINGS]?.values.map(value => {
      const subjectHeadingsName = Object.keys(subjectHeadingsMap).find(key => {
        return subjectHeadingsMap[key] === value.id;
      });

      return {
        id: subjectHeadingsName,
        totalRecords: value.totalRecords,
      };
    });
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
            id={facetsTypes.SUBJECT_HEADINGS}
            label={intl.formatMessage({ id: `ui-marc-authorities.search.${facetsTypes.SUBJECT_HEADINGS}` })}
            name={facetsTypes.SUBJECT_HEADINGS}
            open={filterAccordions[facetsTypes.SUBJECT_HEADINGS]}
            options={getSubjectHeadingsFacetOptions() || []}
            selectedValues={filters[facetsTypes.SUBJECT_HEADINGS]}
            onFilterChange={applyFilters}
            onClearFilter={onClearFilter}
            displayClearButton={!!filters[facetsTypes.SUBJECT_HEADINGS]?.length}
            handleSectionToggle={handleSectionToggle}
            isPending={isLoading}
          />

          <MultiSelectionFacet
            id={facetsTypes.HEADING_TYPE}
            label={intl.formatMessage({ id: `ui-marc-authorities.search.${facetsTypes.HEADING_TYPE}` })}
            name={facetsTypes.HEADING_TYPE}
            open={filterAccordions[facetsTypes.HEADING_TYPE]}
            options={facets[facetsTypes.HEADING_TYPE]?.values || []}
            selectedValues={filters[facetsTypes.HEADING_TYPE]}
            onFilterChange={applyFilters}
            onClearFilter={onClearFilter}
            displayClearButton={!!filters[facetsTypes.HEADING_TYPE]?.length}
            handleSectionToggle={handleSectionToggle}
            isPending={isLoading}
          />

          <AcqDateRangeFilter
            activeFilters={filters?.createdDate || []}
            labelId="ui-marc-authorities.search.createdDate"
            id="createdDate"
            name="createdDate"
            onChange={applyFilters}
            disabled={isLoading}
            closedByDefault
            dateFormat={DATE_FORMAT}
          />

          <AcqDateRangeFilter
            activeFilters={filters?.updatedDate || []}
            labelId="ui-marc-authorities.search.updatedDate"
            id="updatedDate"
            name="updatedDate"
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
