const path = require('path');

const config = {
  ROOT_DIR: __dirname,
  URL_PORT: 8080,
  CONTROLLER_DIRECTORY: path.join(__dirname, 'controllers'),
  PROJECT_DIR: __dirname,

  MQTT:{
    PROTOCOL: 'mqtt',
    HOST: 'broker.hivemq.com',
    PORT: '1883',
    options:{
      username:"",
      password:"",
      clean: true
      //TODO if it's required
    }
  },

  

  // MQTT:{
  //   PROTOCOL: 'mqtt',
  //   HOST: '108.129.48.139',
  //   PORT: '1883',
  //   options:{
  //     username:'',
  //     password:'',
  //     clean: true
  //     //TODO if it's required
  //   }
  // },

  // MQTT:{
  //   PROTOCOL: 'mqtt',
  //   HOST: 'localhost',
  //   PORT: '1883',
  //   options:{
  //     username:'',
  //     password:'',
  //     clean: true
  //     //TODO if it's required
  //   }
  // },

//TODO: if it's required
  topicDevices:"HeatmapDevicesG11",
  topicAggregator:"HeatmapAggregator/DA0",
  topicLevel:"/result/0",
  topicSetup:"HeatmapAggregator/DA0/setup",
  maxLevel:2,
  level:0



};


module.exports = config;