import { baseColors } from '../constants/colors';
import { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { Button, Div, Overlay, Text } from 'react-native-magnus';

export type SelectDeviceModalProps = PropsWithChildren<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  bleDevices: string[][];
  onSelectDevice: (deviceAddress: string) => void;
}>;

export function SelectDeviceModal(props: SelectDeviceModalProps) {
  return (
    <Overlay visible={props.open} p={0}>
      <Div pt={20} px={10} justifyContent="center" alignItems="center" mb={60}>
        {props.bleDevices.map((device, index) => (
          <Button
            key={index}
            h={55}
            w="100%"
            bg={baseColors.white}
            color={baseColors.theme}
            rounded={0}
            roundedBottomRight={6}
            onPress={() => props.onSelectDevice(device[0])}>
            <Text>
              {device[0]} := {device[1]}
            </Text>
          </Button>
        ))}
      </Div>

      <Div w="100%" flexDir="row" borderTopColor={baseColors.themeLight} borderTopWidth={1} position="absolute" bottom={0}>
        <Button w="100%" bg={baseColors.themeLight} color={baseColors.white} onPress={() => props.setOpen(false)} rounded={0} roundedBottom={6}>
          Cancel
        </Button>
      </Div>
    </Overlay>
  );
}
