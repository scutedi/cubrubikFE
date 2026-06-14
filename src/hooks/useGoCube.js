import { useCallback, useRef, useState } from "react";

import { SERVICE_UUID, RX_CHAR_UUID, TX_CHAR_UUID } from "../constants/cube";
import { decodeRotationPacket } from "../utils/goCubeProtocol";

export function useGoCube(onRotation) {
  const [status, setStatus] = useState("Neconectat");

  const txRef = useRef(null);
  const listeningRef = useRef(false);

  const onRotationRef = useRef(onRotation);
  onRotationRef.current = onRotation;

  const handleValueChanged = useCallback((event) => {
    const bytes = Array.from(new Uint8Array(event.target.value.buffer));
    const rotation = decodeRotationPacket(bytes);
    if (rotation) onRotationRef.current?.(rotation);
  }, []);

  const startNotifications = useCallback(async () => {
    const tx = txRef.current;
    if (!tx || listeningRef.current) return;
    try {
      await tx.startNotifications();
      tx.addEventListener("characteristicvaluechanged", handleValueChanged);
      listeningRef.current = true;
      setStatus("Conectat");
    } catch (e) {
      console.error("Eroare la pornirea notificărilor:", e);
    }
  }, [handleValueChanged]);

  const stopNotifications = useCallback(async () => {
    const tx = txRef.current;
    if (!tx) return;
    tx.removeEventListener("characteristicvaluechanged", handleValueChanged);
    try {
      await tx.stopNotifications();
    } catch {
    }
    listeningRef.current = false;
  }, [handleValueChanged]);

  const connect = useCallback(async () => {
    try {
      setStatus("Se caută dispozitivul...");
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "GoCube" }],
        optionalServices: [SERVICE_UUID],
      });

      setStatus("Se conectează...");
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      await service.getCharacteristic(RX_CHAR_UUID);
      txRef.current = await service.getCharacteristic(TX_CHAR_UUID);

      await stopNotifications();
      await startNotifications();
    } catch (e) {
      console.error(e);
      setStatus("Eroare la conectare");
    }
  }, [startNotifications, stopNotifications]);

  return { status, connect, startNotifications, stopNotifications };
}
