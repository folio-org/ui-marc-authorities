import {
  render,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import KeyShortCutsWrapper from './KeyShortCutsWrapper';

import {
  openEditShortcut,
  focusSearchShortcut,
} from '../../../test/utilities';

jest.mock('../../views/AuthoritiesSearch', () => ({
  onSubmitSearch: jest.fn(),
}));

const renderKeyShortCutsWrapper = ({
  onEdit,
  isPermission,
  focusSearchField,
}) => render(
  <CommandList commands={defaultKeyboardShortcuts}>
    <KeyShortCutsWrapper
      onEdit={onEdit}
      isPermission={isPermission}
      focusSearchField={focusSearchField}
    >
      <div data-testid="data-test-wrapper-children">
        Test
      </div>
    </KeyShortCutsWrapper>
  </CommandList>,
);

describe('KeyShortcutsWrapper', () => {
  afterEach(cleanup);

  it('should render children', () => {
    const { getByTestId } = renderKeyShortCutsWrapper({});

    expect(getByTestId('data-test-wrapper-children')).toBeDefined();
  });

  it('should call focusSearchField function', () => {
    const focusSearchFieldMock = jest.fn();

    const { getByTestId } = renderKeyShortCutsWrapper({
      focusSearchField: focusSearchFieldMock,
    });

    const testDiv = getByTestId('data-test-wrapper-children');

    testDiv.focus();

    focusSearchShortcut(testDiv);

    expect(focusSearchFieldMock).toHaveBeenCalledTimes(1);
  });

  describe('Edit shortcuts', () => {
    const onEditMock = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call onEdit function if marc-authorities-user has permission', () => {
      const { getByTestId } = renderKeyShortCutsWrapper({
        onEdit: onEditMock,
        isPermission: true,
      });

      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(onEditMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onEdit function if marc-authorities-user has not permission', () => {
      const { getByTestId } = renderKeyShortCutsWrapper({
        onEdit: onEditMock,
        isPermission: false,
      });

      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(onEditMock).not.toHaveBeenCalled();
    });
  });
});
