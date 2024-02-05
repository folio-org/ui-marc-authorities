import { render } from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../test/jest/helpers/harness';

import { ManageAuthoritySourceFiles } from './ManageAuthoritySourceFiles';
import { useManageAuthoritySourceFiles } from './useManageAuthoritySourceFiles';

jest.mock('./useManageAuthoritySourceFiles', () => ({
  useManageAuthoritySourceFiles: jest.fn(),
}));

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

const updaters = [{
  id: 'user-1',
  personal: {
    firstName: 'User',
    lastName: 'Test',
  },
}];

const renderManageAuthoritySourceFiles = () => render(<ManageAuthoritySourceFiles />, { wrapper: Harness });

describe('Given Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useManageAuthoritySourceFiles.mockClear().mockReturnValue({
      sourceFiles,
      updaters,
      canEdit: true,
      canCreate: true,
      canDelete: true,
      isLoading: false,
      validate: jest.fn(),
      getReadOnlyFieldsForItem: jest.fn().mockReturnValue([]),
      createFile: jest.fn(),
      updateFile: jest.fn(),
      deleteFile: jest.fn(),
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
});
