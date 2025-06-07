import api from "@/api";

export const getSummaryData = async () => {
  try{
    const response = await api.get(
      '/v1/expense-summary/categories-and-currencies'
    );
    return response.data.data;
  }catch(error){
    console.log(error, "error catching cat & curr");
  }

};

export const getExpenseData = async () => {
  const response = await api.get('/v1/expense-summary/daily-flat');
  return response.data.data;
};

export const getSummaryPercentage = async () => {
  const response = await api.get('/v1/summary'
  );
  return response;
};


export const getExpenseDataFilter = async ({
  categoryId,
  currencyCode,
  startDate,
  endDate,
}) => {
  try {
    const response = await api.get(
      '/v1/expense-summary/daily-category-converted',
      {
        params: {
          categoryId,
          currencyCode,
          startDate,
          endDate,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching', error);
  }
};
