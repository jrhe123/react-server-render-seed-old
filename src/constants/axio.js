import axios from 'axios';
import { url } from '../utilities/urlPath';

const axio = axios.create({
    baseURL: `${url}/api`,
   // timeout: 8500,
    headers: {'Content-Type': 'application/json'}
});
export default axio;