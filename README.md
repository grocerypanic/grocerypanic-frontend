# panic-fe

### Master (Staging Environment)
[![panic_fe-Automation](https://github.com/grocerypanic/grocerypanic-frontend/workflows/panic_fe-Automation/badge.svg?branch=master)](https://github.com/grocerypanic/grocerypanic-frontend/actions)

[Staging Deploy](https://demo.grocerypanic.com)

### Production (Production Environment)
[![panic_fe-Automation](https://github.com/grocerypanic/grocerypanic-frontend/workflows/panic_fe-Automation/badge.svg?branch=production)](https://github.com/grocerypanic/grocerypanic-frontend/actions)

[Production Deploy](https://grocerypanic.com)

- [Screen Shot 1](./demo/Screen1.png)
- [Screen Shot 2](./demo/Screen2.png)
- [Screen Shot 3](./demo/Screen3.png)

## Development Dependencies

You'll need to install:

- node.js
- python2 is required for fswatch compilation

## Environment Variables

1. REACT_APP_UA_CODE

- Set this to a valid Google Analytics code for collecting statistics and website events so your team can improve the website.

2. REACT_APP_GOOGLE_ACCOUNT_ID

- Set this to a valid google service account address for login.

3. REACT_APP_FACEBOOK_ACCOUNT_ID

- Set this to a valid facebook application id for login.

4. REACT_APP_PANIC_BACKEND

- Set this to a valid root url of the panic backend.
  - ie. `http://localhost:8080`

5. REACT_APP_MAINTENANCE

- Set this to the string "true" to activate maintenance mode.

## Reference for npm commands

### Standard Commands

- `npm start`
- `npm build`
- `npm test`

### Additional Commands

- `npm run lint`
  - (Run eslint on the source files.)
- `npm run clean`
  - (Auto correct style and linting problems.)
- `npm cun coverage`
  - (Run jest unittests with coverage report.)

## Releases

- Deployment to stage is fully automated on every commit to develop. 

- Deployment to production is trigged by a release tag.

#### Production Release Tags

- The tag should constitute a 'vD.DD' format where each D creates the version of the release.

- Once the tag is created, a github release draft is created, giving you the opportunity to review the changes before a deploy. 

- Once the release is published, automatic deployment to production is triggered.  This is considered approval of the release.
