# eloforeveryone
Mobile Computing Project

The **frontend** folder contains code for the frontend, which uses phonegap
on linux for the build. It requires android be installed, and it uses the
[phonegap toasts](https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin)
plugin. Within this folder, the **www**
directory contains all of my code.
The index.html file contains the basic
structure of the visible app, while
the js folder contains the main
app code in the index.js file, it uses
the included jquery library, and the
pageloaders.js file handles loading
things upon entering different views
within the app. Within the css directory, style.css defines some style for
the frontend.

The **backend** directory has the code
for the nodejs backend. The backend also requires mongodb to be running on port 27017. The backend is accessed
through a proxy using apache. The backend uses port 3111, and the nodejs
uses the express, bcrypt, and hash libraries. All of the code for the backend
is within index.js.
