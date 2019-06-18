/* eslint-disable no-undef */
import axios from 'axios';

function getLotteries(tail, count, cb) {

  axios.get('/lotto/?tail=' + tail + '&count=' + count)
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
  getLotteries
};
export default HistoryAPIHelper;