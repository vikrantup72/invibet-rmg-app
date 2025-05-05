import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export const genders = ['female', 'male', 'non-binary', 'prefer-not-to-say'] as const;
export type Gender = (typeof genders)[number];

// heights from 3'0" to 6'12"
export const heightValues = Array.from({ length: 4 }).reduce<string[]>(
  (acc, _, i) => [...acc, ...Array.from({ length: 13 }).map((_, j) => `${i + 3}'${j}"`)],
  [],
);

export const heightValuesInCm = [
  ...Array.from({ length: 101 }).map((_, cm) => `${cm}`), // Adding 0 to 100 cm
  ...Array.from({ length: 4 }).reduce<string[]>(
    (acc, _, i) => [
      ...acc,
      ...Array.from({ length: 13 }).map((_, j) => {
        const feet = i + 3;
        const inches = j;
        const cm = Math.round((feet * 30.48 + inches * 2.54) * 100) / 100; // Convert to cm and round to 2 decimal places
        return `${cm}`;
      }),
    ],
    [],
  ),
];







// weights from 40 to 160
export const weightValues = Array.from({ length: 120 }).map((_, i) => `${i + 40}`);

export const diseases = ['diabetes', 'cholestrol', 'injury', 'breathing-issue', 'none'] as const;
export type Disease = (typeof diseases)[number];

export const actives = ['active', 'slightly-active', 'not-active'] as const;
export type Active = (typeof actives)[number];

export type ProfileData = {
  gender: Gender;
  age: number;
  height: string;
  heightIndex: number;
  weight: string;
  weightIndex: number;
  health_issues: Disease[];
  howActive: Active;
};

const defaultProfileData: ProfileData = {
  gender: 'female',
  age: 28,
  height: heightValuesInCm[20],
  heightIndex: 20,
  weight: weightValues[5],
  weightIndex: 5,
  health_issues: ['none'],
  howActive: 'active',
};

export const profileDataAtom = atom<ProfileData>({
  key: 'profileDataAtom',
  default: defaultProfileData,
});

export const useProfileDataValue = () => useRecoilValue(profileDataAtom);

export const useSetProfileDataValue = () => useSetRecoilState(profileDataAtom);

export const useProfileDataState = () => useRecoilState(profileDataAtom);
