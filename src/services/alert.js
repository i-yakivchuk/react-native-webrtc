import { Alert } from "react-native";


/**
 * @function showError - function for call alert with text error.
 *
 * @param text - error text.
 */
const showError = (text) => { Alert.alert(text); };

export { showError };
