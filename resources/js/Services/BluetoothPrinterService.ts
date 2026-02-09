/**
 * BluetoothPrinterService
 * Handles Web Bluetooth connection and ESC/POS command generation for thermal printers.
 */

export class BluetoothPrinterService {
    private device: BluetoothDevice | null = null;
    private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

    // ESC/POS Commands
    private readonly COMMANDS = {
        RESET: new Uint8Array([0x1b, 0x40]),
        ALIGN_LEFT: new Uint8Array([0x1b, 0x61, 0x00]),
        ALIGN_CENTER: new Uint8Array([0x1b, 0x61, 0x01]),
        ALIGN_RIGHT: new Uint8Array([0x1b, 0x61, 0x02]),
        BOLD_ON: new Uint8Array([0x1b, 0x45, 0x01]),
        BOLD_OFF: new Uint8Array([0x1b, 0x45, 0x00]),
        DOUBLE_HEIGHT_ON: new Uint8Array([0x1b, 0x21, 0x10]),
        DOUBLE_WIDTH_ON: new Uint8Array([0x1b, 0x21, 0x20]),
        TEXT_NORMAL: new Uint8Array([0x1b, 0x21, 0x00]),
        FEED_LINE: new Uint8Array([0x0a]),
    };

    /**
     * Connect to a Bluetooth Printer
     */
    async connect(): Promise<boolean> {
        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [
                    { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Common for some thermal printers
                    { namePrefix: 'InnerPrinter' },
                    { namePrefix: 'MTP' },
                    { namePrefix: 'MP' }
                ],
                optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
            });

            const server = await this.device.gatt?.connect();
            const service = await server?.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
            this.characteristic = await service?.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb') || null;

            return !!this.characteristic;
        } catch (error) {
            console.error('Bluetooth Connection Failed:', error);
            return false;
        }
    }

    /**
     * Print Receipt Data
     */
    async printReceipt(data: any): Promise<void> {
        if (!this.characteristic) {
            const connected = await this.connect();
            if (!connected) throw new Error('Printer not connected');
        }

        const encoder = new TextEncoder();

        let commands: Uint8Array[] = [
            this.COMMANDS.RESET,
            this.COMMANDS.ALIGN_CENTER,
            this.COMMANDS.DOUBLE_HEIGHT_ON,
            this.COMMANDS.BOLD_ON,
            encoder.encode(data.temple_name + '\n'),
            this.COMMANDS.TEXT_NORMAL,
            this.COMMANDS.BOLD_OFF,
            encoder.encode('SREE DHARMA SASTHA TEMPLE\n'),
            this.COMMANDS.FEED_LINE,
            this.COMMANDS.ALIGN_LEFT,
            encoder.encode('--------------------------------\n'),
            encoder.encode(`RECEIPT: ${data.receipt_number}\n`),
            encoder.encode(`DATE:    ${data.date}\n`),
            this.COMMANDS.FEED_LINE,
            this.COMMANDS.BOLD_ON,
            encoder.encode(`DEVOTEE: ${data.name}\n`),
            this.COMMANDS.BOLD_OFF,
            this.COMMANDS.FEED_LINE,
        ];

        if (data.type === 'Vazhipadu') {
            commands.push(encoder.encode(`RITUAL:  ${data.vazhipadu}\n`));
            if (data.vazhipadu_ml) {
                // Label for Malayalam Vazhipadu
                commands.push(encoder.encode(`വഴിപാട് : ${data.vazhipadu_ml}\n`));
            }

            if (data.star) {
                commands.push(encoder.encode(`STAR:    ${data.star}\n`));
            }
            if (data.star_ml) {
                commands.push(encoder.encode(`നക്ഷത്രം : ${data.star_ml}\n`));
            }
        } else {
            commands.push(encoder.encode(`PURPOSE: ${data.purpose}\n`));
        }

        commands.push(
            this.COMMANDS.FEED_LINE,
            this.COMMANDS.ALIGN_RIGHT,
            this.COMMANDS.BOLD_ON,
            this.COMMANDS.DOUBLE_WIDTH_ON,
            encoder.encode(`TOTAL: RS.${data.amount}\n`),
            this.COMMANDS.TEXT_NORMAL,
            this.COMMANDS.FEED_LINE,
            this.COMMANDS.ALIGN_CENTER,
            encoder.encode('--------------------------------\n'),
            encoder.encode('DIGITALLY SIGNED RECEIPT\n'),
            encoder.encode('OM NAMAH SHIVAYA\n'),
            this.COMMANDS.FEED_LINE,
            this.COMMANDS.FEED_LINE,
            this.COMMANDS.FEED_LINE,
        );

        for (const cmd of commands) {
            await this.characteristic?.writeValue(cmd);
        }
    }

    async disconnect() {
        if (this.device?.gatt?.connected) {
            this.device.gatt.disconnect();
        }
        this.device = null;
        this.characteristic = null;
    }
}

export const bluetoothPrinter = new BluetoothPrinterService();
