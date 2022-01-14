import {
  useCallback,
  useMemo,
} from 'react';

import PropTypes from 'prop-types';

import {
  checkScope,
  HasCommand,
} from '@folio/stripes/components';

const KeyShortcutsWrapper = ({
  children,
  toggleAllSections,
  onEdit,
  isPermission,
  focusSearchField,
}) => {
  const openEditEntity = useCallback(() => {
    if (isPermission) {
      onEdit();
    }
  }, [isPermission, onEdit]);

  const expandAllSections = useCallback((e) => {
    e.preventDefault();
    toggleAllSections(true);
  }, [toggleAllSections]);

  const collapseAllSections = useCallback((e) => {
    e.preventDefault();
    toggleAllSections(false);
  }, [toggleAllSections]);

  const toggleSectionsShortcuts = useMemo(() => {
    if (!toggleAllSections) return [];

    return ([
      {
        name: 'expandAllSections',
        handler: expandAllSections,
      },
      {
        name: 'collapseAllSections',
        handler: collapseAllSections,
      },
    ]);
  }, [collapseAllSections, expandAllSections, toggleAllSections]);

  const editShortcuts = [
    ...toggleSectionsShortcuts,
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

KeyShortcutsWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  focusSearchField: PropTypes.func,
  isPermission: PropTypes.bool,
  onEdit: PropTypes.func,
  toggleAllSections: PropTypes.func,
};

export default KeyShortcutsWrapper;
