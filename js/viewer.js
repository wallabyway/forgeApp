import React, { Component } from 'react';
import { Text, View, Button, WebView, Image, AsyncStorage } from 'react-native';
import {styles} from "./styles";

import { Constants, AuthSession } from 'expo';

export default class Viewer extends Component {

    constructor(props) {
      super(props);
      this.state = {token:"", profileurl:""};
    }

    // Handle Viewer Launch
    componentDidUpdate() {
        const {state} = this.props.navigation;
        if (state.params)
          this.loadViewer(state.params.urn, this.state.token);
    }

    loadViewer(urn, token) {
      var js = `initializeViewer("urn:${urn}","${token}")`;
  		this.viewer.injectJavaScript( js );
  	}

  	render() {
      return (
        <View style={styles.container}>
          <WebView
              source={{ html: styles.viewerHTML }}
              style={styles.webview}
              javaScriptEnabled={true}
              ref = {webview => { this.viewer = webview; }}
          />
        </View>
      );
  }
}
