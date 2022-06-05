"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRequest = exports.RequestTypes = exports.UserMessage = void 0;
const uuid_1 = require("uuid");
class UserMessage {
    constructor(req) {
        if (req.useralias === undefined || req.body === undefined) {
            throw new Error(`Invalid message payload received: ${req}`);
        }
        if (req.id === undefined) {
            req.id = (0, uuid_1.v4)();
        }
        if (req.timestamp === undefined) {
            req.timestamp = Date.now() / 1000; // make this Unix time just cause it's normal
        }
        this.data = {
            useralias: req.useralias,
            id: req.id,
            timestamp: req.timestamp,
            body: req.body
        };
        this.stringified = JSON.stringify(this.data); // stringify ourselves just once.
    }
    get useralias() {
        return this.data.useralias;
    }
    get body() {
        return this.data.body;
    }
    get timemstamp() {
        return this.data.timestamp;
    }
    get id() {
        return this.data.id;
    }
    toString() {
        return this.stringified;
    }
}
exports.UserMessage = UserMessage;
var RequestTypes;
(function (RequestTypes) {
    RequestTypes[RequestTypes["REGISTER"] = 0] = "REGISTER";
    RequestTypes[RequestTypes["USER_MESSAGE"] = 1] = "USER_MESSAGE";
    RequestTypes[RequestTypes["UNREGISTER"] = 2] = "UNREGISTER";
})(RequestTypes = exports.RequestTypes || (exports.RequestTypes = {}));
class ChatRequest {
    constructor(payload) {
        const data = JSON.parse(payload);
        const validatePayload = (data) => {
            if (data.requestType === undefined) {
                throw new Error('Invalid ChatRequest message payload received, requestType is undefined: ' + payload);
            }
            if (data.requestType === RequestTypes.REGISTER && data.registerMessage === undefined) {
                throw new Error('Invalid ChatRequest message payload received: requestType is RequestTypes.REGISTER but registerMessage is undefined' + payload);
            }
            if (data.requestType === RequestTypes.USER_MESSAGE && data.userMessage === undefined) {
                throw new Error('Invalid ChatRequest message payload received requestType is RequestTypes.USER_MESSAGE but userMessage is undefined: ' + payload);
            }
            return true;
        };
        validatePayload(data);
        this.data = data;
        if (data.requestType === RequestTypes.USER_MESSAGE) {
            this.data.userMessage = new UserMessage(this.data.userMessage);
        }
        if (data.requestType === RequestTypes.REGISTER) {
            this.data.registerMessage = this.data.registerMessage;
        }
    }
    get requestType() {
        return this.data.requestType;
    }
    get userMessage() {
        return this.data.userMessage;
    }
    get registerMessage() {
        return this.data.registerMessage;
    }
}
exports.ChatRequest = ChatRequest;
