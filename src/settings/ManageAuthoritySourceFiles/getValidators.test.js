import { getValidators } from './getValidators';


describe('getValidators', () => {
  describe('validating codes', () => {
    const validator = getValidators('codes');

    describe('when codes is valid', () => {
      it('should return undefined', () => {
        const item = {
          codes: 'a',
        };

        expect(validator(item, [])).toBeUndefined();
      });
    });

    describe('when codes is empty', () => {
      it('should return an error', () => {
        const item = {
          codes: '',
        };

        expect(validator(item).props.id).toEqual('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.empty');
      });
    });

    describe('when there are multiple codes', () => {
      it('should return an error', () => {
        const item = {
          codes: 'a,b',
        };

        expect(validator(item).props.id).toEqual('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.onlyOnePrefix');
      });
    });

    describe('when codes are not unique', () => {
      it('should return an error', () => {
        const item = {
          id: 1,
          codes: 'c',
        };

        const items = [{
          id: 2,
          codes: ['a'],
        }, {
          id: 3,
          codes: ['b', 'c'],
        }];

        expect(validator(item, items).props.id).toEqual('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.unique');
      });
    });
  });

  describe('validating start number', () => {
    const validator = getValidators('hridManagement.startNumber');

    describe('when start number is valid', () => {
      it('should return undefined', () => {
        const item = {
          startNumber: '1',
        };

        expect(validator(item)).toBeUndefined();
      });
    });

    describe('when startNumber is empty', () => {
      it('should return an error', () => {
        const item = {
          startNumber: '',
        };

        expect(validator(item).props.id).toEqual('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.empty');
      });
    });

    describe('when start number has leading zeroes', () => {
      it('should return an error', () => {
        const item = {
          startNumber: '0001',
        };

        expect(validator(item).props.id).toEqual('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.zeroes');
      });
    });
  });
});
