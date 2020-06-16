import { createButton } from "react-social-login-buttons";

import { tertiary, white } from "../../configuration/theme";

const config = {
  text: "Connecting ...",
  style: { background: tertiary, color: white },
  activeStyle: { background: tertiary, color: white },
  icon: "null",
};

export default createButton(config);
