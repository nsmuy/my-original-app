'use client';

import React, { useState, useEffect } from "react";
import { UserFilter } from "@/types/UserProfile";
import { ageOptions, genderOptions, skinTypeOptions } from "@/constants/userData";
import { ProductWithReviewsAndRatings } from "@/types/Product";
import { calcAverageRatings } from "@/functions/calcAverageRatings";

type ComparisonUserFiltersProps = {
  userFilters: UserFilter;
  setUserFilters: React.Dispatch<React.SetStateAction<UserFilter>>;
  tableDataList: ProductWithReviewsAndRatings[];
  setTableDataList: React.Dispatch<React.SetStateAction<ProductWithReviewsAndRatings[] | null>>;
};

const ComparisonUserFilters = ({
  userFilters,
  setUserFilters,
  tableDataList,
  setTableDataList,
}: ComparisonUserFiltersProps) => {

  const [isKeySelected, setIsKeySelected] = useState({
    age: false,
    gender: false,
    skinType: false,
  });

  // フィルターのチェック状況を確認する
  const checkUserFilters = (userFilters: UserFilter) => {
    const updateIsKeySelected = {...isKeySelected}
    Object.entries(userFilters).forEach(([key, value]) => {
      updateIsKeySelected[key as keyof UserFilter] = !Object.values(value).every((value) => value === false);
    })

    setIsKeySelected(updateIsKeySelected);
  }

  useEffect(() => {
    checkUserFilters(userFilters);
  }, [userFilters]);

  const handleSubmitFilterTable = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filteredTableDataList = tableDataList.map(data => {

      const filteredReviews = data.reviews.filter(review => {

        const userAgeMatch = isKeySelected.age ? (
          userFilters.age[review.userAge as keyof UserFilter['age']]
        ) : true;
        const userGenderMatch = isKeySelected.gender ? (
          userFilters.gender[review.userGender as keyof UserFilter['gender']]
        ): true;
        const userSkinTypeMatch = isKeySelected.skinType ? (
          userFilters.skinType[review.userSkinType as keyof UserFilter['skinType']]
        ) : true;

        return userAgeMatch && userGenderMatch && userSkinTypeMatch;
      })

      return {
        ...data,
        reviews: filteredReviews,
        averageRatings: calcAverageRatings(filteredReviews),
      }
    })

    console.log('filteredTableDataList', filteredTableDataList)
    setTableDataList(filteredTableDataList);
  }

  return (
    <div>
      <h2>ユーザーの絞り込み</h2>
      <form onSubmit={handleSubmitFilterTable}>
        <div>
          <h3 className="font-bold mt-4">年齢層</h3>
            {/* 年齢層を選択 */}
            {ageOptions.map(({ label, value }) => (
              <div key={`age_${value}`} className="inline-block mr-4">
                <input
                  type="checkbox"
                  id={`age_${value}`}
                  name="age"
                  value={value}
                  checked={userFilters.age[value as keyof UserFilter['age']]}
                  onChange={(e) => setUserFilters({
                    ...userFilters,
                    age: {
                      ...userFilters.age,
                      [value]: e.target.checked
                    } 
                  })}
                />
                <label htmlFor={`age_${value}`}>{label}</label>
              </div>
            ))}
        </div>

        <div>
          <h3 className="font-bold mt-4">性別</h3>
          {/* 性別を選択 */}
          {genderOptions.map(({ label, value }) => (
            <div key={`gender_${value}`} className="inline-block mr-4">
              <input
                type="checkbox"
                id={`gender_${value}`}
                name="gender"
                value={value}
                checked={userFilters.gender[value as keyof UserFilter['gender']]}
                onChange={(e) => setUserFilters({
                  ...userFilters,
                  gender: {
                    ...userFilters.gender,
                    [value]: e.target.checked
                  } 
                })}
              />
              <label htmlFor={`gender_${value}`}>{label}</label>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-bold mt-4">肌質</h3>
          {/* 肌質を選択 */}
          {skinTypeOptions.map(({ label, value }) => (
            <div key={`skinType_${value}`} className="inline-block mr-4">
              <input
                type="checkbox"
                id={`skinType_${value}`}
                name="skinType"
                value={value}
                checked={userFilters.skinType[value as keyof UserFilter['skinType']]}
                onChange={(e) => setUserFilters({
                  ...userFilters,
                  skinType: {
                    ...userFilters.skinType,
                    [value]: e.target.checked
                  } 
                })}
              />
              <label htmlFor={`skinType_${value}`}>{label}</label>
            </div>
          ))}
        </div>

        <button type="submit">絞り込む</button>
      </form>
    </div>
  );
};

export default ComparisonUserFilters;
