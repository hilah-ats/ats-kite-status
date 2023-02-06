import { getKiteStatus } from '../../js/kite-status.js';

const params = new URLSearchParams(window.location.search);

const fetchStatus = getKiteStatus(params.get('bin'));
const template = Handlebars.compile(document.getElementById('template').innerHTML);

fetchStatus.then(res => {
    
    const status = res;
    
    if(status.parsed && status.alert.display) {
        
        let element = document.getElementById('kite');
        element.innerHTML = template(status.alert); 

        if(params.get('link')) {
            status.alert.link = params.get('link');
        }
        
        if ('parentIFrame' in window) { 
            window.parentIFrame.sendMessage({loaded: true});
        }        
        
    } else {
        if ('parentIFrame' in window) {
            window.parentIFrame.close();
        }
    }
    
});

