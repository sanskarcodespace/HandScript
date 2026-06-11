/**
 * Server entry point (listen, graceful shutdown)
 */
import app from './src/app';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// TODO: Implement graceful shutdown for SIGTERM/SIGINT
