const appName = new URLSearchParams(window.location.search).get('app');
const url = 'https://api.jsonbin.io/v3/b/62f2cfe1a1610e6386f65cc3';
const access_key = '$2b$10$6RgpMEbghA7.7cicWmuERexqTIV4v3tJKAbDzCAzHPiz57db9Vb.S';

const status = getKiteStatus({url: url,options: {method: 'GET', headers: {'X-ACCESS-KEY': access_key}}});
const template = fetch('https://raw.githubusercontent.com/hilah-ats/ats-kite-status/main/templates/status.handlebars').then(response => {return response.text()});

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

function getKiteStatus(params) {
    
    const status = fetchStatus(params.url, params.options).then(json => {
        
        if(json.ok) { return parseStatus(json.data) }

        return parseError(json.data);        
        
    });
    
    return status;
    
}

function fetchStatus(url, options) {

    let json = 
        fetch(url, options)
            .then((response) => {
                if(!response.ok) {
                    throw new Error('HTTP Bad Status ' + response.status);
                }
                return response.json();
            })
            .then((data) => {
                return {ok: true, data: data.record};
            })
            .catch((error) => {
                console.log('\x1b[31m%s\x1b[0m', '[kite-status] Fetch Failed'); 
                console.log('\x1b[31m%s\x1b[0m', '[kite-status] Tried to GET: ' + URL); 
                console.error(error);   
                return {ok: false, data: error};
            }); 
    
    return json;
    
}

function parseStatus(status) {
    
    //  Get today's date.
    const now = new Date();

    //  Create a new Date from startDay (year doesn't matter we just need the month and the day in a date object).
        
    const start = new Date("2000/"+status.startDay);

    //  Calculate the current school year based on today's date and the start date.
    start.setFullYear(
        (now.getUTCMonth() >= start.getUTCMonth()) && (now.getUTCDate() >= start.getUTCDate()) ? 
            now.getFullYear() : now.getFullYear()-1);
    
    status.ok = true;
    status.applications.forEach((app) => {
        app.schoolYear = start.getFullYear() + " - " + ((start.getFullYear() + 1).toString().substr(-2));       
        app.lastRefresh = now.toLocaleString("en-US", { month: "long", day: "numeric", hour:"numeric", minute: "numeric"});

        // Calculate the uptime of the application based on outages.
        const uptime = getUptime(app.outages, now, start);        

        // Store uptime calculations processed for display.
        app.uptime = {
            "int": (uptime.includes('.') ? uptime.split('.')[0] :uptime+"%"),
            "dec": (uptime.includes('.') ? '.'+uptime.split('.')[1]+'%' : ''),
            "graphOffset": (100 - ((parseInt(uptime)/100) * 100)),
            "display": (app.status.type > 1) ? "none" : "block"
        }; 

        app.status.message = status.statusTypes[app.status.type].message;
        app.status.icon = status.statusTypes[app.status.type].icon;  

        app.status.alert.display = (app.status.type != 0) ? "block" : "none";
        app.status.alert.date = new Date(app.status.alert.date).toLocaleString("en-US", { month: "long", day: "numeric", hour:"numeric", minute: "numeric"});
    });        

    return status;

}

function parseError(error) {
    
    return {
        ok: false,
        status: {
            message: 'Unknown',
            icon: '\uF506',
            alert: {
                display: 'block',
                message: 'The current status of the Kite Suite cannot be reached. Please contact aaiwebmaster@ku.edu with the following error code to resolve this issue.',
            },
            error: {
                display: 'block', 
                message: error
            }
        },
        lastRefresh: new Date().toLocaleString("en-US", { month: "long", day: "numeric", hour:"numeric", minute: "numeric"}),
        uptime: {
            display: 'none'
        }
    }    
    
}

//  Calculate the percentage of time that application has been up.
function getUptime(outages, now, start) {
    
    //  How long the application has been running.
	var runtime = (now - start)/ 3600000;
    
    //  Aggregate total outage time.
	var downtime = outages.reduce(function(total, outage){
		return total + outage.downtime;
	}, 0)/60;
    
    //  How long the application has been down.
	downtime = ((runtime-downtime)/runtime)*100;
    
    //  Return percantage of time the appliction has been up (trim to 2 decimal places without rounding).
	return (Math.floor(downtime * 100) / 100).toFixed(2).replace(/[.,]00$/, "");
    
}