import { Router } from 'express';
import Verification_Controller from './verification-controller';
const verification_router = new Router();

let controllers = [];

controllers.push(Verification_Controller);

controllers.map((Ctrl) => {
    for(const key of Object.keys(Ctrl)) {
        const route = Ctrl[key];
        if (route) {
            switch(route.method) {
                case 'get':
                    verification_router.get(route.path, route.middleware || [], route.controller);
                    break;
                case 'post':
                    verification_router.post(route.path, route.middleware || [], route.controller);
                    break;
                default: verification_router.get(route.path, route.middleware || [], route.controller);
            }
        }
    }
});

export default verification_router;