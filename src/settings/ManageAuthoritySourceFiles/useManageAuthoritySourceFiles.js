import { useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import {
  useStripes,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';
import {
  useUserTenantPermissions,
  useAuthoritySourceFiles,
  useUsers,
} from '@folio/stripes-authority-components';

import { hasCentralTenantPerm } from '../../utils';
import { SOURCES, authorityFilesColumns } from './constants';
import { getValidators } from './getValidators';

const authorityFilesAllPerm = 'ui-marc-authorities.settings.authority-files.all';

export const useManageAuthoritySourceFiles = ({
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
  onCreateFail,
  onUpdateFail,
  onDeleteFail,
}) => {
  const stripes = useStripes();
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;
  const userId = stripes.user.user?.id;

  const {
    sourceFiles,
    isLoading: isSourceFilesLoading,
    createFile: _createFile,
    updateFile: _updateFile,
    deleteFile: _deleteFile,
  } = useAuthoritySourceFiles({
    tenantId: centralTenantId || stripes.okapi.tenant,
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess,
    onCreateFail,
    onUpdateFail,
    onDeleteFail,
  });

  const updatersIds = [...new Set(sourceFiles
    .filter(file => file.metadata?.updatedByUserId)
    .map(file => file.metadata.updatedByUserId)),
  ];

  const {
    users: updaters,
    isLoading: isUpdatersLoading,
  } = useUsers(updatersIds);

  const {
    userPermissions: centralTenantPermissions,
    isFetching: isCentralTenantPermissionsLoading,
  } = useUserTenantPermissions({
    userId,
    tenantId: centralTenantId,
  }, {
    enabled: checkIfUserInMemberTenant(stripes),
  });

  const isUserHasEditPermission = checkIfUserInMemberTenant(stripes)
    ? hasCentralTenantPerm(centralTenantPermissions, authorityFilesAllPerm)
    : stripes.hasPerm(authorityFilesAllPerm);

  const validate = useCallback(({ items }) => {
    const validateItem = item => {
      return Object.values(authorityFilesColumns).reduce((acc, field) => {
        const error = getValidators(field)?.(item, items);

        if (error) {
          acc[field] = error;
        }

        return acc;
      }, {});
    };

    const errors = items.reduce((acc, item, index) => {
      const itemErrors = validateItem(item);

      if (!isEmpty(itemErrors)) {
        acc[index] = itemErrors;
      }

      return acc;
    }, []);

    if (errors.length) {
      return { items: errors };
    }

    return {};
  }, []);

  const formatFileForCreate = useCallback(file => {
    const fileCopy = { ...file };

    fileCopy.code = file.codes;

    delete fileCopy.codes;

    return fileCopy;
  }, []);

  const formatFileForUpdate = useCallback(file => {
    // PATCH expects only changed fields, otherwise if a record is assigned and we send a field that wasn't updated the request will fail
    const originalFile = sourceFiles.find(_file => _file.id === file.id);
    const changedFields = Object.keys(file).reduce((acc, field) => {
      if (isEqual(originalFile[field], file[field])) {
        return acc;
      }

      return { ...acc, [field]: file[field] };
    }, {});

    return {
      id: file.id,
      _version: file._version,
      ...changedFields,
    };
  }, [sourceFiles]);

  const createFile = useCallback(file => _createFile(formatFileForCreate(file)), [_createFile, formatFileForCreate]);
  const updateFile = useCallback(file => _updateFile(formatFileForUpdate(file)), [_updateFile, formatFileForUpdate]);
  const deleteFile = useCallback(id => _deleteFile(id), [_deleteFile]);

  const getReadOnlyFieldsForItem = useCallback(item => {
    /*
      For FOLIO items users can only edit baseUrl and Active fields, so we need to disable the rest
      For Local items all the fields are editable if the source file is not assigned to any Authority records.
      But since backend doesn't send this information with the source files we allow to edit all fields and show a toast in case of save error
    */
    if (item.source === SOURCES.FOLIO) {
      return [
        authorityFilesColumns.NAME,
        authorityFilesColumns.CODES,
        authorityFilesColumns.START_NUMBER,
      ];
    }

    return [];
  }, []);

  const isDataLoading = isSourceFilesLoading || isUpdatersLoading || isCentralTenantPermissionsLoading;

  return {
    canEdit: isUserHasEditPermission,
    canCreate: isUserHasEditPermission,
    canDelete: isUserHasEditPermission,
    sourceFiles,
    updaters,
    isLoading: isDataLoading,
    validate,
    getReadOnlyFieldsForItem,
    createFile,
    updateFile,
    deleteFile,
  };
};

