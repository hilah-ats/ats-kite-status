import { getKiteStatus } from '../../js/kite-status.js';

const params = new URLSearchParams(window.location.search);

const status = getKiteStatus(params.get('bin'));
const template = document.getElementById('template').innerHTML;

Promise.all([status, template]).then(values => {
    
    const status = values[0];
    const template = Handlebars.compile(values[1]);

    if(status.parsed && status.alert.show) {

        let element = document.getElementById('kite');

        status.alert.link = (params.get('link') ? params.get('link') : '/')

        element.innerHTML = template(status.alert); 
        
        if ('parentIFrame' in window) { window.parentIFrame.sendMessage('loaded') }        
        
    } else {
        if ('parentIFrame' in window ) { window.parentIFrame.close() }
    }

});

