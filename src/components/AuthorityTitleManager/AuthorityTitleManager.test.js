import { render } from '@folio/jest-config-stripes/testing-library/react';

import { navigationSegments } from '@folio/stripes-authority-components';

import { AuthorityTitleManager } from './AuthorityTitleManager';
import Harness from '../../../test/jest/helpers/harness';

const renderAuthorityTitleManager = (authoritiesCtxValue, selectedRecordCtxValue) => render(
  <Harness
    authoritiesCtxValue={authoritiesCtxValue}
    selectedRecordCtxValue={selectedRecordCtxValue}
  >
    <AuthorityTitleManager />
  </Harness>,
);

describe('Given AuthorityTitleManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when authority file is open', () => {
    it('should set document title to file heading', () => {
      const authority = {
        headingRef: 'Some authority',
      };

      renderAuthorityTitleManager({
        searchQuery: 'test',
      }, [authority]);

      expect(document.title).toEqual('ui-marc-authorities.documentTitle.record - FOLIO');
    });
  });

  describe('when authority file is not open', () => {
    describe('and when search was performed', () => {
      it('should set document title to search title', () => {
        renderAuthorityTitleManager({
          searchQuery: 'test',
          navigationSegmentValue: navigationSegments.search,
        }, [null]);

        expect(document.title).toEqual('ui-marc-authorities.documentTitle.search - FOLIO');
      });
    });

    describe('and when browse was performed', () => {
      it('should set document title to search title', () => {
        renderAuthorityTitleManager({
          searchQuery: 'test',
          navigationSegmentValue: navigationSegments.browse,
        }, [null]);

        expect(document.title).toEqual('ui-marc-authorities.documentTitle.browse - FOLIO');
      });
    });

    describe('and when neither search nor browse were performed', () => {
      it('should set document title to default title', () => {
        renderAuthorityTitleManager({
          searchQuery: '',
          navigationSegmentValue: navigationSegments.search,
        }, [null]);

        expect(document.title).toEqual('ui-marc-authorities.meta.title - FOLIO');
      });
    });
  });
});
