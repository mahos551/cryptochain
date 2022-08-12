const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-fe23682b-bc2a-4045-a658-03bce9aa5f90',
    subscribeKey: 'sub-c-866ec49e-b9a5-42b3-be96-d174d4e3eba0',
    secretKey: 'sec-c-YmE0YmIzZTQtZTA0NC00OTdjLTlmZWEtZTQxZWNjZDIwMzky'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor ({blockchain}){

        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe ({ channels: Object.values(CHANNELS)});

        this.pubnub.addListener(this.listener());
        
    }

    broadcastChain() {
        this.publish({
          channel: CHANNELS.BLOCKCHAIN,
          message: JSON.stringify(this.blockchain.chain)
        });
      }

    listener() {
        return {
            message: messageObject => {
                const {channel, message} = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);
                const parsedMessage = JSON.parse(message);

                if (channel === CHANNELS.BLOCKCHAIN){
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        };
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
          channels: [Object.values(CHANNELS)]
        });
      }

    publish({channel,message}){
        this.pubnub.publish({message,channel});
    }

}


module.exports = PubSub;