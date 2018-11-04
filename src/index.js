

const SerialPort = require('serialport');

const Readline = SerialPort.parsers.Readline;
const portName = '/dev/ttyUSB0';

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
port.on('readable', function () {
    console.log('Data:', port.read())
});

// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log('Data:', data)
});

// Open errors will be emitted as an error event
port.on('error', (err) => {
    console.log('Error: ', err.message)
});


