/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image
} from 'react-native';
import images from './images';

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();
  }

  renderGridContent() {
    return images.map((image, index) => {
      return (
        <Image
          resizeMode="cover"
          source={image}
          style={styles.gridImage}
          key={`img_${image}_${index}`}
        />
      );
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {this.renderGridContent()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  scrollView: {
    backgroundColor: '#000'
  },
  scrollViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  gridImage: {
    width: '32.8%',
    height: 120,
    margin: 1
  }
});
