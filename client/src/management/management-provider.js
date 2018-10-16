/* eslint-disable no-undef */
import $ from 'jquery';
import axios from 'axios';

function getLatestIssue(cb) {
  return $.getJSON(`/last`, {
    accept: "application/json"
  })
    //.then(checkStatus)
    //.then(parseJSON)
    .then(cb);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function getNotificationTemplates(cb) {

  axios.get('/notifications')
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

function notify(content, cb) {
  axios.post('/notify', { platforms: [1, 2, 3], msg: content }).then(function SuccessCallback(res) {
    return cb({ data: res.data.data });
  }, function errCallback(res) {
    return cb({ err: res.data.err });
  });
}

const ManagementAPIHelper = { getLatestIssue, getNotificationTemplates, notify };
export default ManagementAPIHelper;