import assets from "./assets";

export const Strings = {
  en: {
    translation: {
      MainTitle: "Panic",
      MainHeaderTitle: "Grocery Management",
      FeedBack: {
        Request1: "I would appreciate any feedback or suggestions!",
        Request2: `Please leave them${assets.nonBreakingSpace}`,
        Request3: ".",
        Link: "here",
      },
      AboutPage: {
        Title: "Panic Grocery Management",
        HeaderTitle: "About",
        Body:
          "Panic was written during the 2020 pandemic with the goal of helping folks organize their grocery shopping.\nI hadn't written a React application this complex with respect to state before, so this was an opportunity for me to learn something new.  I'm really grateful for the help and direction I recieved so that I could implement this.  Thanks very much.\nOpening photos from pixabay.com, thanks and credit goes to:\n- Alexas Fotos\n- stevepb\n\nAdditional thanks to:\n- Linh Ngo (initial designs)\n- Li Karaian (testing, ideation)\n- Adam Wright (helpful input)",
      },
      PrivacyPage: {
        Title: "Panic Grocery Management",
        HeaderTitle: "Privacy",
        PolicyFile: `${process.env.PUBLIC_URL}/privacy/en.txt`,
      },
      Maintenance: {
        Title: "Maintenance Underway",
        HeaderTitle: "Panic Grocery Management",
        Body:
          "We're currently restocking our inventory!  Give us a few minutes to straighten things up and we'll be right back.\nSeriously though, we'll make this as short as possible.  Out team will restore service shortly.",
      },
      SignIn: {
        Title: "Sign In",
        LoginMessageGoogle: "Login With Google",
        LoginMessageFacebook: "Login With Facebook",
        ErrorLoginFailure: "Unable to authenticate!\nPlease try again.",
        ErrorAuthExpired: "Authentication Expired!\nPlease login again.",
        ErrorDuplicateAccount:
          "You have already signed up!\nTry logging in with another social account.",
        PendingSocialConnection: "Connecting . . .",
      },
      ErrorDialogue: {
        ErrorDialogueHeaderTitle: "Error",
        ErrorDialogueConfirm: "OK",
        ErrorDialogueTitle: "Error!",
      },
      Copyight: {
        CopyrightDeclaration: `Created by${assets.nonBreakingSpace}`,
        CopyrightMessage: "Shared Vision Solutions",
      },
      App: {
        Suspense: "Suspense filled message...",
      },
      CookiePolicy: {
        CookieMessage:
          "This website would like to use cookies to identify users, we'll use this information to improve the service.",
        CookieAcceptText: "I'm ok with that",
        CookieDeclineText: "No, please not cookies!",
      },
      MainMenu: {
        Title: "Main Menu",
        HeaderTitle: "Main Menu",
        HelpText: "Make a selection to proceed.",
      },
      CreateItem: {
        Title: "Create New Item",
        HeaderTitle: "New Item",
        HelpText:
          "Fill out the values, click the save button to finalize.\nDon't modify quantity here.",
      },
      ItemActivity: {
        Title: "Item Activity Report",
        HeaderTitle: "Item Details",
        RecommendExpiredItems: "Expired Items Warning",
        RecommendExpiringSoon: "Item(s) Expiring Soon",
        ConsumptionCurrentInventory: "current inventory",
        ConsumptionConsumedAvgWeek: "avg used per week",
        ConsumptionConsumedAvgMonth: "avg used per month",
        ConsumptionConsumedThisWeek: "used this week",
        ConsumptionConsumedThisMonth: "used this month",
        GraphChangeEvent: "+/-",
        GraphQuantity: "Inventory",
        GraphSubTitle: "past 2 weeks",
        GraphDayShortForm: "d",
        GraphNow: "TDY",
      },
      ItemDetails: {
        Title: "Edit Item Details",
        HeaderTitle: "Item Details",
        HelpText:
          "Fill out the values, click the save button to finalize.\nDon't modify quantity here.",
        NameLabel: "Name",
        QuantityLabel: "#",
        PriceLabel: "$",
        StoresLabel: "Stores",
        SaveButton: `${assets.nonBreakingSpace}Save${assets.nonBreakingSpace}`,
        DeleteButton: "Delete",
        MultiSelectHelp: "",
        ShelvesDetail: "Where do you keep this at home?",
        ShelfLifeDetail: "How long does this item typically keep?",
        PerferredLocationDetails: "Where do you prefer to buy this?",
        ErrorUnselectedStore: "Choose a preferred stored.",
        ErrorExistingItem: "Another item has this name.",
        SaveAction: "Saved",
        DeleteAction: "Deleting ... :(",
        Tabs: {
          Edit: "Edit",
          Stats: "Stats",
        },
        GraphChangeEvent: "+/-",
        GraphQuantity: "Inventory",
        NeedShelvesAndStores:
          "Create some shelves and stores first!\nYour items need to have stores you prefer\n to shop at, and a place to be kept at home.",
        ApiCommunicationError:
          "Something went wrong!\nMaybe this doesn't exist?\nOr maybe it already exists?\nGive it another try before giving up.",
        ApiError:
          "Unable to retrieve data from the API!\nDoes this content really exist?\nRetry, or change your query.",
        ValidationAlreadyExists: "This already exists",
      },
      ItemList: {
        ApiError:
          "Unable to retrieve data from the API!\nDoes this content really exist?\nRetry, or change your query.",
      },
      InventoryPage: {
        Title: "Inventory (All)",
        HeaderTitle: "Inventory",
        HelpText:
          "Click and hold the item's name for details.\nUse the create button (upper right) to add new items.\nIncrease or decrease quantity with the buttons.",
        Save: "save",
        Delete: "delete",
        PlaceHolderMessage: "You have no items yet.",
        ErrorInsufficientInventory: "You don't have that many.",
        Quantity: {
          Title: "Quantity",
          Message: "This is how many items you have in stock.",
        },
        Expired: {
          Title: "Expired",
          Message:
            "This is how many items you have in stock that may be expired.",
        },
      },
      SimpleList: {
        ValidationAlreadyExists: "This already exists",
        ValidationFailure: "Enter a valid name",
        SaveButton: "save",
        DeleteButton: "delete",
        CreatedAction: "Created",
        DeletedAction: "Deleted",
        ApiCommunicationError:
          "Something went wrong!\nMaybe this doesn't exist?\nOr maybe it already exists?\nGive it another try before giving up.",
      },
      ShelfPage: {
        Title: "Your Shelves",
        HeaderTitle: "Shelves",
        PlaceHolderMessage: "You Have No Shelves Yet.",
        HelpText:
          "Click a shelf to select, click and hold to delete.\nUse the create button (upper right) to add new shelves.",
      },
      StorePage: {
        Title: "Your Stores",
        HeaderTitle: "Stores",
        PlaceHolderMessage: "You Have No Stores Yet.",
        HelpText:
          "Click a store to select, click and hold to delete.\nUse the create button (upper right) to add new stores.",
      },
      Testing: {
        GenericTranslationTestString: "GenericTranslationTestString",
        GenericMultiLineTranslationTestString:
          "GenericTranslationTestString\nGenericTranslationTestString",
      },
      PlaceHolder: {
        PlaceHolderMessage: "I'm only a placeholder.",
      },
      SplashPage: {
        Slide1: {
          alt: "shopping cart",
          header: "Take the fear out of pandemic shopping...",
          text1:
            "Track how often you actually use kitchen and household items. Make logical choices.",
        },
        Slide2: {
          alt: "long shopping bill",
          header: "... and give your credit card a break.",
          text1: "Walk out of the grocery store with what you really need.",
        },
        SignIn: "Sign In / Sign Up",
      },
    },
  },
};

// Export english as default for matching during tests
export default Strings.en.translation;
