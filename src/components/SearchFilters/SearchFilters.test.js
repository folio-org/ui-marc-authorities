import {
  fireEvent,
  render,
} from '@testing-library/react';

import SearchFilters from './SearchFilters';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../MultiSelectionFacet', () => ({
  MultiSelectionFacet: ({ name, onClearFilter }) => (
    <div>
      {name}
      <button type="button" onClick={() => onClearFilter(name)}>Clear {name}</button>
    </div>
  ),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  AcqDateRangeFilter: ({ name }) => <div>{name}</div>,
}));

const mockSetFilters = jest.fn().mockImplementation((cb) => {
  return cb({
    filterA: 'val-a',
    headingType: 'val-b',
  });
});

const renderSearchFilters = (props = {}) => render(
  <Harness>
    <SearchFilters
      activeFilters={{}}
      isSearching={false}
      query=""
      setFilters={mockSetFilters}
      {...props}
    />
  </Harness>,
);

describe('Given SearchFilters', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render Type of heading filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('headingType')).toBeDefined();
  });

  it('should display "References" accordion and "Exclude see from" checkbox', () => {
    const { getByRole } = renderSearchFilters();

    expect(getByRole('heading', { name: 'ui-marc-authorities.search.references' })).toBeDefined();
    expect(getByRole('checkbox', { name: 'ui-marc-authorities.search.excludeSeeFrom' })).toBeDefined();
  });

  it('should render created date filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('createdDate')).toBeDefined();
  });

  it('should render updated date filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('updatedDate')).toBeDefined();
  });

  describe('when clearing a filter', () => {
    it('should call setFilter with correct filters', () => {
      const { getByText } = renderSearchFilters();

      fireEvent.click(getByText('Clear headingType'));

      expect(mockSetFilters).toHaveReturnedWith({
        filterA: 'val-a',
      });
    });
  });
});
