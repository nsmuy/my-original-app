import React from 'react'
import { UserProfile } from '@/types/UserProfile'

type UserProfileRadioButtonProps = {
  profileAttribute: 'age' | 'gender' | 'skinType';
  option: {label: string, value: string};
  inputUserProfile: Omit<UserProfile, 'id'>;
  setInputUserProfile: React.Dispatch<React.SetStateAction<Omit<UserProfile, 'id'>>>
}

const UserProfileRadioButton = ({profileAttribute, option, inputUserProfile, setInputUserProfile}: UserProfileRadioButtonProps) => {
  return (
    <div>
    <input
      type="radio"
      id={option.label}
      name={profileAttribute}
      value={option.value}
      checked={inputUserProfile[profileAttribute] === option.value}
      onChange={() => setInputUserProfile({ ...inputUserProfile, [profileAttribute]: option.value })}
    />
    <label htmlFor={option.label} className='ml-2'>{option.value}</label>
  </div>
  )
}

export default UserProfileRadioButton