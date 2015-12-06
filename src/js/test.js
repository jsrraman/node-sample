'use strict';

/******************************************************************
 Illustration: exporting function vs object from a module
 ******************************************************************/

/******************************************************************
 Convention 1

 In the calling module (assume appTest.js in the same directory),
 you should call like below

 const Test = require('./test.js');
 const test = new Test();

 test.printMe();
 ******************************************************************/

/********************************************************************
 This exports a constructor function -
 https://blog.pivotal.io/labs/labs/javascript-constructors-prototypes-and-the-new-keyword
 ********************************************************************/
//module.exports = function () {
//    return {
//        printMe: function () {
//            console.log('hello world');
//        }
//    }
//};

/******************************************************************
 Convention 2

 In the calling module (assume appTest.js in the same directory),
 you should call like the following

 const test = require('./test.js');
 test.printMe();
 *****************************************************************/

/********************************************************************
 This exports an object with a property called printMe which is of type function
 ********************************************************************/
module.exports = {
    printMe: function () {
        console.log('hello world');
    }
};

/******************************************************************
 Difference between Convention 1 and Convention 2
 Note: This is my understanding. Need to revisit later if it is wrong

 In Convention 1, we are exporting just a function, so to treat it like a true object
 and call printMe function, you need to create an object like new require('./test')
 and then call printMe on it.

 In Convention 2, we are exporting an object itself, so you can directly call
 printMe without saying new require('./test')

 Prefer Convention 2 always for its simplicity
 *****************************************************************/
