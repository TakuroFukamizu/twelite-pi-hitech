
const serialPort = require('serialport');
const portName = '/dev/ttyUSB0';

var options = {
    baudRate: 115200,  // ボーレートは115200
    dataBits: 8,
    parity: 'none',    // パリティなし
    stopBits: 1,
    flowControl: false,  // フロー制御なしにしとく
    parser: serialPort.parsers.readline("\r\n")   // パースは\r\nで
};

var sp = new serialPort.SerialPort(portName, options);

sp.on('data', function(input) {
    try {
        console.log(input);
    } catch(e) {
        return;
    }
});


