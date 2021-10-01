import { check, group } from 'k6';
import http from 'k6/http';

export let options = {
  discardResponseBodies: false, // keep this true if you does not wnat
  batch:3, //limits concurency in requests
 
  scenarios:{
    perVU:{
      executor:'per-vu-iterations',
      vus:100,
      iterations:200,
      maxDuration:'30m',
    
    },
  },
  // stages: [
  //   { duration: '30s', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
  //   { duration: '2m', target: 100 }, // stay at 100 users for 10 minutes
  //   { duration: '30s', target: 0 }, // ramp-down to 0 users
  // ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    http_req_failed: ['rate<0.01'], // http failed mus be less than 10%
  },
};


export default function (){
  group('hitting basic graphql api', function (){
    let loginQuery  = `
    { Login(loginInput:{
          username:"user",
          password:"password",
        }){
          message
        }
      }
    `;
    let signupQuery = `
    mutation{
      SignUp(SignupInput:{
        name:"aman",
        username:"aman",
        email:"aman@gmail.com",
        password:"password"
      }){
        id
      }
    }
    `;
    let getUsers = `
    {
      ListUsers(input:{page:1, limit:5}){
        username, name, email
      }
    }`
    let headers = {
      'Content-Type': 'application/json',
    };
    
    let responses = http.batch([
      ['POST', 'http://localhost:3000/graphql', JSON.stringify({ query: loginQuery }), {headers:headers}],
      ['POST', 'http://localhost:3000/graphql', JSON.stringify({ query: signupQuery }), {headers:headers}],
      ['POST', 'http://localhost:3000/graphql', JSON.stringify({ query: getUsers }), {headers:headers}],
      
    ]);
    // let res = http.post('http://localhost:3000/graphql', JSON.stringify({ query: query1 }), {headers:headers});
    
    check(responses[0], {
      'login response was 200': (r) => r.status === 200,
      'Login success':(r) => r.body.includes("You are logged in"),
    });
    check(responses[1], {
      'signup response was 200': r => r.status === 200,
      'Signup success':(r) => r.body.includes("SignUp"),
  });
  check(responses[2], {
    'listUsers response was 200': r => r.status === 200,
    'ListUsers success':(r) => r.body.includes("ListUsers"),
});
  });
}