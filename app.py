from flask import Flask, render_template, redirect, url_for,request
from flask_cors import CORS, cross_origin
from flask import make_response

import csv
import os
import glob
import sys
import pandas as pd
import numpy as np

sys.path.append("data/")

import form_aggregate
import datahunt_aggregate

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
   print(request.args)
   if request.method == 'POST':
        if len(request.form) > 0:
            print(request.form)
            article_sha256 = request.form['article_sha256']
            user_id = request.form['user_id']
            if request.form['form'] == 'true':
                ## Form_aggregate.py call here
                print(article_sha256)
                result='df here'

            else:
                ## Datahunt_aggregate.py call here
                result='df here'
        else:
            result='null call'
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
