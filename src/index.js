

const SerialPort = require('serialport');
const Http = require('http');
const SocketIO = require('socket.io');

const httpPort = 8080;
const portName = '/dev/ttyUSB0';

const app = Http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync('index.html'));  
}).listen(httpPort);
const io = SocketIO.listen(app);

const options = {
    baudRate: 115200,  // ボーレートは115200
    dataBits: 8,
    parity: 'none',    // パリティなし
    stopBits: 1,
    flowControl: false,  // フロー制御なしにしとく
    parser: new SerialPort.parsers.Readline('\r\n'),
    autoOpen: false
}
const port = new SerialPort(portName, options, (err) => {
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

// Read data that is available but keep the stream in "paused mode"
port.on('readable', () => {
    let data = port.read();
    io.sockets.emit('msg', data);
    console.log('Data1:', data);
});

// Switches the port into "flowing mode"
port.on('data', (data) => {
    io.sockets.emit('msg', data);
    console.log('Data2:', data);
});

// Open errors will be emitted as an error event
port.on('error', (err) => {
    console.log('Error: ', err.message)
});


