import { getKiteStatus } from '../../js/kite-status.js'

const params = new URLSearchParams(window.location.search)

const status = getKiteStatus(params.get('bin'))
const template = document.getElementById('template').innerHTML

Promise.all([status, template]).then(values => {
    
    const status = values[0]
    const template = Handlebars.compile(values[1])
    
    if (status.parsed) {

        document.getElementById('kite').innerHTML = template(status.applications.find(app => {return app.name === params.get('name')}))    

    } else {

        status.name = params.get('name')
        document.getElementById('kite').innerHTML = template(status)

    }
    
})