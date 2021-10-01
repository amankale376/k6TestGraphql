//Smoke test is a regular load test, configured for minimal load. You want to run a smoke test as a sanity check every time you write a new script or modify an existing script.

import { check, group } from 'k6';
import http from 'k6/http';

export let options = {
    vus:1,
    duration:'1m',
    thresholds:{
        http_req_duration: ['p(99)<1500'],
    },
}
export default () =>{
    group('visiting test webapp', function () {
        let url = `http://${__ENV.URL}/`; //$ k6 run -e URL=test.k6.io smokeTesting.js
        // you will need to prefix K6_ in the environment variable name in order for k6 to evaluate it as an option parameter.
        let res = http.get(url, {
          tags: { name:'01_home'}
        });
        check(res, {
          'is status 200': (r) => r.status === 200,
          // 'text verificSation' : (r) => r.body.includes("Collection of simple web-pages suitable for load testing"), 
        }, { name:'01_check'});
       
      });
}

