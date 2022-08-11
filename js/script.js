import { getKiteStatus } from '/js/kite-status.js';

const appName = new URLSearchParams(window.location.search).get('app');
const url = 'https://api.jsonbin.io/v3/b/62f2cfe1a1610e6386f65cc3';
const access_key = '$2b$10$6RgpMEbghA7.7cicWmuERexqTIV4v3tJKAbDzCAzHPiz57db9Vb.S';

const status = getKiteStatus({url: url,options: {method: 'GET', headers: {'X-ACCESS-KEY': access_key}}});
const template = fetch('/templates/status.handlebars').then(response => {return response.text()});

Promise.all([status, template]).then(values => {
    
    const status = values[0];
    const template = Handlebars.compile(values[1]);
    
    if(status.ok) {
       document.getElementById('kite').innerHTML = template(status.applications.find(app => {return app.name === appName}));     
    } else {
        status.name = appName;
        document.getElementById('kite').innerHTML = template(status); 
        document.getElementById('outage-message').innerHTML += `<code class="p-2 mt-3 d-block">${status.status.error.message}</code>`
    }
    
    
});