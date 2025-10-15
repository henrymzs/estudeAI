import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { styles } from "./styles";

export function Input({ leftIcon, rightIcon, isPassword = false, style, error, testID, ...rest }) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const finalRightIcon = isPassword ? (
        <TouchableOpacity
            onPress={togglePasswordVisibility}
            testID="password-toggle"
        >
            <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={18}
                color={passwordVisible ? '#2563EB' : '#666'}
            />
        </TouchableOpacity>
    ) : rightIcon;

    const finalSecureTextEntry = isPassword ? !passwordVisible : rest.secureTextEntry;

    return (
        <View style={styles.container}>
            <View style={[
                styles.inputContainer,
                error && styles.inputContainerError]}>
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
                    testID={testID}
                    {...rest}
                />

                {finalRightIcon && (
                    <View style={styles.rightIconContainer}>
                        {finalRightIcon}
                    </View>
                )}
            </View>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
}
