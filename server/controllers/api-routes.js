import { Router } from 'express';
import Controller from './controller';
const router = new Router();

let controllers = [];

controllers.push(Controller);

controllers.map((Ctrl) => {
    for(const key of Object.keys(Ctrl)) {
        const route = Ctrl[key];
        if (route) {
            switch(route.method) {
                case 'get':
                    router.get(route.path, route.middleware || [], route.controller);
                    break;
                case 'post':
                    router.post(route.path, route.middleware || [], route.controller);
                    break;
                default: router.get(route.path, route.middleware || [], route.controller);
            }
        }
    }
});

export default router;