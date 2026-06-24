import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Basic Vite + React + TS config for the Vault Theo scaffold. Build output goes to `dist`,
// which the Azure Static Web Apps workflow deploys (output_location: "dist").
export default defineConfig({
  plugins: [react()],
});
