import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 }, // scale down. Recovery stage.
  ],
};
export default () =>{
  group('visiting test webapp', function () {
      let url = `http://${__ENV.URL}/`; //$ k6 run -e URL=test.k6.io stressTesting.js
      // you will need to prefix K6_ in the environment variable name in order for k6 to evaluate it as an option parameter.
      let res = http.get(url, {
        tags: { name:'01_home'}
      });
      check(res, {
        'is status 200': (r) => r.status === 200,
        // 'text verificSation' : (r) => r.body.includes("Collection of simple web-pages suitable for load testing"), 
      }, { name:'01_check'});
     
    });
    sleep(1);
}