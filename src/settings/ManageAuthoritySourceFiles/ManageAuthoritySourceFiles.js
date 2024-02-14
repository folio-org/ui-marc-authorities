import {
  useCallback,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import {
  FormattedDate,
  FormattedMessage,
  useIntl,
} from 'react-intl';
import noop from 'lodash/noop';

import {
  TitleManager,
  useCallout,
} from '@folio/stripes/core';
import { EditableList } from '@folio/stripes/smart-components';
import {
  Pane,
  InfoPopover,
  Label,
  Loading,
} from '@folio/stripes/components';

import { useManageAuthoritySourceFiles } from './useManageAuthoritySourceFiles';
import { getFormatter } from './getFormatter';
import { getFieldComponents } from './getFieldComponents';
import {
  authorityFilesColumns,
  SOURCES,
  SYSTEM_USER_ID,
  ITEM_TEMPLATE,
} from './constants';

import styles from './ManageAuthoritySourceFiles.css';

const ACTION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

const ManageAuthoritySourceFiles = () => {
  const intl = useIntl();
  const callout = useCallout();

  const showSuccessMessage = (action, name) => callout.sendCallout({
    message: <FormattedMessage id={`ui-marc-authorities.settings.manageAuthoritySourceFiles.${action}.success`} values={{ name }} />,
  });
  const showErrorMessage = (action, name, reason) => {
    const translationId = reason
      ? `ui-marc-authorities.settings.manageAuthoritySourceFiles.${action}.fail.${reason}`
      : 'ui-marc-authorities.error.defaultSaveError';

    callout.sendCallout({
      message: intl.formatMessage({ id: translationId }, { name }),
      type: 'error',
    });
  };

  const onCreateSuccess = ({ name }) => showSuccessMessage(ACTION_TYPES.CREATE, name);
  const onUpdateSuccess = ({ name }) => showSuccessMessage(ACTION_TYPES.UPDATE, name);
  const onDeleteSuccess = ({ name }) => showSuccessMessage(ACTION_TYPES.DELETE, name);
  const onUpdateFail = ({ name, reason }) => showErrorMessage(ACTION_TYPES.UPDATE, name, reason);
  const onDeleteFail = ({ name, reason }) => showErrorMessage(ACTION_TYPES.DELETE, name, reason);

  const {
    sourceFiles,
    updaters,
    isLoading,
    canEdit,
    canCreate,
    canDelete,
    validate,
    getReadOnlyFieldsForItem,
    createFile,
    updateFile,
    deleteFile,
  } = useManageAuthoritySourceFiles({
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess,
    onUpdateFail,
    onDeleteFail,
  });

  const paneTitle = intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.pane.title' });
  const label = intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.list.label' });

  const fieldLabels = useMemo(() => ({
    [authorityFilesColumns.NAME]: intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.name' }),
    [authorityFilesColumns.CODES]: intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.codes' }),
    [authorityFilesColumns.START_NUMBER]: intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber' }),
    [authorityFilesColumns.BASE_URL]: intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.baseUrl' }),
    [authorityFilesColumns.SELECTABLE]: intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable' }),
    [authorityFilesColumns.SOURCE]: intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.source' }),
    [authorityFilesColumns.LAST_UPDATED]: intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.lastUpdated' }),
  }), [intl]);

  const getRequiredLabel = useCallback(columnLabel => (
    <Label required>
      {columnLabel}
    </Label>
  ), []);

  const visibleFields = useMemo(() => ([
    authorityFilesColumns.NAME,
    authorityFilesColumns.CODES,
    authorityFilesColumns.START_NUMBER,
    authorityFilesColumns.BASE_URL,
    authorityFilesColumns.SELECTABLE,
    authorityFilesColumns.SOURCE,
    authorityFilesColumns.LAST_UPDATED,
  ]), []);

  const readOnlyFields = useMemo(() => ([
    authorityFilesColumns.SOURCE,
    authorityFilesColumns.LAST_UPDATED,
    authorityFilesColumns.NUMBER_OF_OBJECTS,
  ]), []);

  const columnMapping = useMemo(() => ({
    [authorityFilesColumns.NAME]: getRequiredLabel(fieldLabels[authorityFilesColumns.NAME]),
    [authorityFilesColumns.CODES]: getRequiredLabel(fieldLabels[authorityFilesColumns.CODES]),
    [authorityFilesColumns.START_NUMBER]: getRequiredLabel(fieldLabels[authorityFilesColumns.START_NUMBER]),
    [authorityFilesColumns.BASE_URL]: fieldLabels[authorityFilesColumns.BASE_URL],
    [authorityFilesColumns.SELECTABLE]: (
      <>
        {fieldLabels[authorityFilesColumns.SELECTABLE]}
        <InfoPopover
          content={intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.selectable.info' })}
        />
      </>
    ),
    [authorityFilesColumns.SOURCE]: fieldLabels[authorityFilesColumns.SOURCE],
    [authorityFilesColumns.LAST_UPDATED]: fieldLabels[authorityFilesColumns.LAST_UPDATED],
  }), [intl, fieldLabels, getRequiredLabel]);

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

  const renderLastUpdated = useCallback(metadata => {
    const record = updaters.find(r => r.id === metadata.updatedByUserId);

    let user = '';

    if (record?.personal) {
      const { firstName, lastName = '' } = record.personal;
      const name = firstName ? `${lastName}, ${firstName}` : lastName;

      user = <Link to={`/users/view/${metadata.updatedByUserId}`}>{name}</Link>;
    } else if (metadata.updatedByUserId === SYSTEM_USER_ID) {
      user = <FormattedMessage id="stripes-smart-components.system" />;
    }

    return (
      <div className={styles.lastUpdated}>
        <FormattedMessage
          id="stripes-smart-components.cv.updatedAtAndBy"
          values={{
            date: <FormattedDate value={metadata.updatedDate} />,
            user,
          }}
        />
      </div>
    );
  }, [updaters]);

  const formatter = useMemo(() => getFormatter({ fieldLabels, renderLastUpdated }), [fieldLabels, renderLastUpdated]);

  const isEmptyMessage = useMemo(() => (
    isLoading
      ? <Loading />
      : (
        <FormattedMessage
          id="stripes-smart-components.cv.noExistingTerms"
          values={{ terms: label }}
        />
      )
  ), [isLoading, label]);

  const suppressEdit = () => !canEdit;
  const suppressDelete = ({ source }) => source === SOURCES.FOLIO || !canDelete;


  if (isLoading) {
    return <Loading />;
  }

  return (
    <TitleManager record={paneTitle}>
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={paneTitle}
        id="settings-authority-source-files-pane"
      >
        <EditableList
          formType="final-form"
          contentData={sourceFiles}
          totalCount={sourceFiles.length}
          createButtonLabel={intl.formatMessage({ id: 'stripes-core.button.new' })}
          label={label}
          itemTemplate={ITEM_TEMPLATE}
          visibleFields={visibleFields}
          hiddenFields={[authorityFilesColumns.NUMBER_OF_OBJECTS]}
          columnMapping={columnMapping}
          formatter={formatter}
          readOnlyFields={readOnlyFields}
          getReadOnlyFieldsForItem={getReadOnlyFieldsForItem}
          actionSuppression={{
            edit: suppressEdit,
            delete: suppressDelete,
          }}
          onUpdate={updateFile}
          onCreate={createFile}
          onDelete={deleteFile}
          onSubmit={noop}
          isEmptyMessage={isEmptyMessage}
          validate={validate}
          fieldComponents={getFieldComponents(fieldLabels)}
          columnWidths={columnWidths}
          canCreate={canCreate}
          withDeleteConfirmation
          confirmationHeading={<FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.confirmationModal.heading" />}
          confirmationMessage={fileId => ((
            <FormattedMessage
              id="ui-marc-authorities.settings.manageAuthoritySourceFiles.confirmationModal.message"
              values={{
                name: sourceFiles.find(file => file.id === fileId)?.name,
                br: <br />,
              }}
            />
          ))}
        />
      </Pane>
    </TitleManager>
  );
};

export { ManageAuthoritySourceFiles };
