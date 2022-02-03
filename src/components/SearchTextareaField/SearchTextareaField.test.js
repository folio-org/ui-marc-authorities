import {
  render,
  fireEvent,
} from '@testing-library/react';

import SearchTextareaField from './SearchTextareaField';

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

const onChange = jest.fn();
const mockOnSubmitSearch = jest.fn();

const renderSearchTextareaField = (props = {}) => render(
  <SearchTextareaField
    id="test-search-textarea-field"
    onChange={onChange}
    searchableIndexes={searchableIndexes}
    onSubmitSearch={mockOnSubmitSearch}
    textAreaRef={testRef}
    {...props}
  />,
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

  describe('when typing inside textarea', () => {
    it('should handle onChange', () => {
      const { getByTestId } = renderSearchTextareaField();

      fireEvent.change(getByTestId('search-textarea'), { target: { value: 'test' } });

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('when user press "Enter" button', () => {
    it('should handle form submit', async () => {
      const { getByTestId } = renderSearchTextareaField();

      fireEvent.change(getByTestId('search-textarea'), { target: { value: 'test' } });
      fireEvent.keyDown(getByTestId('search-textarea'), {
        keyCode: 13,
      });

      expect(mockOnSubmitSearch).toHaveBeenCalled();
    });
  });

  describe('when user press not "Enter" button', () => {
    it('should not handle form submit', async () => {
      const { getByTestId } = renderSearchTextareaField();

      fireEvent.change(getByTestId('search-textarea'), { target: { value: 'test' } });
      fireEvent.keyDown(getByTestId('search-textarea'), {
        keyCode: 14,
      });

      expect(mockOnSubmitSearch).not.toHaveBeenCalled();
    });
  });
});
