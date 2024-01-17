import React from 'react'
import { UserProfile } from '@/types/UserProfile'

type GenderRadioButtonProps = {
  gender: {label: string, value: string},
  inputUserProfile: Omit<UserProfile, 'id'>,
  setInputUserProfile: React.Dispatch<React.SetStateAction<Omit<UserProfile, 'id'>>>
}

const GenderRadioButton = ({gender, inputUserProfile, setInputUserProfile}: GenderRadioButtonProps) => {
  return (
    <div>
      <input
        type="radio"
        id={gender.label}
        name="gender"
        value={gender.value}
        checked={inputUserProfile?.gender === gender.value}
        onChange={() => setInputUserProfile({ ...inputUserProfile, gender: gender.value as UserProfile['gender'] })}
      />
    <label htmlFor={gender.label} className='ml-2'>{gender.value}</label>
    </div>
  )
}

export default GenderRadioButton