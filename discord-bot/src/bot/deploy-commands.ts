import { deployCommands } from './commands';

deployCommands().then(() => {
  console.log('Slash commands deployed');
}).catch((e) => {
  console.error(e);
  process.exit(1);
});

