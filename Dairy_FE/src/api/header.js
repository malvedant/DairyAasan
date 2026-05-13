const getHeaders = (token) => {
  const headers = {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${token}`,
  };
  return headers;
};
  export default getHeaders;