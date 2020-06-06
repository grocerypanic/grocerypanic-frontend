export const Strings = {
  en: {
    SignIn: {
      Title: "Sign In",
      LoginMessageGoogle: "Login With Google",
      LoginMessageFacebook: "Login With Facebook",
      ErrorLoginFailure: "Unable to authenticate!\nPlease try again.",
      ErrorAuthExpired: "Authentication Expired!\nPlease login again.",
      ErrorDuplicateAccount:
        "You have already signed up!\nTry logging in with another social account.",
    },
    ErrorDialogue: {
      ErrorDialogueConfirm: "OK",
      ErrorDialogueTitle: "Error!",
    },
    Copyight: {
      CopyrightDeclaration: "Copyright © ",
      CopyrightMessage: "Your Website",
    },
    App: {
      Suspense: "Suspense filled message...",
    },
    CookiePolicy: {
      CookieMessage:
        "This website would like to use cookies to measure how you as an individual interact with it.  We'll use this information to improve the service.",
      CookieAcceptText: "I'm ok with that",
      CookieDeclineText: "I Decline",
    },
    MainMenu: {
      Title: "Main Menu",
      HeaderTitle: "Panic: Main Menu",
      HelpText: "Make a selection to proceed.",
    },
    SimpleList: {
      ValidationAlreadyExists: "This already exists",
      ValidationFailure: "Enter a valid name",
      Save: "save",
      Delete: "delete",
    },
    ShelfPage: {
      Title: "Your Shelves",
      HeaderTitle: "Shelves",
      PlaceHolderMessage: "You Have No Shelves Yet.",
      HelpText:
        "Click a shelf to select, click and hold to delete.\nUse the create button to add new shelves.",
    },
    StorePage: {
      Title: "Your Stores",
      HeaderTitle: "Stores",
      PlaceHolderMessage: "You Have No Stores Yet.",
      HelpText:
        "Click a store to select, click and hold to delete.\nUse the create button to add new stores.",
    },
    Testing: {
      GenericTranslationTestString: "GenericTranslationTestString",
      GenericMultiLineTranslationTestString:
        "GenericTranslationTestString\nGenericTranslationTestString",
    },
    PlaceHolder: {
      PlaceHolderMessage: "I'm only a placeholder.",
    },
  },
};

// Export english as default for matching during tests
export default Strings.en;
