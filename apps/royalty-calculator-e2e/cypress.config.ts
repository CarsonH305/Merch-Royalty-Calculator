import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run royalty-calculator:serve',
        production: 'nx run royalty-calculator:build:production',
      },
      ciWebServerCommand: 'nx run royalty-calculator:serve',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
