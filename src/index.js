const { Gpio  } = require("onoff");

const sensors = [
  {
    name: "Sensor 1",
    outPin: new Gpio(23, 'in', 'both', { debounceTimeout: 10 }),
    enPin: new Gpio(24, 'out')
  },
  {
    name: "Sensor 2",
    outPin: new Gpio(25, 'in', 'both', { debounceTimeout: 10 }),
    enPin: null
  }
]

console.log(`Numbers of sensors: ${sensors.length}`);
console.log('Starting...');

for (const sensor of sensors) {
  console.log(`Setting up ${sensor.name}`);
  if (sensor.enPin) {
    sensor.enPin.writeSync(1);
  }

  sensor.outPin.watch((err, value) => {  
    if(err) {
      console.error(`${sensor.name} error: `, err);
      return;
    }
  
    if (value === 0) {
      console.log(`${sensor.name} detected something!`);
    }  
  });
  console.log(`${sensor.name} set up!`);
}

process.on("SIGINT", () => {
  for (const sensor of sensors) {
    sensor.outPin.unwatch();
    sensor.outPin.unexport();
  }
  console.log('\nStoping...');
  process.exit(0);
});