import { baseColors } from '../constants/colors';
import { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { Button, ButtonProps, Div, Overlay } from 'react-native-magnus';

export type ConfirmModalProps = PropsWithChildren<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  primaryButtonProps: ButtonProps;
}>;

export function ConfirmModal(props: ConfirmModalProps) {
  return (
    <Overlay visible={props.open} p={0}>
      <Div pt={20} px={10} justifyContent="center" alignItems="center" mb={60}>
        {props.children}
      </Div>

      <Div w="100%" flexDir="row" borderTopColor={baseColors.themeLight} borderTopWidth={1} position="absolute" bottom={0}>
        <Button h={55} w="50%" bg={baseColors.white} color={baseColors.theme} onPress={() => props.setOpen(false)} rounded={0} roundedBottomLeft={6}>
          Cancel
        </Button>
        <Button {...props.primaryButtonProps} w="50%" h={55} bg={baseColors.theme} rounded={0} roundedBottomRight={6} />
      </Div>
    </Overlay>
  );
}
