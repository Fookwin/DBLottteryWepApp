/* eslint-disable no-undef */
import $ from 'jquery';
import axios from 'axios';

function getLatestIssueInfo(cb) {

  axios.get('/lotto/last')
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

function syncLottoDetailFromWeb(issue, cb) {

  axios.get('/lotto/offical/?issue=' + issue)
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

function createNewLottoRelease(nextLottoData, cb) {

  axios.post('/lotto/new', nextLottoData)
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
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

const ManagementAPIHelper = { getLatestIssueInfo, syncLottoDetailFromWeb, createNewLottoRelease, getNotificationTemplates, notify };
export default ManagementAPIHelper;