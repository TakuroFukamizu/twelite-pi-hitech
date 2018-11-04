
import fs from 'fs';
import http from 'http';
import socketIO from 'socket.io';
import serialPort from 'serialport';
import dotenv from 'dotenv';
import { TweliteReceievedPacket } from './twelite/TweliteReceievedPacket';

dotenv.config();

const httpPort = 8080;
const portName = process.env.TL_USB_PORT;
// const portName = '/dev/ttyUSB0';
const terminalId = process.env.TL_PAIR_TERMINAL_ID;

const app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync('dist/index.html'));  
}).listen(httpPort);
const io = socketIO.listen(app);



const options = {
    baudRate: 115200,  // ボーレートは115200
    dataBits: 8,
    parity: 'none',    // パリティなし
    stopBits: 1,
    flowControl: false,  // フロー制御なしにしとく
    parser: new serialPort.parsers.Readline('\r\n'),
    autoOpen: false
}
const port = new serialPort(portName, options, (err) => {
    if (err) { 
        return console.log('Error: ', err.message);
    }
});
// const parser = port.pipe(new Readline('\r\n'));
// parser.on('data', console.log)
port.open(() => {
    console.info('open SerialPort');
    // port.write(':788001000F0000000000000000F8\r\n');
});

// // Read data that is available but keep the stream in "paused mode"
// port.on('readable', () => {
//     let data = port.read();
//     io.sockets.emit('msg', data);
//     console.log('Data1:', data);
// });
// Data: 124 81 15 01 162 2164328241 0 14202 0 true
// Data: 124 81 15 01 165 2164328241 0 296 0 true
// Switches the port into "flowing mode"
port.on('data', (data) => {
    try {
        // console.log(data.length);
        const msg = new TweliteReceievedPacket(data);
        if (msg.dataType != 81) return; // not data packet
        if (!msg.checkComplete()) return; // data is invalid
        if (msg.terminalId != terminalId); // not pair
        const jsonObj = msg.toJsonObject();
        io.sockets.emit('msg', jsonObj);
        console.log('Data:',
            msg.deviceId, msg.dataType, msg.packetId, msg.protocol, msg.signal, msg.terminalId, msg.toId, msg.timestamp, msg.repeaterFlag,
            msg.digialIn[0]);
    } catch (ex) { 
        console.error(ex);
    }
});

// Open errors will be emitted as an error event
port.on('error', (err) => {
    console.log('Error: ', err.message)
});


