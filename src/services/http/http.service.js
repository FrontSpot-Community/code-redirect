const fetch = require('node-fetch');

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }

  return Promise.reject(new Error(response.statusText));
}

function json(response) {
  return response.json();
}


class HttpService {
  async post(url, data) {
    try {
      const result = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      });

      const response = await status(result);
      return json(response);
    } catch (err) {
        return Promise.reject(err);
    }
  }
}

module.exports = new HttpService();
