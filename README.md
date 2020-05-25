# panic-fe

[![panic_fe-Automation](https://github.com/niall-byrne/panic-fe/workflows/panic_fe-Automation/badge.svg)](https://github.com/niall-byrne/panic_fe/actions)

## Development Dependencies

You'll need to install:

- node.js
- python2 is required for fswatch compilation

## Environment Variables

1. REACT_APP_UA_CODE

- Set this to a valid Google Analytics code for collecting statistics and website events so your team can improve the website.

2. GOOGLE_ACCOUNT_ID

- Set this to a valid google service account address for login.

3. FACEBOOK_ACCOUNT_ID

- Set this to a valid facebook application id for login.

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
