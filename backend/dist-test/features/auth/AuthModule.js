"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAuthModule = initAuthModule;
const express_1 = require("express");
const AuthController_1 = require("./AuthController");
function initAuthModule() { const router = (0, express_1.Router)(); const controller = new AuthController_1.AuthController(); router.post('/login', controller.login.bind(controller)); router.post('/register', controller.register.bind(controller)); router.post('/refresh', controller.refresh.bind(controller)); router.post('/logout', controller.logout.bind(controller)); router.post('/forgot-password', controller.forgotPassword.bind(controller)); router.post('/verify-otp', controller.verifyOTP.bind(controller)); router.post('/reset-password', controller.resetPassword.bind(controller)); router.get('/me', controller.me.bind(controller)); return router; }
