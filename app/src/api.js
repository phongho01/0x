import axios from 'axios';
import queryString from 'query-string';

export const getQuote = (params) => {
  const query = queryString.stringify(params);
  return axios.get('https://goerli.api.0x.org/swap/v1/quote?' + query, null, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "0x-api-key": "ae355ae5-850e-4913-8151-bc096c88053f"
    }
  })
}