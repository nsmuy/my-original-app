import React from 'react'
import { UserProfile } from '@/types/UserProfile'

type AgeRadioButtonProps = {
  age: {label: string, value: string}
  inputUserProfile: Omit<UserProfile, 'id'>
  setInputUserProfile: React.Dispatch<React.SetStateAction<Omit<UserProfile, 'id'>>>
}

const AgeRadioButton = ({age, inputUserProfile, setInputUserProfile}: AgeRadioButtonProps) => {
  return (
    <div>
      <input
        type="radio"
        id={age.label}
        name="age"
        value={age.value}
        checked={inputUserProfile?.age === age.value}
        onChange={() => setInputUserProfile({ ...inputUserProfile, age: age.value as UserProfile['age'] })}
      />
      <label htmlFor={age.label} className='ml-2'>{age.value}</label>
    </div>
  )
}

export default AgeRadioButton