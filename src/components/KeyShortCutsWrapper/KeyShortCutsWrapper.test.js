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
  canEdit,
  isPermission,
  focusSearchField,
}) => render(
  <CommandList commands={defaultKeyboardShortcuts}>
    <KeyShortCutsWrapper
      canEdit={canEdit}
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
    const canEditMock = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call onEdit function if marc-authorities-user has permission', () => {
      const { getByTestId } = renderKeyShortCutsWrapper({
        canEdit: canEditMock,
        isPermission: true,
      });

      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(canEditMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onEdit function if marc-authorities-user has not permission', () => {
      const { getByTestId } = renderKeyShortCutsWrapper({
        canEdit: canEditMock,
        isPermission: false,
      });

      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(canEditMock).not.toHaveBeenCalled();
    });
  });
});
