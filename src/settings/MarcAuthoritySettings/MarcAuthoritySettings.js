import { useIntl } from 'react-intl';
import {
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { TitleManager } from '@folio/stripes/core';
import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';
import { Settings } from '@folio/stripes/smart-components';

import { ManageAuthoritySourceFiles } from '../ManageAuthoritySourceFiles';
import { VersionHistory } from '../VersionHistory';

const MarcAuthoritySettings = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const { formatMessage } = useIntl();

  const pages = [
    {
      component: ManageAuthoritySourceFiles,
      label: formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.pane.title' }),
      route: 'manage-authority-files',
      perm: 'ui-marc-authorities.settings.authority-files.view',
    },
    {
      component: VersionHistory,
      label: formatMessage({ id: 'ui-marc-authorities.settings.versionHistory.pane.title' }),
      route: 'version-history',
      perm: 'ui-marc-authorities.settings.version-history',
    },
  ];

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <TitleManager page={formatMessage({ id: 'ui-marc-authorities.settings.html.page.title' })}>
        <Settings
          match={match}
          location={location}
          paneTitle={formatMessage({ id: 'ui-marc-authorities.settings.heading' })}
          pages={pages}
        />
      </TitleManager>
    </CommandList>
  );
};

export { MarcAuthoritySettings };
