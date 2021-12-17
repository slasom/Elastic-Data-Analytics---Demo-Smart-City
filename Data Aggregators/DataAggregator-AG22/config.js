const path = require('path');

const config = {
  ROOT_DIR: __dirname,
  URL_PORT: 8084,
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
  topicDevices:"HeatmapDevicesG22",
  topicAggregator:"HeatmapAggregator/DA22",
  topicLevel:"/result/2/2",
  topicSetup:"HeatmapAggregator/DA22/setup",
  level:2,
  maxLevel:2



};


module.exports = config;