import { SERVICE_UUID, RX_CHAR_UUID, TX_CHAR_UUID } from '../constants/bluetooth';

export async function connectGoCube(setStatus, handleNotifications, txRef) {
    try {
        setStatus('Se caută dispozitivul...');
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'GoCube' }],
            optionalServices: [SERVICE_UUID]
        });

        setStatus('Se conectează...');
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);

        const tx = await service.getCharacteristic(TX_CHAR_UUID);
        txRef.current = tx;

        await tx.startNotifications();
        tx.addEventListener('characteristicvaluechanged', handleNotifications);

        setStatus('Conectat și ascultă notificări');
    } catch (e) {
        console.error(e);
        setStatus('Eroare la conectare');
    }
}

export async function stopNotifications(txRef, handleNotifications, setStatus) {
    try {
        const tx = txRef.current;
        if (!tx) return;

        tx.removeEventListener('characteristicvaluechanged', handleNotifications);
        await tx.stopNotifications();

        setStatus('Notificările au fost oprite');
    } catch (e) {
        console.error(e);
        setStatus('Eroare la oprire');
    }
}

export async function startNotifications(txRef, handleNotifications, setStatus) {
    try {
        const tx = txRef.current;
        if (!tx) return;

        tx.addEventListener('characteristicvaluechanged', handleNotifications);
        await tx.startNotifications();

        setStatus('Notificările au fost pornite');
    } catch (e) {
        console.error(e);
        setStatus('Eroare la pornire');
    }
}