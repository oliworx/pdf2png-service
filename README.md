# pdf2png-service

A webservice to convert PDF files to PNG images, based on Node.js

## Setup
Install Node.js, e.g. `nvm i 10`  
Install dependencies: `npm install` 

## Configuration

The default port is 3001.

The port can be changed with the environment variable $PORT

## Usage
Start the service: `npm start` or `node server.js` ,  
or to listen on another port: `PORT=8080 npm start` 

If everything is OK there will appear a line like:  
_PDF2PNG Server listening on 3001 waiting for PDF data via POST requests_

Now use a POST request to send a PDF file to the webservice:

    curl -H "Transfer-Encoding: chunked" --data-binary @myfile.pdf http://127.0.0.1:3000/ -o firstpage.png

The first page of the input PDF file will be saved as `firstpage.png` .

## Licence
MIT License: <https://kurmis.mit-license.org>
