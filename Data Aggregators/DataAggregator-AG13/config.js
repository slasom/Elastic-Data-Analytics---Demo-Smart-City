const path = require('path');

const config = {
  ROOT_DIR: __dirname,
  URL_PORT: 8082,
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
  topicDevices:"HeatmapDevicesG13",
  topicAggregator:"HeatmapAggregator/DA13",
  topicLevel:"/result/1/2",
  topicSetup:"HeatmapAggregator/DA13/setup",
  maxLevel:2,
  level:2



};


module.exports = config;