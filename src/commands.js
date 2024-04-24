import { FormattedMessage } from 'react-intl';

import { defaultKeyboardShortcuts } from '@folio/stripes/components';

const commands = [
  defaultKeyboardShortcuts.find(shortcut => shortcut.name === 'new'),
  {
    name: 'edit',
    label: (<FormattedMessage id="ui-marc-authorities.shortcut.editRecord" />),
    shortcut: 'mod+alt+e',
  },
  {
    name: 'save',
    label: (<FormattedMessage id="ui-marc-authorities.shortcut.saveRecord" />),
    shortcut: 'mod+s',
  },
  {
    name: 'search',
    label: (<FormattedMessage id="ui-marc-authorities.shortcut.goToSearchFilter" />),
    shortcut: 'mod+alt+h',
  },
  {
    name: 'openShortcutModal',
    label: (<FormattedMessage id="ui-marc-authorities.shortcut.openShortcutModal" />),
    shortcut: 'mod+alt+k',
  },
  {
    label: <FormattedMessage id="ui-marc-authorities.shortcut.nextSubfield" />,
    name: 'NEXT_SUBFIELD',
    shortcut: 'Ctrl + ]',
  },
  {
    label: <FormattedMessage id="ui-marc-authorities.shortcut.prevSubfield" />,
    name: 'PREV_SUBFIELD',
    shortcut: 'Ctrl + [',
  },
];

export default commands;
