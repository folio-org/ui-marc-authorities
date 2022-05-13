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

import { AppContextMenu } from '@folio/stripes/core';

import commands from '../../commands';

import css from './MarcAuthoritiesAppContext.css';

const MarcAuthoritiesAppContext = () => {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const focusSearchField = handleToggle => {
    handleToggle();
    const searchElement = document.getElementById('textarea-authorities-search');

    if (searchElement) {
      searchElement.focus();
    }
  };

  const shortcutsModalToggle = (e, handleToggle) => {
    if (handleToggle) {
      handleToggle();
    }
    setIsShortcutsModalOpen(true);
  };

  const shortcuts = [{
    name: 'openShortcutModal',
    handler: shortcutsModalToggle,
  }];

  return (
    <>
      <AppContextMenu>
        {handleToggle => (
          <NavList>
            <NavListSection>
              <NavListItem
                id="marc-authorities-app-item"
                to="/marc-authorities"
                onClick={() => focusSearchField(handleToggle)}
              >
                <FormattedMessage id="ui-marc-authorities.navigation.app" />
              </NavListItem>
              <NavListItem
                onClick={e => shortcutsModalToggle(e, handleToggle)}
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
