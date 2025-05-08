// export const authLoader = async () => {
//   try {
//     const user = await queryClient.ensureQueryData({
//       queryKey: ['me'],
//       queryFn: fetchMe,
//       staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
//       retry: 1, // Reduce retries to avoid infinite loops
//     });

//     useAuthDataStore.getState().setUser(user); // ✅ Store user in Zustand
//     return user;
//   } catch {
//     sessionStorage.removeItem('accessToken');
//     sessionStorage.removeItem('refreshToken');
//     useAuthDataStore.getState().setUser(null); // Reset store on failure
//     return null;
//   }
// };
