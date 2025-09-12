import { TouchableOpacity, Text, View } from "react-native";
import { styles } from "./styles";

export function Button({ title, leftIcon, rightIcon, style, textStyle, ...rest }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={[styles.button, style]} 
      {...rest}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <Text style={[styles.title, textStyle]}>{title}</Text>
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </TouchableOpacity>
  );
}
