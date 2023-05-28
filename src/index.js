const { Gpio  } = require("onoff");
const { io } = require("socket.io-client");

const socket = io("http://localhost:3333")

const sensors = [
  {
    id: 1,
    outPin: new Gpio(23, 'in', 'both', { debounceTimeout: 10 }),
    enPin: new Gpio(24, 'out')
  },
  {
    id: 2,
    outPin: new Gpio(25, 'in', 'both', { debounceTimeout: 10 }),
    enPin: null
  }
]

const parkingSpots = sensors.map(sensor => ({ id: sensor.id, empty: true }))

console.log(`Numbers of sensors: ${sensors.length}`);

socket.emit("parking-spots", parkingSpots);

console.log('Starting...');

for (const sensor of sensors) {
  console.log(`Setting up Sensor ${sensor.id}`);
  if (sensor.enPin) {
    sensor.enPin.writeSync(1);
  }

  sensor.outPin.watch((err, value) => {  
    if(err) {
      console.error(`${sensor.id} error: `, err);
      return;
    }
  
    const spotIndex = parkingSpots.findIndex(spot => spot.id === sensor.id);
    const spotOldState = parkingSpots[spotIndex];

    if (value === 0 && spotIndex !== -1) {
      console.log(`Sensor ${sensor.id} detected something!`);
      parkingSpots[spotIndex].empty = false;
    } else {
      parkingSpots[spotIndex].empty = true;
    }

    if (spotOldState.empty !== parkingSpots[spotIndex].empty) {
      socket.emit("parking-spot-updated", parkingSpots[spotIndex]);
    }
  });
  console.log(`Sensor ${sensor.id} set up!`);
}

process.on("SIGINT", () => {
  for (const sensor of sensors) {
    sensor.outPin.unwatch();
    sensor.outPin.unexport();
  }
  console.log('\nStoping...');
  process.exit(0);
});