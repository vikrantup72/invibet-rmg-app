import { baseColors } from '../constants/colors';
import React, { Component } from 'react';
import { View, TextInput, ViewStyle, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

type OTPTextInputState = {
  focusedInput: number;
  otpText: string[];
};

type OTPTextInputProps = {
  inputCount: number;
  containerStyle: ViewStyle;
  inputCellLength: number;
  handleTextChange(text: string): void;
  handleCellTextChange?(text: string, cellIndex: number): void;
  autoFocus: boolean;
};

export class OTPTextInput extends Component<OTPTextInputProps, OTPTextInputState> {
  static defaultProps: Partial<OTPTextInputProps> = {
    inputCount: 6,
    inputCellLength: 1,
    containerStyle: {},
    handleTextChange: () => {},
    autoFocus: false,
  };

  inputs: TextInput[];

  constructor(props: OTPTextInputProps) {
    super(props);
    this.state = {
      focusedInput: 0,
      otpText: this.getOTPTextChucks(props.inputCount || 4, props.inputCellLength, ''),
    };
    this.inputs = [];
  }

  getOTPTextChucks = (inputCount: number, inputCellLength: number, text: string): string[] => {
    let matches = text.match(new RegExp('.{1,' + inputCellLength + '}', 'g')) || [];

    return matches.slice(0, inputCount);
  };

  basicValidation = (text: string) => {
    const validText = /^[0-9a-zA-Z]+$/;
    return text.match(validText);
  };

  onTextChange = (text: string, i: number) => {
    const { inputCellLength, inputCount, handleTextChange, handleCellTextChange } = this.props;

    if (text && !this.basicValidation(text)) return;

    this.setState(
      (prevState: OTPTextInputState) => {
        let { otpText } = prevState;
        otpText[i] = text;
        return { otpText };
      },
      () => {
        handleTextChange(this.state.otpText.join(''));
        handleCellTextChange && handleCellTextChange(text, i);
        if (text.length === inputCellLength && i !== inputCount - 1) this.inputs[i + 1].focus();
      },
    );
  };

  onInputFocus = (i: number) => {
    const { otpText } = this.state;

    const prevIndex = i - 1;
    if (prevIndex > -1 && !otpText[prevIndex] && !otpText.join('')) {
      this.inputs[prevIndex].focus();
      return;
    }
    this.setState({ focusedInput: i });
  };

  onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, i: number) => {
    const val = this.state.otpText[i] || '';
    const { handleTextChange, inputCellLength, inputCount } = this.props;
    const { otpText } = this.state;

    if (e.nativeEvent.key !== 'Backspace' && val && i !== inputCount - 1) {
      this.inputs[i + 1].focus();
      return;
    }

    if (e.nativeEvent.key === 'Backspace' && i !== 0) {
      if (!val.length && otpText[i - 1].length === inputCellLength) {
        this.setState(
          prevState => {
            let { otpText: prevStateOtpText } = prevState;
            prevStateOtpText[i - 1] = prevStateOtpText[i - 1]
              .split('')
              .splice(0, prevStateOtpText[i - 1].length - 1)
              .join('');
            return { otpText: prevStateOtpText };
          },
          () => {
            handleTextChange(this.state.otpText.join(''));
            this.inputs[i - 1].focus();
          },
        );
      }
    }
  };

  clear = () => {
    this.setState({ otpText: [] }, () => {
      this.inputs[0].focus();
      this.props.handleTextChange('');
    });
  };

  setValue = (value: string, isPaste: boolean = false) => {
    const { inputCount, inputCellLength } = this.props;
    const updatedFocusInput = isPaste ? inputCount - 1 : value.length - 1;

    this.setState({ otpText: this.getOTPTextChucks(inputCount, inputCellLength, value) }, () => {
      if (this.inputs[updatedFocusInput]) this.inputs[updatedFocusInput].focus();
      this.props.handleTextChange(value);
    });
  };

  render() {
    const { inputCount, inputCellLength, containerStyle, autoFocus, ...textInputProps } = this.props;
    const { focusedInput, otpText } = this.state;

    return (
      <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, containerStyle]}>
        {Array.from({ length: inputCount }).map((_, i) => (
          <TextInput
            key={'otp-input-' + i}
            ref={e => {
              if (e) this.inputs[i] = e;
            }}
            style={{
              width: 58,
              margin: 5,
              height: 58,
              fontSize: 22,
              borderRadius: 5,
              fontWeight: '500',
              textAlign: 'center',
              color: baseColors.theme,
              backgroundColor: `${baseColors.themeLight}${focusedInput === i ? 25 : 10}`,
            }}
            multiline={false}
            autoCorrect={false}
            keyboardType="numeric"
            value={otpText[i] || ''}
            cursorColor={baseColors.theme}
            autoFocus={autoFocus && i === 0}
            selectionColor={baseColors.theme}
            onFocus={() => this.onInputFocus(i)}
            maxLength={this.props.inputCellLength}
            onKeyPress={e => this.onKeyPress(e, i)}
            onChangeText={text => this.onTextChange(text, i)}
            {...textInputProps}
          />
        ))}
      </View>
    );
  }
}
