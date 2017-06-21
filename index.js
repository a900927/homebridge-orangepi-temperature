var rf=require("fs");
var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
  Accessory = homebridge.platformAccessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerAccessory('homebridge-orangepi-temperature', 'OrangePiTemperature', OrangePiTemperature);
}

function OrangePiTemperature(log, config) {
  this.log = log;
  this.name = config["name"];
  
}

OrangePiTemperature.prototype = {
  identify: function(callback) {
    callback();
  },

  getServices: function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
      .setCharacteristic(Characteristic.Manufacturer, "OrangePi")
      .setCharacteristic(Characteristic.Model, "Zero")
      .setCharacteristic(Characteristic.SerialNumber, "Orange");
    services.push(infoService);

    var raspberrypiService = new Service.TemperatureSensor(this.name);
    raspberrypiService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getTemperature.bind(this));
    services.push(raspberrypiService);
    
    return services;
  },
  
  getTemperature: function(callback) {
    var data = rf.readFileSync("/sys/class/thermal/thermal_zone0/temp","utf-8");
    var temperature = parseFloat(data);
    this.log.debug("temperature: " + temperature);
    
    callback(null, temperature);
  }

}
