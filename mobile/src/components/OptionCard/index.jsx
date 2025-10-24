import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export function OptionCard({ option, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        isSelected && styles.optionCardSelected
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionContent}>
        <View style={[styles.optionIcon, { backgroundColor: option.iconBg }]}>
          <Ionicons
            name={option.icon}
            size={24}
            color={option.iconColor}
          />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        </View>
      </View>
      <View style={styles.radioContainer}>
        <View style={[
          styles.radioOuter,
          isSelected && styles.radioSelected
        ]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};