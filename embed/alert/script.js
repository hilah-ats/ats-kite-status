import { getKiteStatus } from '../../js/kite-status.js';

const params = new URLSearchParams(window.location.search);

const fetchStatus = getKiteStatus();
const template = Handlebars.compile(document.getElementById('template').innerHTML);

fetchStatus.then(res => {
    
    const status = res;
    
    if(status.parsed && !status.ok) {
        
        let element = document.getElementById('kite');
        element.innerHTML = template(status.alert); 
        status.alert.link = params.get('link');
        
        if ('parentIFrame' in window) { 
            window.parentIFrame.sendMessage({loaded: true});
            window.parentIFrame.resize();
        }        
        
    } else {
        if ('parentIFrame' in window) {
            window.parentIFrame.close();
        }
    }
    
});

