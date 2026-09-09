import { Router } from 'express';  
import { AuthController } from './AuthController';  
export function initAuthModule() { const router = Router(); const controller = new AuthController(); router.post('/login', controller.login.bind(controller)); router.post('/register', controller.register.bind(controller)); router.post('/refresh', controller.refresh.bind(controller)); router.post('/logout', controller.logout.bind(controller)); return router; } 
