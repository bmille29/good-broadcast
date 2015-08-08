// Load modules

var Code = require('code');
var Lab = require('lab');
var Util = require('../lib/utils');

// Test shortcuts

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

// Declare internals

var internals = {};

describe('Utils', function () {

    describe('forever()', function () {

        it('calls itself recursively asynchronously', function (done) {

            var count = 0;
            Util.recursiveAsync(0, function (value, callback) {

                value++;
                count = value;
                if (value === 10) {

                    // Do this to simulate async
                    setImmediate(function () {

                        callback(true);
                    });
                }
                else {
                    setImmediate(function () {

                        callback(null, value);
                    });
                }
            }, function (error) {

                expect(error).to.exist();
                expect(count).to.equal(10);
                done();
            });
        });

        it('throw an error if no callback supplied', function (done) {

            expect(function () {

                Util.recursiveAsync(0, function (value, callback) {

                    callback(new Error('no callback'));
                });
            }).to.throw('no callback');
            done();
        });
    });

    describe('series()', function () {

        it('calls a series of tasks in order', function (done) {

            var result = [];

            Util.series([
                function (callback) {

                    setTimeout(function () {

                        result.push(1);
                        callback(null);
                    }, 200);
                },
                function (callback) {

                    setTimeout(function () {

                        result.push(2);
                        callback(null);
                    }, 100);
                }
            ], function (err) {

                expect(err).to.not.exist();
                expect(result).to.deep.equal([1, 2]);
                done();
            });
        });

        it('calls back with an error if one occurs', function (done) {

            Util.series([
                function (callback) {

                    setTimeout(function () {

                        callback(true);
                    }, 200);
                }
            ], function (err) {

                expect(err).to.be.true();
                done();
            });
        });
    });
});
