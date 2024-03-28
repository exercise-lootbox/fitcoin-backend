import request from 'request';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const client_id = process.env.STRAVA_CLIENT_ID;
const client_secret = process.env.STRAVA_CLIENT_SECRET;
const redirect_uri = process.env.STRAVA_REDIRECT_URI;
const auth_link = 'https://www.strava.com/api/v3/oauth/token';

export const loginRoute = async (req, res) => {
  const scope = 'activity:read_all';

  if (client_id) {
    console.log('Client ID:', client_id);
    const params = new URLSearchParams({
      client_id: client_id,
      redirect_uri: redirect_uri,
      response_type: 'code',
      approval_prompt: 'auto',
      scope: scope
    });
    res.redirect(
      'https://www.strava.com/api/v3/oauth/authorize?' + params.toString()
    );
  }
};

export const callback = async (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code;
  const grant_type = 'authorization_code';

  try {
    const authOptions = {
      url: auth_link,
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        grant_type
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64')
      }
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const responseBody = JSON.parse(body);
        const access_token = responseBody.access_token;
        const refresh_token = responseBody.refresh_token;
        const expires_at = responseBody.expires_at;
        const expires_in = responseBody.expires_in;
        console.log('responseBody:', responseBody);

        // we can also pass the token to the browser to make requests from there
        if (access_token) {
          const params = new URLSearchParams({
            access_token: access_token,
            refresh_token: refresh_token,
            expires_in: expires_in,
            code: code
          });

          // try {
          //   // getting userID from the localstorage
          //   const hashedToken = localStorage.getItem('jwtToken');
          //   if (hashedToken && process.env.JWT_SECRET) {
          //     const decodedID = jwt.verify(hashedToken, process.env.JWT_SECRET);

          //     // addToken(
          //     //   decodedID.userId,
          //     //   access_token,
          //     //   refresh_token,
          //     //   expires_at,
          //     //   expires_in,
          //     //   scope,
          //     // )
          //   }
          // } catch (e) {
          //   console.log('JWT token is not valid');
          // }

          // we have everything that we need, access_token, refresh_token
          console.log('params:', params.toString());
          res.redirect('http://localhost:3000/?' + params.toString());
        } else {
          const params = new URLSearchParams({
            error: 'invalid_token'
          });
          res.redirect('http://localhost:3000/?' + params.toString());
        }
      }
    });
  } catch (error) {
    console.error('Error during OAuth:', error);
    res.status(500).json({ error: 'Failed to authenticate with Strava' });
  }
};

export const refreshToken = async (req, res) => {
  const refresh_token = req.query.refresh_token;
  try {
    const authOptions = {
      url: auth_link,
      body: JSON.stringify({
        client_id,
        client_secret,
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64')
      }
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        res.send({
          access_token: access_token
        });
      }
    });
  } catch (error) {
    console.error('Error during OAuth:', error);
    res.status(500).json({ error: 'Failed to authenticate with Strava' });
  }
};
