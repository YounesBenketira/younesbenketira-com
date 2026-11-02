import { progress } from './loading.js';

let preparation;

export function prepareSurroundings() {
  preparation ??= new Promise((resolve, reject) => {
    const worker = new Worker(new URL(CITY_WORKER_URL, document.baseURI), { type: 'module' });
    const timeout = setTimeout(() => finish(new Error('City loading timed out')), 90000);
    function finish(error, result) {
      clearTimeout(timeout);
      worker.terminate();
      if (error) reject(error);
      else resolve(result);
    }
    worker.onerror = () => finish(new Error('City worker failed'));
    worker.onmessage = ({ data }) => {
      if (data.error) finish(new Error(data.error));
      else if (data.meshes) finish(null, data);
      else progress('city', data.progress);
    };
    const url = new URL('./data/algiers-context.json', document.baseURI).href;
    worker.postMessage({ url });
  });
  return preparation;
}
