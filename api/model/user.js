// import { Date, String } from 'core-js/library/web/timers';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 定义user模型
 */
let UserSchema = mongoose.model('user', new Schema({
    name: String,
    age:Number,
    telephone:String,
    avatar:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type: Date,
            default: Date.now()
        }
    }
}));

module.exports = UserSchema;