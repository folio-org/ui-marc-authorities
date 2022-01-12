import { MemoryRouter } from 'react-router-dom';
import {
  render,
  cleanup,
} from '@testing-library/react';

import { KeyboardShortcutsModal } from '@folio/stripes-components';

import Harness from '../test/jest/helpers/harness';

import MarcAuthorities from './index';

const match = {
  isExact: true,
  params: {},
  path: '/ui-marc-authorities',
  url: '/ui-marc-authorities',
};

const stripes = {
  connect: jest.fn(),
};

const getrenderMarcAuthorities = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <MarcAuthorities
        match={match}
        stripes={stripes}
        {...props}
      />
        Page content
    </Harness>
  </MemoryRouter>
);

const renderMarcAuthorities = (props) => render(getrenderMarcAuthorities(props));

describe('Given Marc-authorities', () => {
  beforeEach(() => {
    stripes.connect.mockClear();
  });

  afterEach(cleanup);

  it('should render Marc-authorities App Context', () => {
    const { getByText } = renderMarcAuthorities();

    expect(getByText('Page content')).toBeDefined();
  });

  it('should render keyboard shortcuts menu button', () => {
    const { getByText } = renderMarcAuthorities();

    expect(getByText('ui-marc-authorities.appMenu.keyboardShortcuts')).toBeDefined();
  });

  it('should render KeyboardShortcutsModal', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <KeyboardShortcutsModal onClose={onClose}>
        Test Modal
      </KeyboardShortcutsModal>,
    );

    expect(getByText('stripes-components.shortcut.modalLabel')).toBeDefined();
  });
});

