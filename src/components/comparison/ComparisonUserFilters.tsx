'use client';

import React, { useState, useEffect, useCallback } from "react";
import { UserFilterType } from "@/types/UserProfile";
import { ageOptions, genderOptions, skinTypeOptions } from "@/constants/userData";
import { ProductWithReviewsAndRatingsType } from "@/types/Product";
import { calcAverageRatings } from "@/functions/calcAverageRatings";
import { useRouter } from "next/navigation";

type ComparisonUserFiltersProps = {
  userFilters: UserFilterType;
  setUserFilters: React.Dispatch<React.SetStateAction<UserFilterType>>;
  tableDataList: ProductWithReviewsAndRatingsType[];
  setTableDataList: React.Dispatch<React.SetStateAction<ProductWithReviewsAndRatingsType[] | null>>;
};

const ComparisonUserFilters = ({
  userFilters,
  setUserFilters,
  tableDataList,
  setTableDataList,
}: ComparisonUserFiltersProps) => {

  const router = useRouter();
  const [originalTableDataList, setOriginalTableDataList] = useState<ProductWithReviewsAndRatingsType[]>([]);

  useEffect(() => {
    const newOriginalTableDataList = JSON.parse(JSON.stringify(tableDataList));
    setOriginalTableDataList(newOriginalTableDataList);
  }, [router, tableDataList]);

  // フィルターのチェック状況を保持する状態変数
  const [isKeySelected, setIsKeySelected] = useState({
    age: false,
    gender: false,
    skinType: false,
  });

  // フィルターのチェック状況を確認する関数
  const checkUserFilters = useCallback((userFilters: UserFilterType) => {
    const updateIsKeySelected = {...isKeySelected}
    Object.entries(userFilters).forEach(([key, value]) => {
      updateIsKeySelected[key as keyof UserFilterType] = !Object.values(value).every((value) => value === false);
    })
    setIsKeySelected(updateIsKeySelected);
  },[]);

  useEffect(() => {
    checkUserFilters(userFilters);
  }, [userFilters, checkUserFilters]);

  const handleSubmitFilterTable = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let filteredTableDataList: ProductWithReviewsAndRatingsType[] = [];

    originalTableDataList.length > 0 && (
      filteredTableDataList =  originalTableDataList.map(data => {
  
        const filteredReviews = data.reviews.filter(review => {
  
          const userAgeMatch = isKeySelected.age ? (
            userFilters.age[review.userAge as keyof UserFilterType['age']]
          ) : true;
          const userGenderMatch = isKeySelected.gender ? (
            userFilters.gender[review.userGender as keyof UserFilterType['gender']]
          ): true;
          const userSkinTypeMatch = isKeySelected.skinType ? (
            userFilters.skinType[review.userSkinType as keyof UserFilterType['skinType']]
          ) : true;
  
          return userAgeMatch && userGenderMatch && userSkinTypeMatch;
        })
  
        return {
          ...data,
          reviews: filteredReviews,
          averageRatings: calcAverageRatings(filteredReviews),
        }
      })
    )

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
                  checked={userFilters.age[value as keyof UserFilterType['age']]}
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
                checked={userFilters.gender[value as keyof UserFilterType['gender']]}
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
                checked={userFilters.skinType[value as keyof UserFilterType['skinType']]}
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
