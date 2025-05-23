import {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import {
  checkScope,
  HasCommand,
} from '@folio/stripes/components';

const propTypes = {
  canEdit: PropTypes.bool,
  children: PropTypes.node.isRequired,
  focusSearchField: PropTypes.func,
  onEdit: PropTypes.func,
};

const KeyShortCutsWrapper = ({
  children,
  canEdit = false,
  onEdit = null,
  focusSearchField = null,
}) => {
  const openEditEntity = useCallback(() => {
    if (canEdit) {
      onEdit();
    }
  }, [canEdit, onEdit]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

KeyShortCutsWrapper.propTypes = propTypes;

export default KeyShortCutsWrapper;
