export const INITIAL_AUTHORITY_VALUES = {
  marcFormat: 'AUTHORITY',
  leader: String.raw`00000nz\\a2200000o\\4500`,
  fields: [
    {
      tag: '001',
      content: '',
    },
    {
      tag: '005',
      content: '',
    },
    {
      tag: '008',
      content: {
        'Undef_18': '\\\\\\\\\\\\\\\\\\\\',
        'Undef_30': '\\',
        'Undef_34': '\\\\\\\\',
        'Geo Subd': '\\',
        'Roman': 'a',
        'Lang': '|',
        'Kind rec': 'a',
        'Cat Rules': 'd',
        'SH Sys': 'z',
        'Series': '|',
        'Numb Series': '|',
        'Main use': 'a',
        'Subj use': 'a',
        'Series use': '|',
        'Type Subd': 'a',
        'Govt Ag': '|',
        'RefEval': '|',
        'RecUpd': 'a',
        'Pers Name': '|',
        'Level Est': '|',
        'Mod Rec': '|',
        'Source': 'd',
      },
    },
    {
      tag: '999',
      indicators: [
        'f',
        'f',
      ],
      content: '',
    },
  ],
};
