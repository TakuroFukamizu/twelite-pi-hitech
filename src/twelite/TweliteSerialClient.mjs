
import serialPort from 'serialport';
import EventEmitter from 'events';
import TweliteReceievedPacket from './TweliteReceievedPacket';

const defaultOptions = {
    baudRate: 115200,  // ボーレートは115200
    dataBits: 8,
    parity: 'none',    // パリティなし
    stopBits: 1,
    flowControl: false,  // フロー制御なしにしとく
    parser: new serialPort.parsers.Readline('\r\n'),
    autoOpen: false
}
export default class TweliteSerialClient extends EventEmitter {
    constructor(portName) { 
        super();
        this.options = defaultOptions;
        this.portName = portName;
        this.port = new serialPort(this.portName, this.options, (err) => {
            if (err) { 
                return console.log('Error: ', err.message);
            }
        });

        this.port.open(() => {
            console.info('open SerialPort');
            // port.write(':788001000F0000000000000000F8\r\n');
            this.emit('open');
        });

        this.port.on('data', (data) => {
            try {
                // console.log(data.length);
                const msg = new TweliteReceievedPacket(data);
                this.emit('received', msg);
            } catch (ex) { 
                console.error(ex);
            }
        });
    }

}