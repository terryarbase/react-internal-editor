import _ from 'lodash';

const applyRequestHeaders = (req, headers) => {
	_.keys(headers).forEach(key => req.setRequestHeader(key, headers[key]));
};

const createCORSRequest = (method, url) => {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr){
        xhr.open(method, url, true);
    } 
    return xhr;
}

export const DownloadFile = (
  url,
  {
  	headers={},
  	method='GET',
  	responseType='blob',
  	credentials=false,
  	withCredentials=false,
  	onProgress,
  }={},
) => new Promise((resolve, reject) => {
	const req = createCORSRequest(method, url);
	if (req){
		// req.open(method, url, true);
		req.withCredentials = withCredentials || credentials === 'include';
		req.responseType = responseType;

		applyRequestHeaders(req, headers);
		// event listener
		req.addEventListener('load', () => {
			const ok = req.status >= 200 && req.status < 300;
			const reader = new FileReader();
            reader.readAsDataURL(req.response); 
            reader.onloadend = () => resolve(reader.result);
		});
		// event listener
		if (!!onProgress) {
			req.addEventListener('progress', e => {
			    onProgress(e);
			});
		}
		// event listener
		req.addEventListener('error', reject);
		req.addEventListener('abort', reject);
		req.send();
	} else {
		reject(new Error('Your browser is not supporting XMLHttpRequest.'));
	}
});