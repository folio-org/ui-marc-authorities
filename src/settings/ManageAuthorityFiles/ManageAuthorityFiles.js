import { useIntl } from 'react-intl';

import {
  useStripes,
  TitleManager,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';
import {
  ControlledVocab,
  Loading,
} from '@folio/stripes/smart-components';
import {
  InfoPopover,
  Label,
} from '@folio/stripes/components';
import { useUserTenantPermissions } from '@folio/stripes-authority-components';

import { getAuthorityFormatter } from './getAuthorityFormatter';
import { getFieldComponents } from './getFieldComponents';
import {
  authorityFilesColumns,
  SOURCES,
} from './constants';

const ManageAuthorityFiles = () => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const ConnectedControlledVocab = stripes.connect(ControlledVocab);

  const userId = stripes?.user?.user?.id;
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const {
    userPermissions: centralTenantPermissions,
    isFetching: isCentralTenantPermissionsLoading,
  } = useUserTenantPermissions({
    userId,
    tenantId: centralTenantId,
  }, {
    enabled: checkIfUserInMemberTenant(stripes),
  });

  const paneTitle = formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.label' });
  const tableTitle = formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.table.label' });
  const selectableFieldLabel = formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.column.selectable' });

  const authorityFilesAllPerm = 'ui-marc-authorities.settings.authority-files.all';

  const hasCentralTenantPerm = perm => {
    return centralTenantPermissions.some(({ permissionName }) => permissionName === perm);
  };

  const canEdit = checkIfUserInMemberTenant(stripes)
    ? hasCentralTenantPerm(authorityFilesAllPerm)
    : stripes.hasPerm(authorityFilesAllPerm);

  const suppressEdit = () => !canEdit;
  const suppressDelete = ({ source }) => source === SOURCES.FOLIO || !canEdit;

  const getRequiredLabel = columnLabel => (
    <Label required>
      {columnLabel}
    </Label>
  );

  const visibleFields = [
    authorityFilesColumns.NAME,
    authorityFilesColumns.CODES,
    authorityFilesColumns.START_NUMBER,
    authorityFilesColumns.BASE_URL,
    authorityFilesColumns.SELECTABLE,
    authorityFilesColumns.SOURCE,
  ];

  const columnMapping = {
    [authorityFilesColumns.NAME]: getRequiredLabel(formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.column.name' })),
    [authorityFilesColumns.CODES]: getRequiredLabel(formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.column.codes' })),
    [authorityFilesColumns.START_NUMBER]: getRequiredLabel(formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.column.startNumber' })),
    [authorityFilesColumns.BASE_URL]: getRequiredLabel(formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.column.baseUrl' })),
    [authorityFilesColumns.SELECTABLE]: (
      <>
        {selectableFieldLabel}
        <InfoPopover
          content={formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.column.selectable.info' })}
        />
      </>
    ),
    [authorityFilesColumns.SOURCE]: formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.column.source' }),
    [authorityFilesColumns.LAST_UPDATED]: formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.column.lastUpdated' }),
  };

  if (isCentralTenantPermissionsLoading) {
    return <Loading />;
  }

  return (
    <TitleManager record={paneTitle}>
      <ConnectedControlledVocab
        formType="final-form"
        stripes={stripes}
        baseUrl="authority-source-files"
        records="authoritySourceFiles"
        label={tableTitle}
        visibleFields={visibleFields}
        hiddenFields={[authorityFilesColumns.NUMBER_OF_OBJECTS]}
        columnMapping={columnMapping}
        formatter={getAuthorityFormatter()}
        actionSuppressor={{
          edit: suppressEdit,
          delete: suppressDelete,
        }}
        canCreate={canEdit}
        readOnlyFields={[authorityFilesColumns.SOURCE]}
        readOnlyFieldsOnAdding={[authorityFilesColumns.CODES, authorityFilesColumns.SOURCE]}
        id="authority-files"
        itemTemplate={{ [authorityFilesColumns.SOURCE]: SOURCES.LOCAL }}
        fieldComponents={getFieldComponents(selectableFieldLabel)}
      />
    </TitleManager>
  );
};

export { ManageAuthorityFiles };
