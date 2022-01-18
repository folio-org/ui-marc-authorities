import { FormattedMessage } from 'react-intl';

const commands = [
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
];

export default commands;
