import { ageOptions, genderOptions, skinTypeOptions } from '@/constants/userData';

export const getProfileOptionsLabel = ( option, value ) => {

  if(!value) {
    return '未設定'
  }

  switch (option) {
    case 'age':
      return ageOptions.find(ageOption => ageOption.value === value).label
    case 'gender':
      return genderOptions.find(genderOption => genderOption.value === value).label
    case 'skinType':
      return skinTypeOptions.find(skinTypeOption => skinTypeOption.value === value).label
  }
}