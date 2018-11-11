
import fs from 'fs';
import path from 'path';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import dotenv from 'dotenv';
import TweliteSerialClient from './twelite/TweliteSerialClient';
import TweliteReceievedPacket from './twelite/TweliteReceievedPacket';

dotenv.config();

const httpPort = 8080;
const portName = process.env.TL_USB_PORT;
// const portName = '/dev/ttyUSB0';
const terminalId = process.env.TL_PAIR_TERMINAL_ID;

// -----

const app = express();
app.use(express.static(path.join('dist')));

const http_ = http.createServer(app);
// const app = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end(fs.readFileSync('dist/index.html'));  
// }).listen(httpPort);
// const io = socketIO.listen(app);
const io = socketIO(http_);

http_.listen(httpPort, () => {
    console.log(`listening on *:${httpPort}`);
});


// -----

const twelite = new TweliteSerialClient(portName);
twelite.on('received', (msg) => { 
    try {
        if (msg.dataType != 81) return; // not data packet
        if (!msg.checkComplete()) return; // data is invalid
        if (msg.terminalId != terminalId); // not pair
        const jsonObj = msg.toJsonObject();
        io.sockets.emit('msg', jsonObj);
        console.log('Data:',
            msg.deviceId, msg.dataType, msg.packetId, msg.protocol, msg.signal, msg.terminalId, msg.toId, msg.timestamp, msg.repeaterFlag,
            msg.battery,
            msg.digialIn[0]);
    } catch (ex) { 
        console.error(ex);
    }

});

// // const parser = port.pipe(new Readline('\r\n'));
// // parser.on('data', console.log)
// port.open(() => {
//     console.info('open SerialPort');
//     // port.write(':788001000F0000000000000000F8\r\n');
// });

// // Open errors will be emitted as an error event
// port.on('error', (err) => {
//     console.log('Error: ', err.message)
// });


