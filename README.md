# homebridge-orangepi-temperature
a homebridge plugin that gets orange pi CPU temperatures.

**
**if your pi is raspberry then "unit": "1000"
**if your pi is orange then "unit": "1"
**

# Configuration
    "accessories": [
        {
          "accessory": "PiTemperature",
          "name": "Pi"
          "piModel": "Orangepi",
          "unit": "1"
        }
     ],
