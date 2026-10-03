import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export default { windowWidth: width, windowHeight: height, padding: 16, borderRadius: 20 };