export const GENDER = Object.freeze({
  MALE: {
    value: 1,
    key: 'MALE',
    label: 'Male',
  },
  FEMALE: {
    value: 2,
    key: 'FEMALE',
    label: 'Female',
  },
  OTHER: {
    value: 3,
    key: 'OTHER',
    label: 'Other',
  },
});

export const COOKIE_CONSTANTS = Object.freeze({
  ACCESS_TOKEN: 'productivity_access_token',
  REFRESH_TOKEN: 'productivity_refresh_token',
});

export const PRODUCTS = Object.freeze({
  POMODORO_TIMER: 1,
  TODO_LIST: 2,
  NOTES: 4,
  BUDGET_TRACKER: 3,
});
