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

type Props = {
  animationStyle: 'expandCover' | 'slideUp'
};

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
  static defaultProps = {
    animationStyle: 'expandCover'
  };

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

  imageKey = (img: string, index: number) => `img_${img}_${index}`;

  expandCoverTextStyle = ({
    width,
    pageX,
    pageY
  }: {
    width: number,
    pageX: number,
    pageY: number
  }) => {
    const { imageAnimation } = this.state;

    const left = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [pageX, 0]
    });

    const top = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [pageY + 120, 250]
    });

    const widthValue = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [width, Screen.width]
    });

    const bottom = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [Screen.height - pageY, 0]
    });

    return {
      left,
      top,
      width: widthValue,
      bottom
    };
  };

  slideUpTextStyle = ({
    width,
    height,
    pageX,
    pageY
  }: {
    width: number,
    height: number,
    pageX: number,
    pageY: number
  }) => {
    const { imageAnimation } = this.state;

    const left = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [pageX, 0]
    });

    const top = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [Screen.height, 250]
    });

    const widthValue = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [width, Screen.width]
    });

    const bottom = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [Screen.height - pageY, 0]
    });

    const opacity = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return {
      top,
      left,
      bottom,
      width: widthValue,
      opacity
    };
  };

  handleImageSelected = (selectedIndex: number) => (e: any) => {
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
          Animated.spring(this.state.imageAnimation, {
            toValue: 1
          }).start(() => {
            Animated.timing(this.state.closeButtonAnimation, {
              toValue: 1,
              duration: 200
            }).start();
          });
        }
      );
    });
  };

  handleCloseButton = () => {
    const { closeButtonAnimation, imageAnimation } = this.state;

    closeButtonAnimation.setValue(0);
    Animated.timing(imageAnimation, {
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
    const { closeButtonAnimation, activeImage } = this.state;

    if (!activeImage) {
      return null;
    }

    const opacity = closeButtonAnimation.interpolate({
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
    const { activeImage, activeImagePosition, imageAnimation } = this.state;

    if (!activeImagePosition) {
      return null;
    }

    const {
      width,
      height,
      pageX,
      pageY
    }: {
      width: number,
      height: number,
      pageX: number,
      pageY: number
    } = activeImagePosition;

    const topValue = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [pageY, 0]
    });

    const leftValue = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [pageX, 0]
    });

    const widthValue = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [width, Screen.width]
    });

    const heightValue = imageAnimation.interpolate({
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
          source={activeImage}
          style={{ width: widthValue, height: heightValue }}
        />
      </Animated.View>
    );
  };

  renderImageText = () => {
    const { activeImagePosition, imageAnimation } = this.state;
    const { animationStyle } = this.props;

    if (!activeImagePosition) {
      return null;
    }

    let animStyle = {};
    if (animationStyle === 'expandCover') {
      animStyle = this.expandCoverTextStyle(activeImagePosition);
    } else if (animationStyle === 'slideUp') {
      animStyle = this.slideUpTextStyle(activeImagePosition);
    }

    const opacity = imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: '#fff',
          ...animStyle
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
