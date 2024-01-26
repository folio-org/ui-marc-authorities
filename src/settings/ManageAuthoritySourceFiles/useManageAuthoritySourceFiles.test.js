import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import {
  useUsers,
  useAuthoritySourceFiles,
} from '@folio/stripes-authority-components';
import { useStripes } from '@folio/stripes/core';

import Harness from '../../../test/jest/helpers/harness';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

import { useManageAuthoritySourceFiles } from './useManageAuthoritySourceFiles';

const sourceFiles = [{
  id: 1,
  name: 'Test file 1',
  codes: ['a'],
  hridManagement: {
    startNumber: 1,
  },
  baseUrl: 'http://test-url-1',
  selectable: true,
  source: 'folio',
  metadata: {
    updatedByUserId: 'user-1',
  },
  _version: 1,
}, {
  id: 2,
  name: 'Test file 2',
  codes: ['b'],
  hridManagement: {
    startNumber: 2,
  },
  baseUrl: 'http://test-url-2',
  selectable: true,
  source: 'local',
  metadata: {
    updatedByUserId: 'user-2',
  },
  _version: 1,
}];
const mockCreateFile = jest.fn();
const mockUpdateFile = jest.fn();
const mockDeleteFile = jest.fn();
const mockOnCreateSuccess = jest.fn();
const mockOnUpdateSuccess = jest.fn();
const mockOnDeleteSuccess = jest.fn();
const mockonCreateFail = jest.fn();
const mockOnUpdateFail = jest.fn();
const mockOnDeleteFail = jest.fn();

const defaultProps = {
  onCreateSuccess: mockOnCreateSuccess,
  onCreateFail: mockonCreateFail,
  onUpdateSuccess: mockOnUpdateSuccess,
  onUpdateFail: mockOnUpdateFail,
  onDeleteSuccess: mockOnDeleteSuccess,
  onDeleteFail: mockOnDeleteFail,
};

const renderUseManageAuthoritySourceFiles = (props = {}) => renderHook(() => useManageAuthoritySourceFiles({ ...defaultProps, ...props }), { wrapper: Harness });

describe('Given useManageAuthoritySourceFiles', () => {
  const centralTenantStripes = buildStripes({
    okapi: {
      tenant: 'consortia',
    },
  });
  const singleTenantStripes = buildStripes({
    okapi: {
      tenant: 'diku',
    },
  });

  beforeEach(() => {
    useAuthoritySourceFiles.mockClear().mockReturnValue({
      sourceFiles,
      isLoading: false,
      createFile: mockCreateFile,
      updateFile: mockUpdateFile,
      deleteFile: mockDeleteFile,
    });
    useStripes.mockClear().mockReturnValue(centralTenantStripes);
    useUsers.mockClear().mockImplementation((userIds) => ({
      users: userIds,
      isLoading: false,
    }));
  });

  describe('when user is in an multi-tenant environment', () => {
    describe('when user does not have central tenant edit permissions', () => {
      beforeEach(() => {
        useStripes.mockClear().mockReturnValue({
          ...centralTenantStripes,
          hasPerm: () => false,
        });
      });

      it('should return false for canEdit, canCreate, canDelete', () => {
        const { result } = renderUseManageAuthoritySourceFiles();

        expect(result.current.canCreate).toBeFalsy();
        expect(result.current.canEdit).toBeFalsy();
        expect(result.current.canDelete).toBeFalsy();
      });
    });

    describe('when user has central tenant edit permissions', () => {
      beforeEach(() => {
        useStripes.mockClear().mockReturnValue({
          ...centralTenantStripes,
          hasPerm: () => true,
        });
      });

      it('should return true for canEdit, canCreate, canDelete', () => {
        const { result } = renderUseManageAuthoritySourceFiles();

        expect(result.current.canCreate).toBeTruthy();
        expect(result.current.canEdit).toBeTruthy();
        expect(result.current.canDelete).toBeTruthy();
      });
    });
  });

  describe('when user is in an single-tenant environment', () => {
    describe('when user does not have edit permissions', () => {
      beforeEach(() => {
        useStripes.mockClear().mockReturnValue({
          ...singleTenantStripes,
          hasInterface: () => false,
          hasPerm: () => false,
        });
      });

      it('should return false for canEdit, canCreate, canDelete', () => {
        const { result } = renderUseManageAuthoritySourceFiles();

        expect(result.current.canCreate).toBeFalsy();
        expect(result.current.canEdit).toBeFalsy();
        expect(result.current.canDelete).toBeFalsy();
      });
    });

    describe('when user has edit permissions', () => {
      beforeEach(() => {
        useStripes.mockClear().mockReturnValue({
          ...singleTenantStripes,
          hasInterface: () => false,
          hasPerm: () => true,
        });
      });

      it('should return true for canEdit, canCreate, canDelete', () => {
        const { result } = renderUseManageAuthoritySourceFiles();

        expect(result.current.canCreate).toBeTruthy();
        expect(result.current.canEdit).toBeTruthy();
        expect(result.current.canDelete).toBeTruthy();
      });
    });
  });

  it('should return a list of updaters', () => {
    const { result } = renderUseManageAuthoritySourceFiles();

    expect(result.current.updaters).toEqual(['user-1', 'user-2']);
  });

  describe('when validating an item', () => {
    describe('when there is an error', () => {
      it('should return object with failed fields', () => {
        const item = {}; // empty item will have validation errors. Doesn't matter which to test that validators return an error correctly
        const { result } = renderUseManageAuthoritySourceFiles();

        const failedProperties = Object.keys(result.current.validate(item, sourceFiles));

        expect(failedProperties).not.toHaveLength(0);
      });
    });

    describe('when there is no error', () => {
      it('should return object with no fields', () => {
        const item = {
          codes: 'validcode',
          name: 'New name',
          baseUrl: 'http://new-url/',
          startNumber: 1,
        };
        const { result } = renderUseManageAuthoritySourceFiles();

        expect(result.current.validate(item, sourceFiles)).toEqual({});
      });
    });
  });

  describe('when calling createFile', () => {
    it('should call mutator with correct data', () => {
      const item = {
        codes: 'validcode',
        name: 'New name',
        baseUrl: 'http://new-url/',
        hridManagement: {
          startNumber: 1,
        },
      };
      const { result } = renderUseManageAuthoritySourceFiles();

      result.current.createFile(item);

      expect(mockCreateFile).toHaveBeenCalledWith({
        code: 'validcode',
        name: 'New name',
        baseUrl: 'http://new-url/',
        hridManagement: {
          startNumber: 1,
        },
      });
    });
  });

  describe('when calling updateFile', () => {
    it('should call mutator with only changed fields', () => {
      const item = { ...sourceFiles[0] };
      const { result } = renderUseManageAuthoritySourceFiles();

      result.current.updateFile({
        ...item,
        name: 'Edited name',
      });

      expect(mockUpdateFile).toHaveBeenCalledWith({
        id: 1,
        name: 'Edited name',
        _version: 1,
      });
    });
  });

  describe('when calling deleteFile', () => {
    it('should call mutator file id', () => {
      const item = { ...sourceFiles[0] };
      const { result } = renderUseManageAuthoritySourceFiles();

      result.current.deleteFile(item.id);

      expect(mockDeleteFile).toHaveBeenCalledWith(item.id);
    });
  });
});
