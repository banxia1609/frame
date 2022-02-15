
let Mock = require("mockjs"); //引入mock模块


var http = require('http');
// var server = http.createServer();
console.log(http, http.ServerResponse)
let express = require('express')
console.log(express, 'express')


Mock.mock('/passport/login', function (options) {
    console.log('进来了')
    return {
        status: 200,
        data: {
            token: 123
        }
    }
  })