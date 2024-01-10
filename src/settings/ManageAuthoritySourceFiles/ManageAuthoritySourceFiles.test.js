import { fireEvent, render } from '@folio/jest-config-stripes/testing-library/react';

import stripesSmartComponents from '@folio/stripes/smart-components';
import { useUserTenantPermissions } from '@folio/stripes-authority-components';

import Harness from '../../../test/jest/helpers/harness';

import { ManageAuthoritySourceFiles } from './ManageAuthoritySourceFiles';

const { ControlledVocab } = stripesSmartComponents;

const authoritySourceFiles = [
  {
    'id': 'cb58492d-018e-442d-9ce3-35aabfc524aa',
    'name': 'Art & architecture thesaurus (AAT)',
    'codes': ['aat', 'aatg'],
    'type': 'Subjects',
    'baseUrl': 'vocab.getty.edu/aat/',
    'source': 'folio',
    'selectable': false,
    'hridManagement': {},
    'metadata': {
      'createdDate': '2023-10-16T22:27:18.596598Z',
      'createdByUserId': '00000000-0000-0000-0000-000000000000',
      'updatedDate': '2023-10-16T22:27:18.596598Z',
      'updatedByUserId': '00000000-0000-0000-0000-000000000000',
    },
  },
  {
    'id': 'af045f2f-e851-4613-984c-4bc13430333a',
    'name': 'Source option created by USER',
    'codes': ['unqe'],
    'type': 'Names',
    'baseUrl': 'id.loc.gov/authorities/unique/',
    'source': 'local',
    'selectable': true,
    'hridManagement': {
      startNumber: 100,
    },
    'metadata': {
      'createdDate': '2023-11-27T07:33:54.626664Z',
      'createdByUserId': '8af55289-9f7f-4680-834f-1b320c8be518',
      'updatedDate': '2023-11-27T07:33:54.626664Z',
      'updatedByUserId': '8af55289-9f7f-4680-834f-1b320c8be518',
    },
  },
];

const updaters = [
  {
    'username': 'ECSAdmin',
    'id': '8af55289-9f7f-4680-834f-1b320c8be518',
    'active': true,
    'type': 'staff',
    'patronGroup': '3684a786-6671-4268-8ed0-9db82ebca60b',
    'departments': [],
    'proxyFor': [],
    'personal': {
      'lastName': 'Admin',
      'firstName': 'ECS',
      'email': 'ecsadmin@example.com',
      'addresses': [],
      'preferredContactTypeId': '002',
    },
    'expirationDate': '2025-11-15T23:59:59.000+00:00',
    'createdDate': '2023-11-15T22:42:14.653+00:00',
    'updatedDate': '2023-11-15T22:42:14.653+00:00',
    'metadata': {
      'createdDate': '2023-11-15T22:40:53.811+00:00',
      'createdByUserId': '9f9d1c46-52e1-4bb7-9c6c-56e6bb945c42',
      'updatedDate': '2023-11-15T22:42:14.649+00:00',
      'updatedByUserId': '9f9d1c46-52e1-4bb7-9c6c-56e6bb945c42',
    },
    'customFields': {},
  },
];

jest.spyOn(stripesSmartComponents, 'ControlledVocab').mockImplementation(props => {
  return (
    <ControlledVocab
      mutator={{
        values: {
          POST: jest.fn().mockResolvedValue(),
        },
      }}
      resources={{
        values: {
          isPending: false,
          records: authoritySourceFiles,
        },
        updaters: {
          isPending: false,
          records: updaters,
        },
      }}
      {...props}
    />
  );
});

const renderManageAuthoritySourceFiles = () => render(<ManageAuthoritySourceFiles />, { wrapper: Harness });

describe('Given Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserTenantPermissions.mockImplementation((_, { enabled }) => {
      if (!enabled) return { userPermissions: [] };
      return {
        userPermissions: [{ permissionName: 'ui-marc-authorities.settings.authority-files.all' }],
      };
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

    expect(getByRole('gridcell', { name: 'Art & architecture thesaurus (AAT)' })).toBeVisible();
    expect(getByRole('gridcell', { name: 'aat,aatg' })).toBeVisible();
    expect(getByRole('gridcell', { name: 'vocab.getty.edu/aat/' })).toBeVisible();
    expect(getAllByRole('checkbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable' })[0]).toBeVisible();
    expect(getByRole('gridcell', { name: 'FOLIO' })).toBeVisible();
    expect(getAllByText('stripes-smart-components.cv.updatedAtAndBy')[0]).toBeVisible();

    expect(getByRole('gridcell', { name: 'Source option created by USER' })).toBeVisible();
    expect(getByRole('gridcell', { name: 'unqe' })).toBeVisible();
    expect(getByRole('gridcell', { name: '100' })).toBeVisible();
    expect(getByRole('gridcell', { name: 'id.loc.gov/authorities/unique/' })).toBeVisible();
    expect(getAllByRole('checkbox', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable' })[1]).toBeVisible();
    expect(getByRole('gridcell', { name: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.source.local' })).toBeVisible();
    expect(getAllByText('stripes-smart-components.cv.updatedAtAndBy')[1]).toBeVisible();
  });

  describe('when creating a new Source File', () => {
    describe('and filling in invalid data', () => {
      it('should show error messages', async () => {
        const {
          getByText,
          getByRole,
        } = renderManageAuthoritySourceFiles();

        await fireEvent.click(getByRole('button', { name: 'stripes-core.button.new' }));
        await fireEvent.click(getByRole('button', { name: 'stripes-core.button.save' }));

        expect(getByText('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.empty')).toBeDefined();
      });
    });
  });
});
