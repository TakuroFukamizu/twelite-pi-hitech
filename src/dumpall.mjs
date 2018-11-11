
import dotenv from 'dotenv';
import TweliteSerialClient from './twelite/TweliteSerialClient';

dotenv.config();

const portName = process.env.TL_USB_PORT;
// const portName = '/dev/ttyUSB0';

const twelite = new TweliteSerialClient(portName);
twelite.on('received', (msg) => { 
    try {
        console.log(JSON.stringify(msg.toJsonObject()));
    } catch (ex) { 
        console.error(ex);
    }
});
