import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  NavList,
  NavListItem,
  NavListSection,
  Icon,
  KeyboardShortcutsModal,
  HasCommand,
  checkScope,
} from '@folio/stripes/components';

import {
  AppContextMenu,
} from '@folio/stripes/core';

import commands from '../../commands';

import css from './MarcAuthoritiesAppContext.css';

const MarcAuthoritiesAppContext = () => {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const shortcuts = [{
    name: 'openShortcutModal',
    handler: () => setIsShortcutsModalOpen(true),
  }];

  return (
    <>
      <AppContextMenu>
        {(handleToggle) => (
          <NavList>
            <NavListSection>
              <NavListItem
                id="marc-authorities-app-item"
                to="/marc-authorities"
                onClick={handleToggle}
              >
                <FormattedMessage id="ui-marc-authorities.navigation.app" />
              </NavListItem>
              <NavListItem
                onClick={() => setIsShortcutsModalOpen(true)}
              >
                <FormattedMessage id="ui-marc-authorities.navigation.keyboardShortcuts" />
              </NavListItem>
              <NavListItem
                id="content-item"
                href="https://www.loc.gov/marc/authority/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleToggle}
              >
                <Icon
                  icon="external-link"
                  iconPosition="end"
                  iconClassName={css['icon-link']}
                >
                  <FormattedMessage id="ui-marc-authorities.navigation.content" />
                </Icon>
              </NavListItem>
            </NavListSection>
          </NavList>
        )}
      </AppContextMenu>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        {isShortcutsModalOpen && (
          <KeyboardShortcutsModal
            onClose={() => setIsShortcutsModalOpen(false)}
            allCommands={[...commands]}
          />
        )}
      </HasCommand>
    </>
  );
};

export default MarcAuthoritiesAppContext;
