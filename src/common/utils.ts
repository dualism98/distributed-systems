import { networkInterfaces } from "os";

export const sleep = async (duration: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, duration))
}

export const getCurrentAddress = () => {
    const network = networkInterfaces()
    const activeInvetrace = network['eth0'] || network[Object.keys(network)[0]];

    return activeInvetrace && activeInvetrace.length > 0 ? activeInvetrace[0].address : undefined
}

export const getBroadcastAddress = () => {
    const currentAddress = getCurrentAddress();
    if (currentAddress) {
        let udpBroadcastAddress = currentAddress?.split('.')
        udpBroadcastAddress[2] = '255'
        udpBroadcastAddress[3] = '255'
    
        return udpBroadcastAddress?.join('.');
    }
}

export const makeNodeName = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}