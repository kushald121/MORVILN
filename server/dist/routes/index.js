"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const magicLink_route_1 = __importDefault(require("./magicLink.route"));
const pushNotification_routes_1 = __importDefault(require("./pushNotification.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/magic-link', magicLink_route_1.default);
router.use('/push', pushNotification_routes_1.default);
exports.default = router;
