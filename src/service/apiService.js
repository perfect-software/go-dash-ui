import axios from "axios";

export const postApiService = async (formData, BASE_URL) => {
  const url = `http://localhost:8081/api/${BASE_URL}`;
  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putApiService = async (formData, BASE_URL) => {
  const url = `http://localhost:8081/api/${BASE_URL}`;
  try {
    const response = await axios.put(url, formData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getApiService = async (BASE_URL) => {
  const url = `http://localhost:8081/api/${BASE_URL}`;
  const response = await axios.get(url);
  return response.data;
};
