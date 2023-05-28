const { Gpio  } = require("onoff");

const ir1 = new Gpio(23, 'in', 'both', { debounceTimeout: 10 });
const ir2 = new Gpio(25, 'in', 'both', { debounceTimeout: 10 });
const en = new Gpio(24, 'out');

console.log('Executando...');

en.writeSync(1);

ir1.watch((err, value) => {  
  if(err) {
    console.error('Erro ao ler o pino', err);
    return;
  }

  if (value === 0) {
    console.log("Ir1 ativado");
  }  
});

ir2.watch((err, value) => {  
  if(err) {
    console.error('Erro ao ler o pino', err);
    return;
  }

  if (value === 0) {
    console.log("Ir2 ativado");
  }  
});

process.on("SIGINT", () => {
  ir1.unwatch();
  ir2.unwatch();
  console.log('\nEncerrando programa...');
  process.exit(0);
});