"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const ChatServer_1 = __importDefault(require("./src/ChatServer"));
const restServer = (0, fastify_1.default)();
const chatServer = new ChatServer_1.default(3042);
restServer.register(require('fastify-cors'), {
    origin: (_origin, cb) => {
        cb(null, true); // just let everything in right now.
    }
});
restServer.get('/useralias/validate/:useralias', (request, _reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { useralias } = request.params;
    const aliasIsValid = chatServer.aliasIsAvailable(useralias);
    console.log(`checking is useralias valid: ${useralias} - ${aliasIsValid}`);
    return { aliasIsValid };
}));
restServer.get('/server/stats', (_request, _reply) => __awaiter(void 0, void 0, void 0, function* () {
    return chatServer.getStats();
}));
restServer.listen(3001, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`ReST Server listening at ${address}`);
});
