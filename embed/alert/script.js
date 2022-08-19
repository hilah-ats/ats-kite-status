import { getKiteStatus } from '../../js/kite-status.js';

const params = new URLSearchParams(window.location.search);

const status = getKiteStatus();
const template = document.getElementById('template').innerHTML;

Promise.all([status, template]).then(values => {
    
    const status = values[0];
    const template = Handlebars.compile(values[1]);
    
    if(status.ok && status.alert.message) {
        status.alert.link = params.get('link');
        document.getElementById('kite').innerHTML = template(status.alert);      
    }
    
});