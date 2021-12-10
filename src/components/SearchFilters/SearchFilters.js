import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes-components';

import { MultiSelectionFacet } from '../../components';
import { useSectionToggle } from '../../hooks';

const propTypes = {

};

const FACETS = {
  HEADING_TYPE: 'headingType',
};

const SearchFilters = () => {
  const [accordions, {
    handleSectionToggle,
  }] = useSectionToggle({
    headingType: false,
  });

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
        <MultiSelectionFacet
          name={FACETS.HEADING_TYPE}
          dataOptions={facetsOptions[FACETS_OPTIONS.HEADING_TYPE_OPTIONS]}
          selectedValues={activeFilters[FACETS.HEADING_TYPE]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.HEADING_TYPE)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
    </AccordionSet>
  );
};

SearchFilters.propTypes = propTypes;

export default SearchFilters;
