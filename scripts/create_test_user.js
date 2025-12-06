const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

(async () => {
  try {
    const user = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123!'
    };

    console.log('Registering user:', user.username);
    const reg = await post('/register', user);
    console.log('Register response:', reg.statusCode, reg.body);

    console.log('Logging in...');
    const login = await post('/login', { username: user.username, password: user.password });
    console.log('Login response:', login.statusCode, login.body);
  } catch (err) {
    console.error('Error:', err.message || err);
  }
})();
