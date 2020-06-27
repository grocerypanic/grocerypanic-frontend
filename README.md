# panic-fe

[![panic_fe-Automation](https://github.com/niall-byrne/panic-fe/workflows/panic_fe-Automation/badge.svg)](https://github.com/niall-byrne/panic-fe/actions)

[View a Live Demo Deployment](https://demo.grocerypanic.com)

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
