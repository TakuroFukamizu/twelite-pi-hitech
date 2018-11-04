

/* 
https://mono-wireless.com/jp/products/TWE-APPS/App_Twelite/step3-81.html
データフォーマット
:788115017581000038002899000C04230000FFFFFFFFFFD4
 ^1^2^3^4^5^^^^^^^6^7^^^8^9^^^a^b^c^de1e2e3e4ef^g

 1: 1バイト：送信元の論理デバイスID (0x78 は子機からの通知)
 2: 1バイト：コマンド(0x81: IO状態の通知)
 3: 1バイト：パケット識別子 (アプリケーションIDより生成される)
 4: 1バイト：プロトコルバージョン (0x01 固定)
 5: 1バイト：LQI値、電波強度に応じた値で 0xFF が最大、0x00 が最小
 6: 4バイト：送信元の個体識別番号
 7: 1バイト：宛先の論理デバイスID
 8: 2バイト：タイムスタンプ (秒64カウント)
 9: 1バイト：中継フラグ(中継回数0~3)
 a: 2バイト：電源電圧[mV]
 b: 1バイト：未使用
 c: 1バイト：D1バイト：I の状態ビット。DI1(0x1) DI2(0x2) DI3(0x4) DI4(0x8)。1がOn(Lowレベル)。
 d: 1バイト：DI の変更状態ビット。DI1(0x1) DI2(0x2) DI3(0x4) DI4(0x8)。1が変更対象。
 e1～e4: AD1～AD4の変換値。0～2000[mV]のAD値を16で割った値を格納。
 ef: AD1～AD4の補正値　（LSBから順に２ビットずつ補正値、LSB側が　AD1, MSB側が AD4）
 g: 1バイト：チェックサム
*/

export class TweliteReceievedPacket { 
    constructor(buffer) { 
        this._rawBuffer = buffer;
        this.deviceId = parseInt(buffer.slice(1, 3).toString(), 16);
        this.dataType = buffer.slice(3, 5).toString();   // fixed 0x81
        this.packetId = buffer.slice(5, 7).toString();
        this.protocol = buffer.slice(7, 9).toString();
        this.signal = parseInt(buffer.slice(9,11).toString(), 16);
        this.terminalId = parseInt(buffer.slice(11,19).toString(), 16);
        this.toId = parseInt(buffer.slice(19,21).toString(), 16);
        this.timestamp = parseInt(buffer.slice(21,25).toString(), 16);
        this.repeaterFlag = parseInt(buffer.slice(25,27).toString(), 16);
        this.battery = parseInt(buffer.slice(27,31).toString(), 16);
    
        const rawDigitalIn = parseInt(buffer.slice(33,35).toString(), 16);
        this.digialIn = [
            (rawDigitalIn >> 0 & 1) ? true : false,
            (rawDigitalIn >> 1 & 1) ? true : false,
            (rawDigitalIn >> 2 & 1) ? true : false,
            (rawDigitalIn >> 3 & 1) ? true : false,
        ];
    
        const rawDigitalChanged = parseInt(buffer.slice(35,37).toString(), 16);
        this.digialChanged = [
            (rawDigitalChanged >> 0 & 1) ? true : false,
            (rawDigitalChanged >> 1 & 1) ? true : false,
            (rawDigitalChanged >> 2 & 1) ? true : false,
            (rawDigitalChanged >> 3 & 1) ? true : false, 
        ]
        this.analogIn = [
            parseInt(buffer.slice(37,39).toString(), 16),
            parseInt(buffer.slice(39,41).toString(), 16),
            parseInt(buffer.slice(41,44).toString(), 16),
            parseInt(buffer.slice(43,45).toString(), 16),
        ]
        this.analogOffset = parseInt(buffer.slice(45,47).toString(), 16);
        this.checksum = parseInt(buffer.slice(47,49).toString(), 16);
    }
    
    checkComplete() {
        if (this._rawBuffer.length < 32) return false; // 26, 25, 31 など短いサイズで受信することがある
        if (isNaN(this.signal)) return false;
        if (isNaN(this.terminalId)) return false;
        if (isNaN(this.toId)) return false;
        if (isNaN(this.timestamp)) return false;
        if (isNaN(this.repeaterFlag)) return false;
        if (isNaN(this.battery)) return false;
        return true;
    }

    toJsonObject() { 
        return {
            deviceId: this.deviceId,
            dataType: this.dataType,
            packetId: this.packetId,
            protocol: this.protocol,
            signal: this.signal,
            terminalId: this.terminalId,
            toId: this.toId,
            timestamp: this.timestamp,
            repeaterFlag: this.repeaterFlag,
            battery: this.battery,
            digialIn: this.digialIn,
            digialChanged: this.digialChanged,
            analogIn: this.analogIn,
            analogOffset: this.analogOffset,
            checksum: this.checksum
        }
    }
}