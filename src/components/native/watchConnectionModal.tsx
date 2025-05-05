import { useSetAuthValue } from "../../atoms/auth";
import { baseColors } from "../../constants/colors";
import { useAsyncStorage } from "../../hooks/useAsyncStorage";
import { Spinner } from "../spinner";
import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Div, Overlay, Text } from "react-native-magnus";
import { useDispatch, useSelector } from "react-redux";

export type Connection = { isConnected: boolean; isConnecting: boolean };
type WatchConnectionModalProps = {
  open: boolean;
  connection: Connection;
  setConnection: Dispatch<SetStateAction<Connection>>;
  closeModal: () => void;
  onSuccess: () => void;
};

export function WatchConnectionModal(props: WatchConnectionModalProps) {
  const [loading, setLoading] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [bleDevices, setBleDevices] = useState<string[][]>([]);

  useEffect(() => {
    if (!props.connection?.isConnected) return;
    setLoading(false);
    props.closeModal();
    props.onSuccess();
  }, [props.connection?.isConnected]);

  return (
    <Overlay visible={props.open} p={0}>
      <Div pt={20} px={10} justifyContent="center" alignItems="center" mb={60}>
        {bleDevices.map((device, index) => (
          <Button
            key={index}
            h={55}
            w="100%"
            bg={baseColors.white}
            color={baseColors.theme}
            rounded={0}
            roundedBottomRight={6}
            onPress={() => alert("onSelectDevice function here..")}
          >
            <Text>
              {device[0]} := {device[1]}
            </Text>
          </Button>
        ))}

        {!bluetoothOn ? (
          <Text>Please turn on the Bluetooth on your phone</Text>
        ) : null}
        {bluetoothOn && loading ? <Spinner color={baseColors.theme} /> : null}
      </Div>

      {bluetoothOn ? (
        <Div
          w="100%"
          flexDir="row"
          borderTopColor={baseColors.themeLight}
          borderTopWidth={1}
          position="absolute"
          bottom={0}
        >
          <Button
            w="100%"
            bg={baseColors.themeLight}
            color={baseColors.white}
            onPress={props.closeModal}
            rounded={0}
            roundedBottom={6}
          >
            Cancel
          </Button>
        </Div>
      ) : null}
    </Overlay>
  );
}
