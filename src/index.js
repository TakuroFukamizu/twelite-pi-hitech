

const SerialPort = require('serialport');

const Readline = SerialPort.parsers.Readline;
const portName = '/dev/ttyUSB0';

const options = {
    baudRate: 115200,  // ボーレートは115200
    dataBits: 8,
    parity: 'none',    // パリティなし
    stopBits: 1,
    flowControl: false  // フロー制御なしにしとく
}
const port = new SerialPort(portName, options);
const parser = port.pipe(new Readline('\r\n'));

parser.on('data', console.log)

// Open errors will be emitted as an error event
port.on('error', function(err) {
    console.log('Error: ', err.message)
  })


