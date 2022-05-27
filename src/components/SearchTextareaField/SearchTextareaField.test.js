import { render } from '@testing-library/react';

import SearchTextareaField from './SearchTextareaField';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Select: () => <div>Select component</div>,
}));

const searchableIndexes = [{
  label: 'test-label-1',
  value: 'test-value-1',
}, {
  label: 'test-label-2',
  value: 'test-value-2',
}];

const testRef = {
  current: {
    style: {
      height: '100px',
    },
  },
};

const mockOnSubmitSearch = jest.fn();

const renderSearchTextareaField = (props = {}) => render(
  <Harness>
    <SearchTextareaField
      id="test-search-textarea-field"
      searchableIndexes={searchableIndexes}
      onSubmitSearch={mockOnSubmitSearch}
      textAreaRef={testRef}
      {...props}
    />
  </Harness>,
);

describe('Given SearchTextareaField', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Select component', () => {
    const { getByText } = renderSearchTextareaField();

    expect(getByText('Select component')).toBeDefined();
  });

  it('should render textarea', () => {
    const { getByTestId } = renderSearchTextareaField();

    expect(getByTestId('search-textarea')).toBeDefined();
  });
});
