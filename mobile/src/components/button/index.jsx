import { TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";

export function Button({ title, style, textStyle, ...rest }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={[styles.button, style]} 
      {...rest}
    >
      <Text style={[styles.title, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

