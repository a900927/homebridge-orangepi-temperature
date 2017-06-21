var rf=require("fs");
var Accessory, Service, Characteristic, UUIDGen;


module.exports = function(homebridge) {
  Accessory = homebridge.platformAccessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerAccessory('homebridge-pi-temperature', 'PiTemperature', PiTemperature);
}

function PiTemperature(log, config, unit, piModel) {
  this.log = log;
  this.name = config["name"];
  this.unit = config["unit"];
  this.piModel= config["piModel"];

}

PiTemperature.prototype = {
  identify: function(callback) {
    callback();
  },

  getServices: function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
      .setCharacteristic(Characteristic.Manufacturer, "Pi")
      .setCharacteristic(Characteristic.Model, this.piModel)
      .setCharacteristic(Characteristic.SerialNumber, "Orange");
    services.push(infoService);

    var piService = new Service.TemperatureSensor(this.name);
    piService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getTemperature.bind(this));
    services.push(piService);
    
    return services;
  },
  
  getTemperature: function(callback) {
    var data = rf.readFileSync("/sys/class/thermal/thermal_zone0/temp","utf-8");
    var temperature = parseFloat(data)/parseInt(this.unit); 
    this.log.debug("temperature: " + temperature);
    this.log(temperature +"/"+ parseInt(this.unit));
    callback(null, temperature);
  }

}
