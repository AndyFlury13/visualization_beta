from flask import Flask, render_template, redirect, url_for,request
from flask_cors import CORS, cross_origin
from flask import make_response
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin()
def home():
    return "hi"
@app.route("/index")

@app.route('/login', methods=['GET', 'POST'])
@cross_origin()
def login():
   message = None
   if request.method == 'POST':
        if 'mydata' in request.form:
            tabURL = request.form['mydata']
            result = str(score(tabURL)) #What gets returned to Javascript
        else:
            result= "no_change" # Sometimes a junky POST request is made, this filters out those bad POST requests
        resp = make_response(result)
        resp.headers['Content-Type'] = "application/json"
        return resp
        return render_template('login.html', message='')


from urllib.parse import urlparse


#print(url_domain)

extension_dict = {
    ".com": 50,
    ".edu": 80,
    ".gov": 100,
    ".org": 70,
    ".us": 60
}

def score(url_domain):

    url_domain = str(urlparse(url_domain).netloc)
    #print(url_domain)
    for x in extension_dict:
        #print(x)
        if x in url_domain:
            #print(extension_dict[x])
            return extension_dict[x]

if __name__ == "__main__":
    app.run(debug = True)
