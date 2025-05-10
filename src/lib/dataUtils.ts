type ObjectToArray<T> = T[keyof T] & { keyName: keyof T };

export const objectToArray = <T extends Record<string, object>>(
  obj: T
): ObjectToArray<T>[] => {
  return Object.entries(obj).map(([name, data]) => ({
    keyName: name as keyof T,
    ...data,
  })) as ObjectToArray<T>[];
};
