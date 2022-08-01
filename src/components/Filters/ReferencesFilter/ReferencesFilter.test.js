import user from '@testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@testing-library/react';

import { ReferencesFilter } from './ReferencesFilter';
import { navigationSegments } from '../../../constants';

const defaultProps = {
  activeFilters: [],
  disabled: false,
  onChange: jest.fn(),
  name: 'references-filter',
  id: 'references-filter',
  navigationSegment: navigationSegments.search,
};

const renderReferencesFilter = (props = {}) => render(
  <ReferencesFilter
    {...defaultProps}
    {...props}
  />,
);

describe('ReferencesFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render filter with specified options', () => {
    renderReferencesFilter();

    expect(screen.getByText('ui-marc-authorities.search.excludeSeeFrom')).toBeInTheDocument();
    expect(screen.getByText('ui-marc-authorities.search.excludeSeeFromAlso')).toBeInTheDocument();
  });

  it('should call \'onChange\' when filter was changed', () => {
    renderReferencesFilter();

    const excludeSeeFromOption = screen.getByText('ui-marc-authorities.search.excludeSeeFrom');

    act(() => user.click(excludeSeeFromOption));

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  describe('when navigation segment is Browse', () => {
    it('should not show exclude see from also option', () => {
      renderReferencesFilter({
        navigationSegment: navigationSegments.browse,
      });

      expect(screen.queryByText('ui-marc-authorities.search.excludeSeeFromAlso')).not.toBeInTheDocument();
    });
  });
});
