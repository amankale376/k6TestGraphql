import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '3m', target: 100 }, // stay at 100 users for 10 minutes
    { duration: '1m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'logged in successfully': ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};

export default function () {

  group('visiting test webapp', function () {
    let url = `http://${__ENV.URL}/`; //$ k6 run -e URL=test.k6.io 
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