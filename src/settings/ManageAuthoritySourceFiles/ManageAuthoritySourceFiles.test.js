import {
  render,
  act,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';



import {
  useAuthoritySourceFiles,
  useUserTenantPermissions,
} from '@folio/stripes-authority-components';
import { checkIfUserInMemberTenant } from '@folio/stripes/core';
import { runAxeTest } from '@folio/stripes-testing';

import { ManageAuthoritySourceFiles } from './ManageAuthoritySourceFiles';
import Harness from '../../../test/jest/helpers/harness';

const sourceFiles = [{
  name: 'Source file 1',
  codes: ['aa', 'ab'],
  baseUrl: 'http://test-url-1',
  selectable: false,
  source: 'folio',
  hridManagement: {},
  metadata: {
    updatedDate: '2024-01-05T10:35:07.193+00:00',
    updatedByUserId: 'user-1',
  },
}, {
  name: 'Source file 2',
  codes: ['a'],
  baseUrl: 'http://test-url-2',
  selectable: true,
  source: 'local',
  hridManagement: {
    startNumber: 100,
  },
  metadata: {
    updatedDate: '2024-01-05T10:35:07.193+00:00',
    updatedByUserId: '00000000-0000-0000-0000-000000000000',
  },
}];

const renderManageAuthoritySourceFiles = () => render(<ManageAuthoritySourceFiles />, { wrapper: Harness });

describe('Given Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthoritySourceFiles.mockReturnValue({
      sourceFiles,
      isLoading: false,
      createFile: jest.fn(),
      updateFile: jest.fn(),
      deleteFile: jest.fn(),
    });
    checkIfUserInMemberTenant.mockReturnValue(true);
    useUserTenantPermissions.mockReturnValue({
      userPermissions: [{ permissionName: 'ui-marc-authorities.settings.authority-files.all' }],
    });
  });

  it('should render with no axe errors', async () => {
    const { container } = renderManageAuthoritySourceFiles();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display pane title', () => {
    const { getByText } = renderManageAuthoritySourceFiles();

    expect(getByText('ui-marc-authorities.settings.manageAuthoritySourceFiles.pane.title')).toBeVisible();
  });

  it('should display list label', () => {
    const { getByText } = renderManageAuthoritySourceFiles();

    expect(getByText('ui-marc-authorities.settings.manageAuthoritySourceFiles.list.label')).toBeVisible();
  });

  it('should display correct column labels', () => {
    const { getByRole } = renderManageAuthoritySourceFiles();

    expect(getByRole('columnheader', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.name' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.codes' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.baseUrl' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.source' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.lastUpdated' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'stripes-smart-components.editableList.actionsColumnHeader' })).toBeVisible();
  });

  it('should display correct values in rows', () => {
    const { getByRole, getAllByRole, getAllByText } = renderManageAuthoritySourceFiles();

    expect(getByRole('gridcell', { name: 'Source file 1' })).toBeVisible();
    expect(getByRole('gridcell', { name: 'aa,ab' })).toBeVisible();
    expect(getByRole('gridcell', { name: 'http://test-url-1' })).toBeVisible();
    expect(getAllByRole('checkbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable' })[0]).toBeVisible();
    expect(getByRole('gridcell', { name: 'FOLIO' })).toBeVisible();
    expect(getAllByText('stripes-smart-components.cv.updatedAtAndBy')[0]).toBeVisible();

    expect(getByRole('gridcell', { name: 'Source file 2' })).toBeVisible();
    expect(getByRole('gridcell', { name: 'a' })).toBeVisible();
    expect(getByRole('gridcell', { name: '100' })).toBeVisible();
    expect(getByRole('gridcell', { name: 'http://test-url-2' })).toBeVisible();
    expect(getAllByRole('checkbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable' })[1]).toBeVisible();
    expect(getByRole('gridcell', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.source.local' })).toBeVisible();
    expect(getAllByText('stripes-smart-components.cv.updatedAtAndBy')[1]).toBeVisible();
  });

  it('should have correct placeholders and aria labels for fields', async () => {
    const { getByRole, getByText } = renderManageAuthoritySourceFiles();

    await act(() => userEvent.click(getByText('stripes-core.button.new')));

    const nameField = getByRole('textbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.name 0' });
    const codesField = getByRole('textbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.codes 0' });
    const startNumberField = getByRole('textbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber 0' });
    const baseUrlField = getByRole('textbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.baseUrl 0' });
    const selectableField = getByRole('checkbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable 0' });

    expect(nameField.placeholder).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.column.name');
    expect(codesField.placeholder).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.column.codes');
    expect(startNumberField.placeholder).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber');
    expect(baseUrlField.placeholder).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.column.baseUrl');
    expect(selectableField).toBeInTheDocument();
  });

  describe('when validating an item', () => {
    beforeEach(async () => {
      const { getByText } = renderManageAuthoritySourceFiles();

      await act(() => userEvent.click(getByText('stripes-core.button.new')));
    });

    describe('when the "HRID starts with" field is empty', () => {
      it('should display an error', async () => {
        await act(() => userEvent.click(screen.getByText('stripes-core.button.save')));

        expect(screen.getByText('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.empty')).toBeVisible();
      });
    });

    describe('when the "HRID starts with" field value starts with 0', () => {
      it('should display an error', async () => {
        const startNumberField = screen.getByRole('textbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber 0' });

        await act(() => userEvent.type(startNumberField, '01'));
        await act(() => userEvent.click(screen.getByText('stripes-core.button.save')));

        expect(screen.getByText('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.zeroes')).toBeVisible();
      });
    });

    describe('when the "HRID starts with" field has a whitespace character', () => {
      it('should display an error', async () => {
        const startNumberField = screen.getByRole('textbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber 0' });

        await act(() => userEvent.type(startNumberField, '1 '));
        await act(() => userEvent.click(screen.getByText('stripes-core.button.save')));

        expect(screen.getByText('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.whitespace')).toBeVisible();
      });
    });

    describe('when the "HRID starts with" field has a non-numeric character', () => {
      it('should display an error', async () => {
        const startNumberField = screen.getByRole('textbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber 0' });

        await act(() => userEvent.type(startNumberField, '1a'));
        await act(() => userEvent.click(screen.getByText('stripes-core.button.save')));

        expect(screen.getByText('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.notNumeric')).toBeVisible();
      });
    });

    describe('when the "HRID starts with" field has more than 10 characters', () => {
      it('should display an error', async () => {
        const startNumberField = screen.getByRole('textbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber 0' });

        await act(() => userEvent.type(startNumberField, '12345678901'));
        await act(() => userEvent.click(screen.getByText('stripes-core.button.save')));

        expect(screen.getByText('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.moreThan10')).toBeVisible();
      });
    });
  });
});
