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

const HistoryAPIHelper = {
  getLotteries,
  getLotterry,
};
export default HistoryAPIHelper;