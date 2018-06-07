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
  Image,
  TouchableWithoutFeedback,
  Animated,
  Dimensions
} from 'react-native';
import images from './images';

type Props = {};

type State = {
  activeImage: ?string,
  selectedIndex: ?number,
  activeImagePosition: ?{
    x: number,
    y: number,
    width: number,
    height: number,
    pageX: number,
    pageY: number
  },
  imageAnimation: Animated.Value,
  closeButtonAnimation: Animated.Value
};

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};

export default class App extends Component<Props, State> {
  state = {
    activeImage: null,
    selectedIndex: null,
    activeImagePosition: null,
    imageAnimation: new Animated.Value(0),
    closeButtonAnimation: new Animated.Value(0)
  };

  constructor() {
    super();
  }

  imageKey = (img, index) => `img_${img}_${index}`;

  handleImageSelected = selectedIndex => e => {
    const image = images[selectedIndex];
    const imageRef = this.refs[this.imageKey(image, selectedIndex)];
    imageRef.measure((x, y, width, height, pageX, pageY) => {
      this.setState(
        {
          activeImage: image,
          selectedIndex,
          activeImagePosition: {
            x,
            y,
            width,
            height,
            pageX,
            pageY
          }
        },
        () => {
          Animated.timing(this.state.imageAnimation, {
            toValue: 1,
            duration: 400
          }).start(() => {
            Animated.timing(this.state.closeButtonAnimation, {
              toValue: 1,
              duration: 300
            }).start();
          });
        }
      );
    });
  };

  handleCloseButton = () => {
    this.state.closeButtonAnimation.setValue(0);
    Animated.timing(this.state.imageAnimation, {
      toValue: 0,
      duration: 450
    }).start(() => {
      this.setState({
        activeImage: null,
        selectedIndex: null,
        activeImagePosition: null
      });
    });
  };

  renderCloseButton = () => {
    if (!this.state.activeImage) {
      return null;
    }

    const opacity = this.state.closeButtonAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <TouchableWithoutFeedback onPress={this.handleCloseButton}>
        <Animated.Text style={[styles.closeText, { opacity }]}>
          Close
        </Animated.Text>
      </TouchableWithoutFeedback>
    );
  };

  renderSelectedImage = () => {
    if (!this.state.activeImage) {
      return null;
    }

    const { width, height, pageX, pageY } = this.state.activeImagePosition;

    const topValue = this.state.imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [pageY, 0]
    });

    const leftValue = this.state.imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [pageX, 0]
    });

    const widthValue = this.state.imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [width, Screen.width]
    });

    const heightValue = this.state.imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 250]
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: topValue,
          left: leftValue,
          width: widthValue,
          height: heightValue,
          backgroundColor: 'transparent'
        }}
      >
        <Animated.Image
          resizeMode="cover"
          source={this.state.activeImage}
          style={{ width: widthValue, height: heightValue }}
        />
      </Animated.View>
    );
  };

  renderImageText = () => {
    if (!this.state.activeImage) {
      return null;
    }

    const { width, height, pageX, pageY } = this.state.activeImagePosition;

    const textLeftValue = this.state.imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [pageX, 0]
    });

    const textTopValue = this.state.imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [pageY + 120, 250]
    });

    const textWidthValue = this.state.imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [width, Screen.width]
    });

    const textBottomValue = this.state.imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [Screen.height - pageY, 0]
    });

    const opacity = this.state.imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: textLeftValue,
          top: textTopValue,
          width: textWidthValue,
          bottom: textBottomValue,
          backgroundColor: '#fff'
        }}
      >
        <Animated.Text style={[styles.imageText, { opacity }]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Animated.Text>
      </Animated.View>
    );
  };

  renderGridContent() {
    return images.map((image, index) => {
      return (
        <TouchableWithoutFeedback
          key={`img_${image}_${index}`}
          onPress={this.handleImageSelected(index)}
        >
          <Image
            resizeMode="cover"
            ref={`img_${image}_${index}`}
            source={image}
            style={styles.gridImage}
          />
        </TouchableWithoutFeedback>
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
        {this.renderSelectedImage()}
        {this.renderImageText()}
        {this.renderCloseButton()}
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
  },
  closeText: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 40
      },
      android: {
        top: 20
      }
    }),
    left: 20,
    color: '#fff',
    fontSize: 18
  },
  imageText: {
    padding: 10
  }
});
