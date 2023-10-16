import app, { init } from './app';

const port = +process.env.PORT || 5000;

init().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
});
