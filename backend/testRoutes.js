const express = require('express');
const app = express();
const adminModule = require('./src/features/admin/AdminModule').default;
app.use(adminModule);

const routes = [];
app._router.stack.forEach(middleware => {
    if(middleware.route){ // routes registered directly on the app
        routes.push(middleware.route);
    } else if(middleware.name === 'router'){ // router middleware 
        middleware.handle.stack.forEach(handler => {
            let route;
            route = handler.route;
            route && routes.push(route);
        });
    }
});
console.log(routes.map(r => r.path));
