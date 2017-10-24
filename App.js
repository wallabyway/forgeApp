import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import {styles} from "./js/styles";
import FileList from './js/fileList';
import Viewer from './js/viewer';

export default TabNavigator(
  {
    FileTab: {
      screen: FileList,
    },
    ViewerTab: {
      screen: Viewer,
    },
/*
    Settings: {
      screen: SettingsScreen,
    },
    */
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'FileTab':
            iconName = `ios-information-circle${focused ? '' : '-outline'}`;
            break;
          case 'ViewerTab':
            iconName = `ios-link${focused ? '' : '-outline'}`;
            break;
          case 'Settings':
            iconName = `ios-options${focused ? '' : '-outline'}`;
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? styles.tabIcon_Selected : styles.tabIcon}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

