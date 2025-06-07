import api from '.';

export const SaveSetting = async (data: any) =>
  (
    await api.put('v1/auth/setting', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).data;
