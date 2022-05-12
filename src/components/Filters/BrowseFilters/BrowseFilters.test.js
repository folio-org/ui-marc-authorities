import {
  fireEvent,
  render,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import BrowseFilters from './BrowseFilters';
import Harness from '../../../../test/jest/helpers/harness';
import { navigationSegments } from '../../../constants';

jest.mock('../../../queries', () => ({
  ...jest.requireActual('../../../queries'),
  useFacets: jest.fn().mockReturnValue({
    isLoading: false,
    facets: {
      subjectHeadings: {
        values: [{
          id: 'a',
          totalRecords: 10,
        }],
      },
    },
  }),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqDateRangeFilter: ({ name }) => <div>{name}</div>,
}));

jest.mock('../../MultiSelectionFacet', () => ({
  MultiSelectionFacet: ({ name, onClearFilter }) => (
    <div>
      {name}
      <button type="button" onClick={() => onClearFilter(name)}>Clear {name}</button>
    </div>
  ),
}));

const mockSetFilters = jest.fn();

const defaultCtxValue = {
  setFilters: mockSetFilters,
  filters: {
    headingType: ['val-a', 'val-b'],
    subjectHeadings: ['Other'],
  },
  navigationSegmentValue: navigationSegments.search,
};

const renderBrowseFilters = (props = {}, ctxValue = defaultCtxValue) => render(
  <Harness authoritiesCtxValue={ctxValue}>
    <BrowseFilters
      isSearching={false}
      cqlQquery=""
      {...props}
    />
  </Harness>,
);

describe('Given BrowseFilters', () => {
  afterEach(() => jest.clearAllMocks());

  it('should display "References" accordion and its checkboxes', () => {
    const { getByRole } = renderBrowseFilters();

    expect(getByRole('heading', { name: 'ui-marc-authorities.search.references' })).toBeDefined();
    expect(getByRole('checkbox', { name: 'ui-marc-authorities.search.excludeSeeFrom' })).toBeDefined();
    expect(getByRole('checkbox', { name: 'ui-marc-authorities.search.excludeSeeFromAlso' })).toBeDefined();
  });

  it('should render Type of heading filter', () => {
    const { getByText } = renderBrowseFilters();

    expect(getByText('headingType')).toBeDefined();
  });

  describe('when clearing a filter', () => {
    it('should call setFilters with correct filters', () => {
      mockSetFilters.mockImplementation((setter) => setter(defaultCtxValue.filters));

      const { getByText } = renderBrowseFilters();

      fireEvent.click(getByText('Clear headingType'));

      expect(mockSetFilters.mock.results[0].value).toMatchObject({});
    });
  });

  describe('when expanding all filters', () => {
    it('should render with no axe errors', async () => {
      const {
        container,
        getByText,
      } = renderBrowseFilters();

      fireEvent.click(getByText('ui-marc-authorities.search.references'));
      fireEvent.click(getByText('headingType'));

      await runAxeTest({
        rootNode: container,
      });
    });
  });
});
