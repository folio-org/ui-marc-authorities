import {
  useCallback,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import {
  useStripes,
  TitleManager,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  InfoPopover,
  Label,
  Loading,
} from '@folio/stripes/components';
import { useUserTenantPermissions } from '@folio/stripes-authority-components';

import { getFormatter } from './getFormatter';
import { getFieldComponents } from './getFieldComponents';
import { hasCentralTenantPerm } from '../../utils';
import {
  authorityFilesColumns,
  SOURCES,
} from './constants';
import { getValidators } from './getValidators';

const authorityFilesAllPerm = 'ui-marc-authorities.settings.authority-files.all';

const ITEM_TEMPLATE = {
  [authorityFilesColumns.SOURCE]: SOURCES.LOCAL,
  [authorityFilesColumns.SELECTABLE]: false,
};

const ManageAuthoritySourceFiles = () => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const ConnectedControlledVocab = stripes.connect(ControlledVocab);

  const userId = stripes.user.user?.id;
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

  const paneTitle = formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.pane.title' });
  const selectableFieldLabel = formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable' });

  const isUserHasEditPermission = checkIfUserInMemberTenant(stripes)
    ? hasCentralTenantPerm(centralTenantPermissions, authorityFilesAllPerm)
    : stripes.hasPerm(authorityFilesAllPerm);

  const suppressEdit = () => !isUserHasEditPermission;
  const suppressDelete = ({ source }) => source === SOURCES.FOLIO || !isUserHasEditPermission;

  const getRequiredLabel = useCallback(columnLabel => (
    <Label required>
      {columnLabel}
    </Label>
  ), []);

  const formatFileForCreate = useCallback(file => {
    const fileCopy = { ...file };

    fileCopy.code = file.codes;
    fileCopy.hridManagement = {
      startNumber: file.startNumber,
    };

    delete fileCopy.codes;
    delete fileCopy.startNumber;

    return fileCopy;
  }, []);

  const validate = useCallback((item, _index, items) => {
    const errors = Object.values(authorityFilesColumns).reduce((acc, field) => {
      const error = getValidators(field)?.(item, items);

      if (error) {
        acc[field] = error;
      }

      return acc;
    }, {});

    return errors;
  }, []);

  const visibleFields = useMemo(() => ([
    authorityFilesColumns.NAME,
    authorityFilesColumns.CODES,
    authorityFilesColumns.START_NUMBER,
    authorityFilesColumns.BASE_URL,
    authorityFilesColumns.SELECTABLE,
    authorityFilesColumns.SOURCE,
  ]), []);

  const columnMapping = useMemo(() => ({
    [authorityFilesColumns.NAME]: getRequiredLabel(formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.name' })),
    [authorityFilesColumns.CODES]: getRequiredLabel(formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.codes' })),
    [authorityFilesColumns.START_NUMBER]: getRequiredLabel(formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber' })),
    [authorityFilesColumns.BASE_URL]: formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.baseUrl' }),
    [authorityFilesColumns.SELECTABLE]: (
      <>
        {selectableFieldLabel}
        <InfoPopover
          content={formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable.info' })}
        />
      </>
    ),
    [authorityFilesColumns.SOURCE]: formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.source' }),
    [authorityFilesColumns.LAST_UPDATED]: formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.lastUpdated' }),
  }), [formatMessage, selectableFieldLabel, getRequiredLabel]);

  const columnWidths = useMemo(() => ({
    [authorityFilesColumns.NAME]: '300px',
    [authorityFilesColumns.CODES]: '100px',
    [authorityFilesColumns.START_NUMBER]: '150px',
    [authorityFilesColumns.BASE_URL]: '100px',
    [authorityFilesColumns.SELECTABLE]: '100px',
    [authorityFilesColumns.SOURCE]: '100px',
    [authorityFilesColumns.LAST_UPDATED]: '200px',
    [authorityFilesColumns.ACTIONS]: '100px',
  }), []);

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
        label={paneTitle}
        listFormLabel={formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.list.label' })}
        visibleFields={visibleFields}
        hiddenFields={[authorityFilesColumns.NUMBER_OF_OBJECTS]}
        columnMapping={columnMapping}
        formatter={getFormatter({ selectableFieldLabel })}
        actionSuppressor={{
          edit: suppressEdit,
          delete: suppressDelete,
        }}
        readOnlyFields={[authorityFilesColumns.SOURCE]}
        id="authority-source-files"
        itemTemplate={ITEM_TEMPLATE}
        fieldComponents={getFieldComponents(selectableFieldLabel)}
        columnWidths={columnWidths}
        actionSuppression={{
          edit: suppressEdit,
          delete: suppressDelete,
        }}
        createButtonLabel={formatMessage({ id: 'stripes-core.button.new' })}
        canCreate={isUserHasEditPermission}
        preCreateHook={formatFileForCreate}
        tenant={centralTenantId || stripes.okapi.tenant}
        labelSingular={formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.labelSingular' })}
        validate={validate}
      />
    </TitleManager>
  );
};

export { ManageAuthoritySourceFiles };
