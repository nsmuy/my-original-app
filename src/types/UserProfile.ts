export type UserProfile = {
  id: string,
  nickname: string,
  age: '' | 'teen' | 'twenties' | 'thirties' | 'forties' | 'fifties' | 'sixtiesAndAbove',
  gender: '' | 'male' | 'female' | 'other',
  skinType: '' | 'normal' | 'dry' | 'mix' | 'oily' | 'sensitive' | 'atopic',
  icon: string,
}

export type UserFilter = {
  age: {
    teen: boolean,
    twenties: boolean,
    thirties: boolean,
    forties: boolean,
    fifties: boolean,
    sixtiesAndAbove: boolean,
  },
  gender: {
    male: boolean,
    female: boolean,
    other: boolean,
  },
  skinType: {
    normal: boolean,
    dry: boolean,
    combination: boolean,
    oily: boolean,
    sensitive: boolean,
    atopic: boolean,
  },
}