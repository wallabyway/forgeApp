import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import {styles} from "./js/styles";
import FileList from './js/fileList';
import Viewer from './js/viewer';

export default TabNavigator(
  {
    Files: {
      screen: FileList,
    },
    Viewer: {
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
          case 'Files':
            iconName = `ios-information-circle${focused ? '' : '-outline'}`;
            break;
          case 'Viewer':
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
    tabBarOptions: {
      style: { backgroundColor: styles.tabBackgroundColor }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

