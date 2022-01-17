import { MemoryRouter } from 'react-router-dom';
import {
  render,
} from '@testing-library/react';

import MarcAuthoritiesAppContext from './MarcAuthoritiesAppContext';

const renderMarcAuthoritiesAppContext = () => render(
  <MemoryRouter>
    <MarcAuthoritiesAppContext />
  </MemoryRouter>,
);

describe('Given MARC Authorities App Context', () => {
  describe('when click on page name "MARC Authorities" ', () => {
    it('should render context MARC Authorities app link', () => {
      const { getByText } = renderMarcAuthoritiesAppContext();

      expect(getByText('ui-marc-authorities.navigation.app')).toBeDefined();
    });

    it('should render submit MARC Authorities documentation link', () => {
      const { getByText } = renderMarcAuthoritiesAppContext();

      expect(getByText('ui-marc-authorities.navigation.content')).toBeDefined();
    });

    it('should render keyboard shortcuts menu button', () => {
      const { getByText } = renderMarcAuthoritiesAppContext();

      expect(getByText('ui-marc-authorities.navigation.keyboardShortcuts')).toBeDefined();
    });

    it('should not render shortcuts modal', () => {
      const { queryByText } = renderMarcAuthoritiesAppContext();

      expect(queryByText('stripes-components.shortcut.modalLabel')).toBeNull();
    });
  });
});

