import {
  useCallback,
  useMemo,
} from 'react';

import PropTypes from 'prop-types';

import {
  checkScope,
  HasCommand,
} from '@folio/stripes/components';

const KeyShortCutsWrapper = ({
  children,
  canEdit,
  isPermission,
  focusSearchField,
}) => {
  const openEditEntity = useCallback(() => {
    if (isPermission) {
      canEdit();
    }
  }, [isPermission, canEdit]);

  const editShortcuts = [
    {
      name: 'edit',
      handler: openEditEntity,
    },
  ];

  const searchShortcuts = [
    {
      name: 'search',
      handler: focusSearchField,
    },
  ];

  const shortcuts = useMemo(() => {
    let shortcutsArray = [];

    if (canEdit) {
      shortcutsArray = [...shortcutsArray, ...editShortcuts];
    }

    if (focusSearchField) {
      shortcutsArray = [...shortcutsArray, ...searchShortcuts];
    }

    return shortcutsArray;
  }, [canEdit, focusSearchField]);

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      {children}
    </HasCommand>
  );
};

KeyShortCutsWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  focusSearchField: PropTypes.func,
  isPermission: PropTypes.bool,
  canEdit: PropTypes.func,
};

export default KeyShortCutsWrapper;
