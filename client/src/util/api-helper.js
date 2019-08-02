/* eslint-disable no-undef */
import axios from 'axios';

function getLatestIssueInfo(cb) {

  axios.get('/api/v1/lotto/last')
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

  axios.get('/api/v1/lotto/offical/?issue=' + issue)
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

  axios.post('/api/v1/lotto/new', nextLottoData)
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

  axios.get('/api/v1/notifications')
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

function getPendingActions(cb) {
  axios.get('/api/v1/action/pending').then(function (res) {
    console.log(res);
    cb(res.data);

  }).catch(function (res) {
    console.log(res);
    cb();
  });
}

function getActionText(container, action, cb) {

  axios.get('/api/v1/blob/?container=' + container + '&blob=' + action.file).then(function (res) {
    console.log(res);
    cb(res.data.content);
  }).catch(function (res) {
    console.log(res);
    cb();
  });
}

function discardAction(container, action, cb) {
  axios.delete('/api/v1/action/remove/?container=' + container + '&blob=' + action.file).then(function (res) {
    console.log(res);
    cb(res.data);
  }).catch(function (res) {
    console.log(res);
    cb();
  });
}

function commitActions(cb) {
  axios.post('/api/v1/commit').then(function (res) {
    console.log(res);
    cb(res.data.data);

  }).catch(function (res) {
    console.log(res);
    cb();
  });
}

function getUsers(platfrom, period, cb) {
  axios.get('/api/v1/users/?platform=' + platfrom + '&scope=' + period).then(function (res) {
    console.log(res);
    cb(res.data.data);

  }).catch(function (res) {
    console.log(res);
    cb();
  });
}

function preCommitReleaseChange(updatedData, cb) {

  axios.post('/api/v1/precommit', updatedData).then(function (res) {
    console.log(res);
    cb(res.data);
  }).catch(function (res) {
    console.log(res);
    cb();
  });
}

function notify(content, cb) {
  axios.post('/api/v1/notify', { platforms: [1, 2, 3], msg: content }).then(function SuccessCallback(res) {
    return cb({ data: res.data.data });
  }, function errCallback(res) {
    return cb({ err: res.data.err });
  });
}

function getLotteries(tail, count, cb) {

  axios.get('/api/v1/lotto/history/?tail=' + tail + '&count=' + count)
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

  axios.get(`/api/v1/lotto/detail/?issue=${issue}`)
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

  axios.get('/api/v1/attributes')
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

  axios.get('/api/v1/attribute/?name=' + name)
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

function getHelp(id, cb) {

  axios.get('/api/v1/help/?id=' + id)
    .then(res => {
      console.log(res);
      cb(res.data.data);
    })
    .catch(res => {
      console.log(res);
      cb();
    });
}

const APIHelper = {
  getLatestIssueInfo,
  syncLottoDetailFromWeb,
  createNewLottoRelease,
  preCommitReleaseChange,
  getNotificationTemplates,
  getPendingActions,
  getActionText,
  discardAction,
  commitActions,
  notify,
  getUsers,
  getLotteries,
  getLotterry,
  getAttributes,
  getAttribute,
  getHelp,
};
export default APIHelper;