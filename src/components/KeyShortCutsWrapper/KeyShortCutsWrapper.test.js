import {
  render,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';
import { runAxeTest } from '@folio/stripes-testing';

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
  canEdit,
  focusSearchField,
}) => render(
  <CommandList commands={defaultKeyboardShortcuts}>
    <KeyShortCutsWrapper
      onEdit={onEdit}
      canEdit={canEdit}
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

  it('should render with no axe errors', async () => {
    const { container } = renderKeyShortCutsWrapper({});

    await runAxeTest({
      rootNode: container,
    });
  });

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
        canEdit: true,
      });

      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(onEditMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onEdit function if marc-authorities-user has not permission', () => {
      const { getByTestId } = renderKeyShortCutsWrapper({
        onEdit: onEditMock,
        canEdit: false,
      });

      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(onEditMock).not.toHaveBeenCalled();
    });
  });
});
