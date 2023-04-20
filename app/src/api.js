import axios from 'axios';
import queryString from 'query-string';

export const getQuote = (params) => {
  const query = queryString.stringify(params);
  return axios.get('https://goerli.api.0x.org/swap/v1/quote?' + query, null, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "0x-api-key": "c9819820-eb0f-411b-9b20-3a249e5d2aa2"
    }
  })
}