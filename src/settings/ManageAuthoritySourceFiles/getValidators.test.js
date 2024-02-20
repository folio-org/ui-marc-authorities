import { getValidators } from './getValidators';


describe('getValidators', () => {
  describe('validating name', () => {
    const validator = getValidators('name');

    describe('when name is empty', () => {
      it('should return an error', () => {
        const item = {
          name: '',
        };
        const items = [
          item,
          {
            id: '2',
            name: 'test',
          },
        ];

        expect(validator(item, items).props.id).toBe('stripes-core.label.missingRequiredField');
      });
    });

    describe('when name is not unique', () => {
      it('should return an error', () => {
        const item = {
          name: 'test',
        };
        const items = [
          item,
          {
            id: '2',
            name: 'test',
          },
        ];

        expect(validator(item, items).props.id).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.name.unique');
      });
    });
  });

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

    describe('when codes are not alphabetic characters', () => {
      it('should return an error', () => {
        const item = {
          id: 1,
          codes: 'a1',
        };

        const items = [{
          id: 2,
          codes: ['a'],
        }, {
          id: 3,
          codes: ['b', 'c'],
        }];

        expect(validator(item, items).props.id).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.alpha');
      });
    });
  });

  describe('validating start number', () => {
    const validator = getValidators('hridManagement.startNumber');

    describe('when start number is valid', () => {
      it('should return undefined', () => {
        const item = {
          hridManagement: {
            startNumber: '1',
          },
        };

        expect(validator(item)).toBeUndefined();
      });
    });

    describe('when startNumber is empty', () => {
      it('should return an error', () => {
        const item = {
          hridManagement: {
            startNumber: '',
          },
        };

        expect(validator(item).props.id).toEqual('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.empty');
      });
    });

    describe('when start number has leading zeroes', () => {
      it('should return an error', () => {
        const item = {
          hridManagement: {
            startNumber: '0001',
          },
        };

        expect(validator(item).props.id).toEqual('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.zeroes');
      });
    });

    describe('when start number has a whitespace character', () => {
      it('should return an error', () => {
        const item = {
          hridManagement: {
            startNumber: '1 ',
          },
        };

        expect(validator(item).props.id).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.whitespace');
      });
    });

    describe('when start number has a non-numeric character', () => {
      it('should return an error', () => {
        const item = {
          hridManagement: {
            startNumber: '1+',
          },
        };

        expect(validator(item).props.id).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.notNumeric');
      });
    });

    describe('when start number has more than 10 characters', () => {
      it('should return an error', () => {
        const item = {
          hridManagement: {
            startNumber: '12345678901',
          },
        };

        expect(validator(item).props.id).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.moreThan10');
      });
    });
  });

  describe('validating base url', () => {
    const validator = getValidators('baseUrl');

    describe('when baseUrl protocol does not match "http://" or "https://"', () => {
      it('should return an error', () => {
        const item = {
          baseUrl: 'httpp://test',
        };

        expect(validator(item).props.id).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.baseUrl.protocol.invalid');
      });
    });

    describe('when baseUrl protocol is "http://"', () => {
      it('should not return an error', () => {
        const item = {
          baseUrl: 'http://test',
        };

        expect(validator(item, [])).toBeUndefined();
      });
    });

    describe('when baseUrl protocol is "https://"', () => {
      it('should not return an error', () => {
        const item = {
          baseUrl: 'https://test',
        };

        expect(validator(item, [])).toBeUndefined();
      });
    });

    describe('when the only protocols are different', () => {
      it('should return an error', () => {
        const item = {
          baseUrl: 'https://test/',
        };

        const items = [
          item,
          {
            id: '2',
            baseUrl: 'http://test/',
          },
        ];

        expect(validator(item, items).props.id).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.baseUrl.unique');
      });
    });

    describe('when the only difference is the backslash at the end', () => {
      it('should return an error', () => {
        const item = {
          baseUrl: 'http://test',
        };

        const items = [
          item,
          {
            id: '2',
            baseUrl: 'http://test/',
          },
        ];

        expect(validator(item, items).props.id).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.baseUrl.unique');
      });
    });

    describe('when baseUrl is undefined', () => {
      it('should not return an error', () => {
        const item = {
          baseUrl: undefined,
        };

        const items = [
          item,
          {
            id: '2',
            baseUrl: undefined,
          },
        ];

        expect(() => validator(item, items)).not.toThrow();
      });
    });

    describe('when baseUrl has a whitespace', () => {
      it('should return an error', () => {
        const item = {
          baseUrl: 'http://te st/',
        };

        const items = [
          item,
          {
            id: '2',
            baseUrl: 'http://test2/',
          },
        ];

        expect(validator(item, items).props.id).toBe('ui-marc-authorities.settings.manageAuthoritySourceFiles.error.baseUrl.whitespace');
      });
    });
  });
});
