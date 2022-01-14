import {
  render,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import KeyShortcutsWrapper from './KeyShortCutsWrapper';

import {
  openEditShortcut,
  focusSearchShortcut,
} from '../../../test/utilities';

jest.mock('../../views/AuthoritiesSearch', () => ({
  onSubmitSearch: jest.fn(),
}));

const renderKeyShortcutsWrapper = ({
  toggleAllSections,
  onEdit,
  isPermission,
  focusSearchField,
}) => render(
  <CommandList commands={defaultKeyboardShortcuts}>
    <KeyShortcutsWrapper
      toggleAllSections={toggleAllSections}
      onEdit={onEdit}
      isPermission={isPermission}
      focusSearchField={focusSearchField}
    >
      <div data-testid="data-test-wrapper-children">
        Test
      </div>
    </KeyShortcutsWrapper>
  </CommandList>,
);

describe('KeyShortcutsWrapper', () => {
  afterEach(cleanup);

  it('should render children', () => {
    const { getByTestId } = renderKeyShortcutsWrapper({});

    expect(getByTestId('data-test-wrapper-children')).toBeDefined();
  });

  it('should call focusSearchField function', () => {
    const focusSearchFieldMock = jest.fn();
    const { getByTestId } = renderKeyShortcutsWrapper({
      focusSearchField: focusSearchFieldMock,
    });
    const testDiv = getByTestId('data-test-wrapper-children');

    testDiv.focus();

    focusSearchShortcut(testDiv);

    expect(focusSearchFieldMock).toHaveBeenCalledTimes(1);
  });

  describe('Edit shortcuts', () => {
    const onEditMock = jest.fn();
    const toggleAllSectionsMock = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call onEdit function if marc-authorities-user has permission', () => {
      const { getByTestId } = renderKeyShortcutsWrapper({
        onEdit: onEditMock,
        toggleAllSections: toggleAllSectionsMock,
        isPermission: true,
      });
      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(onEditMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onEdit function if marc-authorities-user has not permission', () => {
      const { getByTestId } = renderKeyShortcutsWrapper({
        onEdit: onEditMock,
        toggleAllSections: toggleAllSectionsMock,
        isPermission: false,
      });
      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(onEditMock).not.toHaveBeenCalled();
    });
  });
});
