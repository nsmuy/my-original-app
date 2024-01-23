import React, { useState } from "react";
import { UserFilter } from "@/types/UserProfile";

type ComparisonUserFiltersProps = {
  userFilters: UserFilter;
  setUserFilters: React.Dispatch<React.SetStateAction<UserFilter>>;
};

const ComparisonUserFilters = ({ userFilters, setUserFilters }: ComparisonUserFiltersProps) => {

  return (
    <div>
      <form>
        {Object.entries(userFilters).map(([key, value]) => {
          if (key === 'age' || key === 'gender' || key === 'skinType') {
            return Object.entries(value).map(([subKey, subValue]) => (
              <div key={`${key}_${subKey}`}>
                <label htmlFor={`${key}_${subKey}`}>{subKey}</label>
                <input
                  id={`${key}_${subKey}`}
                  type="checkbox"
                  checked={subValue}
                  onChange={() => setUserFilters({
                    ...userFilters,
                    [key]: {
                      ...userFilters[key],
                      [subKey]: !subValue
                    }
                  })}
                />
              </div>
            ));
          }
          return null;
        })}
      </form>
    </div>
  );
};

export default ComparisonUserFilters;
