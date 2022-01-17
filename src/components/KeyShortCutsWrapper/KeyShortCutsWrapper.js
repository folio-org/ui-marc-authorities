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
  onEdit,
  isPermission,
  focusSearchField,
}) => {
  const openEditEntity = useCallback(() => {
    if (isPermission) {
      onEdit();
    }
  }, [isPermission, onEdit]);

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

    if (onEdit) {
      shortcutsArray = [...shortcutsArray, ...editShortcuts];
    }

    if (focusSearchField) {
      shortcutsArray = [...shortcutsArray, ...searchShortcuts];
    }

    return shortcutsArray;
  }, [onEdit, focusSearchField]);

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
  onEdit: PropTypes.func,
};

export default KeyShortCutsWrapper;
