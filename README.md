# Kite System Status

A front-end web app hosted on [GitHub Pages](https://pages.github.com) that displays the current status of Kite Suite applications for use as an iframe on ATS managed websites.

You can view the current deployment of this application [here](https://hilah-ats.github.io/ats-kite-status/).

Currently in use on the following sites:

 - [https://ksassessments.org](https://ksassessments.org)
 - [https://dynamiclearningmaps.org](https://dynamiclearningmaps.org)

Status data is currently tracked manually via a JSON file hosted on [jsonbin.io](https://jsonbin.io) and is **not** connected to the applications (yet?).

# How It Works ⚙️

This version of the application is entirely client-side and utilizes the native JavaScript [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to obtain a JSON file and a [handlebars](https://handlebarsjs.com) template on page load.

Once the resource fetches are resolved, the JSON is parsed for display (date calculations, uptime percentage, conditional display properties, etc.) and passed to the compiled handlebars template which is then added to the DOM.

In order to properly display the rendered page in an iframe on the destination site, [iframe-resizer](https://github.com/davidjbradshaw/iframe-resizer) is used to send information about the page size to the client from the hosted GitHub Pages page.

## Example

An example of how to include an iframe for both applications on a website.
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.2/iframeResizer.min.js" integrity="sha512-dnvR4Aebv5bAtJxDunq3eE8puKAJrY9GBJYl9GC6lTOEC76s1dbDfJFcL9GyzpaDW4vlI/UjR8sKbc1j6Ynx6w==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>      


<div class="row">
    <div class="col-xl-6 mb-4">                            
        <iframe class="w-100 border" id="ep" src="https://hilah-ats.github.io/ats-kite-status/embed.html?app=Educator%20Portal"></iframe>
    </div> 
    <div class="col-xl-6 mb-4">
        <iframe class="w-100 border" id="sp" src="https://hilah-ats.github.io/ats-kite-status/embed.html?app=Student%20Portal"></iframe>
    </div>  
</div>               


<script>
    var options = {
    log: false,
    autoResize: true
    }
    iFrameResize( options, '#ep' );
    iFrameResize( options, '#sp' );   
</script>
```
# How To Update ✏️

ATS Staff can edit the status JSON file to update or add an outage at [https://jsonbin.io/app/bins](https://jsonbin.io/app/bins) after logging in to the AAI Webmaster GitHub account.

For security purposes those credentials will not be listed here.

## Overview

The JSON document serves as  a way to organize all of the data required to render the current status & uptime for a Kite application.

In the future a JSON Schema will be created to prevent invalid edits, but until then edits must be made very carefully to avoid errors.

## Definitions 

### Variables
At the beginning of the JSON there is a value that defines when the first day of the school year is. This can be changed as needed, but must be in MM/DD format.
```json
{
  "startDate": "08/01",
}
```


### Applications

Each Kite application in the JSON file has a set of specific fields associated with it to keep track of status information.
```json
{
  "name": "Student Portal",
  "status": {
    "type": 0,
    "alert": {
      "date": "2022/03/31, 9:00 AM",
      "message": "Example alert message!"
    }
  },
  "outages": [
    {
      "date": "2022/03/31",
      "downtime": 0
    }
  ]
}
```
 - **name**: what displays in the HTML title for each application on the
   site.
 - **status**: object containing current status information for the application.
	 - **type**: the current status type (integer between 0-3, see *Status Types* below).
	 - **alert**: object containing alert information (ignored when status type is *0*).
		 - **date**: timestamp for alert message (must be in YYYY/MM/DD, HH:MM AM/PM format)
		 - **message**: text contents of the alert message (must be plain text).
 - **outages**: array list of outages (no max length).
	 - **date**: day of the outage (must be in YYYY/MM/DD format).
	 - **downtime**: length of the outage in minutes.

#### Status Types
There are 4 unique status types for Kite applications, though more can be added as needed. Each includes a message and the CSS code for a [Bootstrap Icon](https://icons.getbootstrap.com). Colors for each status are defined in the style.css.
```json
"statusTypes": {
  "0": {
    "message": "No Issues",
    "icon": "\uF633"
  },
  "1": {
    "message": "Issue Resolved",
    "icon": "\uF633"
  },
  "2": {
    "message": "Possible Delays",
    "icon": "\uF33A"
  },
  "3": {
    "message": "Outage",
    "icon": "\uF626"
  }
}
```

 - **key**: a unique integer value to identify the status type.
	 - **message**: text to display (must be plain text).
	 - **icon**: icon to display (must be the CSS code for a Bootstrap Icon).

## Updates 

### Status Updates

To update the status of an application, change the **type** value in the **status** object for that application to an integer value that is defined in the **statusTypes** object at the bottom of the JSON document.
```json
{
  "name": "Student Portal",
  "status": {
    "type": 0, <------------ Change this value.
    "alert": { }
  },
  "outages": [ ]
}
```
### Message Updates

To update the alert message and date timestamp for an application, alter the following fields within the **alert** object of the **status** object for that application (demonstrated below). 

Keep in mind that:

 - A message will **never** be displayed if the application status is
   set to 0 (No Issues).  So there is no need to delete the **alert** object to stop a message from being displayed, always change the status **type** instead.
   
 - Multiple messages are not supported, simply overwrite the existing contents.

```json
{
  "name": "Student Portal",
  "status": {
    "type": 3,
    "alert": {
      "date": "2022/03/31, 9:00 AM", <-------- The timestamp displayed.
      "message": "Example alert message!" <--- The text displayed.
    }
  },
  "outages": [ ]
},
```

### Adding Outages

To report a new outage for an application, create a new outage item  in the **outages** object for the application (do **not** override an existing item). Below is an example of what an application would look like with multiple outages.

```json
{
  "name": "Student Portal",
  "status": { },
  "outages": [
    {
      "date": "2022/05/11",
      "downtime": 33
    }, <---------------------Do not forget the comma between entries!
    {
      "date": "2022/03/31",
      "downtime": 17
    }    
  ]
},
```

# Todo 🛠️

 - [ ] JSON needs schema.
 - [ ] JS needs commenting.
 - [ ] CSS needs to be cleaned up.
 - [ ] Status alert bar not included.

# Issues⚠️
 - Slow load time (due to application being ran client-side. I have developed a full-stack version of this app, but currently have nowhere to host it 😢 ).
