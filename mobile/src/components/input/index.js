import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { styles } from "./styles";

export function Input({ leftIcon, rightIcon, isPassword = false, style, ...rest }) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const finalRightIcon = isPassword ? (
        <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={18}
                color={passwordVisible ? '#2563EB' : '#666'} 
            />
        </TouchableOpacity>
    ) : rightIcon;

    const finalSecureTextEntry = isPassword ? !passwordVisible : rest.secureTextEntry;

    return (
        <View style={styles.inputContainer}>
            {leftIcon && (
                <View style={styles.leftIconContainer}>
                    {leftIcon}
                </View>
            )}

            <TextInput
                style={[
                    styles.input,
                    leftIcon && styles.inputWithLeftIcon,
                    (rightIcon || isPassword) && styles.inputWithRightIcon,
                    style
                ]}
                secureTextEntry={finalSecureTextEntry}
                {...rest}
            />

            {finalRightIcon && (
                <View style={styles.rightIconContainer}>
                    {finalRightIcon}
                </View>
            )}
        </View>
    );
}
