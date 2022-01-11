import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import {
  Switch,
} from 'react-router-dom';

import {
  AppContextMenu,
  Route,
} from '@folio/stripes/core';

import {
  NavList,
  NavListItem,
  NavListSection,
  CommandList,
  HasCommand,
  KeyboardShortcutsModal,
  checkScope,
} from '@folio/stripes/components';

import commands from './commands';

import {
  SearchRoute,
  AuthorityViewRoute,
  AuthorityQuickMarcEditRoute,
} from './routes';

const propTypes = {
  match: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func,
  }),
};

const MarcAuthorities = ({
  match: {
    path,
  },
}) => {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const shortcuts = [{
    name: 'openShortcutModal',
    handler: () => setIsShortcutsModalOpen(true),
  }];

  return (
    <>
      <CommandList commands={commands}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <AppContextMenu>
            {(handleToggle) => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="marc-authorities-app-item"
                    onClick={() => setIsShortcutsModalOpen(handleToggle)}
                  >
                    <FormattedMessage id="ui-marc-authorities.appMenu.keyboardShortcuts" />
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>
          <Switch>
            <Route path={`${path}/quick-marc`} component={AuthorityQuickMarcEditRoute} />
            <Route
              path={path}
              component={SearchRoute}
            >
              <Route path={`${path}/authorities/:id`} component={AuthorityViewRoute} />
            </Route>
          </Switch>
        </HasCommand>
      </CommandList>
      {isShortcutsModalOpen && (
        <KeyboardShortcutsModal
          onClose={() => setIsShortcutsModalOpen(false)}
          allCommands={[...commands]}
        />
      )}
    </ >
  );
};

MarcAuthorities.propTypes = propTypes;

export default MarcAuthorities;
