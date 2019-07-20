/* eslint-disable no-undef */
import axios from 'axios';

function getLotteries(tail, count, cb) {

  axios.get('/lotto/history/?tail=' + tail + '&count=' + count)
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

function getLotterry(issue, cb) {

  axios.get(`/lotto/detail/?issue=${issue}`)
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

function getAttributes(cb) {

  axios.get('/attributes')
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

function getAttribute(name, cb) {

  axios.get('/attribute/?name=' + name)
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

const HistoryAPIHelper = {
  getLotteries,
  getLotterry,
  getAttributes,
  getAttribute,
};
export default HistoryAPIHelper;