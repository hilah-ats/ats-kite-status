import { getKiteStatus } from '../../js/kite-status.js';

const params = new URLSearchParams(window.location.search);

const status = getKiteStatus();
const template = document.getElementById('template').innerHTML;

Promise.all([status, template]).then(values => {
    
    const status = values[0];
    const template = Handlebars.compile(values[1]);
    
    if(status.ok) {
        document.getElementById('kite').innerHTML = template(status.applications.find(app => {return app.name === params.get('app')}));             
    } else {
        status.name = params.get('app');
        document.getElementById('kite').innerHTML = template(status); 

    }
    
    
});