import axios from 'axios';
import {
  stringify,
} from 'qs';

const getRequest = ({ headers = {}, url, params = {} }) => {
    return axios({
		method: 'GET',
		headers,
	    params,
	    url,
	});
};

const postRequest = ({ headers = {}, url, params = {}, data = {} }) => {
    return axios({
		method: 'post',
		headers,
		url,
		params,
		data,
	});
};

export default {
 	get: getRequest,
	post: postRequest,
};
