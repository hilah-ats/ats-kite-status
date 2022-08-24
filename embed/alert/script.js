import { getKiteStatus } from '../../js/kite-status.js';

const params = new URLSearchParams(window.location.search);

const fetchStatus = getKiteStatus();
const template = Handlebars.compile(document.getElementById('template').innerHTML);

fetchStatus.then(res => {
    
    const status = res;
    
    if(status.parsed && !status.ok) {
        status.alert.link = params.get('link');
        document.getElementById('kite').innerHTML = template(status.alert);      
        window.parentIFrame.sendMessage({loaded: true});
    } else {
        if ('parentIFrame' in window) {
            
            window.parentIFrame.close();
        }
    }
    
});

