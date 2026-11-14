import { StyleSheet } from 'react-native';

const commonTheme = {
  selectedMenuItemBackground: 'rgba(0, 122, 255, 0.1)',
  selectedMenuItemText: '#007AFF',
  errorTextColor: '#ff0000',
  menuOverlayColor: 'rgba(0, 0, 0, 0.5)',
  formContainerPadding: 10,
  mainContentContainerFlex: 1,
  menuIconPosition: 10,
  menuItemIconMargin: 15,
};

export const lightTheme = {
  ...commonTheme,
  backgroundColor: '#fff',
  textColor: '#000',
  borderColor: '#eee',
  inputBackground: '#fff',
  inputTextColor: '#000',
  inputBorderColor: 'gray',
  menuBackground: 'white',
  menuItemBackground: 'transparent',
  userItemBackground: '#fff',
  userItemBorderColor: '#eee',
  userDetailColor: '#666',
  deleteButtonColor: '#ff0000',
  menuLineColor: 'black',
  titleBarColor: '#fff',
};

export const darkTheme = {
  ...commonTheme,
  backgroundColor: '#333',
  textColor: '#fff',
  borderColor: '#666',
  inputBackground: '#444',
  inputTextColor: '#fff',
  inputBorderColor: '#666',
  menuBackground: '#333',
  menuItemBackground: 'transparent',
  userItemBackground: '#444',
  userItemBorderColor: '#666',
  userDetailColor: '#ccc',
  deleteButtonColor: '#ff6b6b',
  menuLineColor: '#fff',
  titleBarColor: '#333',
};

const commonStyles = {
  container: {
    flex: 1,
    paddingTop: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuContent: {
    padding: 15,
    marginTop: 20,
    marginLeft: 10,
    borderRadius: 10,
    width: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuLine: {
    width: 25,
    height: 3,
    marginVertical: 3,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    width: '100%',
  },
  landscapeFormContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  inputError: {
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 5,
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 5,
  },
  menuIcon: {
    position: 'absolute',
    zIndex: 10,
    padding: 5,
  },
  titleBar: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  mainContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  menuItemIcon: {
    marginRight: 15,
  },
  parameterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  userInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
  },
  deleteButtonPressed: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
};

export const createThemeStyles = (isDark: boolean) => {
  const theme = isDark ? darkTheme : lightTheme;

  return StyleSheet.create({
    ...commonStyles,
    container: {
      ...commonStyles.container,
      backgroundColor: theme.backgroundColor,
    },
    input: {
      ...commonStyles.input,
      borderColor: theme.inputBorderColor,
      backgroundColor: theme.inputBackground,
      color: theme.inputTextColor,
    },
    userItem: {
      ...commonStyles.userItem,
      borderBottomColor: theme.userItemBorderColor,
      backgroundColor: theme.userItemBackground,
    },
    menuContent: {
      ...commonStyles.menuContent,
      backgroundColor: theme.menuBackground,
    },
    menuItem: {
      ...commonStyles.menuItem,
      backgroundColor: theme.menuItemBackground,
    },
    menuLine: {
      ...commonStyles.menuLine,
      backgroundColor: theme.menuLineColor,
    },
    titleText: {
      ...commonStyles.titleText,
      color: theme.textColor,
    },
    userDetail: {
      ...commonStyles.userDetail,
      color: theme.userDetailColor,
    },
    userName: {
      ...commonStyles.userName,
      color: theme.textColor,
    },
    content: {
      ...commonStyles.content,
      paddingHorizontal: theme.formContainerPadding,
    },
    formContainer: {
      ...commonStyles.formContainer,
      paddingHorizontal: theme.formContainerPadding,
    },
    inputError: {
      ...commonStyles.inputError,
      borderColor: theme.errorTextColor,
    },
    errorText: {
      ...commonStyles.errorText,
      color: theme.errorTextColor,
    },
    menuOverlay: {
      ...commonStyles.menuOverlay,
      backgroundColor: theme.menuOverlayColor,
    },
    menuHeader: {
      ...commonStyles.menuHeader,
      borderBottomColor: theme.borderColor,
    },
    menuIcon: {
      ...commonStyles.menuIcon,
      top: theme.menuIconPosition,
      left: theme.menuIconPosition,
    },
    titleBar: {
      ...commonStyles.titleBar,
      backgroundColor: theme.titleBarColor,
    },
    mainContentContainer: {
      ...commonStyles.mainContentContainer,
      flexGrow: theme.mainContentContainerFlex,
    },
    menuItemIcon: {
      ...commonStyles.menuItemIcon,
      marginRight: theme.menuItemIconMargin,
    },
    selectedMenuItem: {
      backgroundColor: theme.selectedMenuItemBackground,
    },
    selectedMenuItemText: {
      color: theme.selectedMenuItemText,
      fontWeight: '500',
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  });
}; 