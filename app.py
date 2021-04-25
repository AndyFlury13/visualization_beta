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
from form_aggregate import *
#import datahunt_aggregate

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
        if 'article_sha256' in request.form:
            print(request.form)
            article_sha256 = request.form['article_sha256']
            user_id = request.form['user_id']
            if request.form['form'] == 'true':
                ## Form_aggregate.py call here
                data_from_path = read_csv_from_path('data/')
                simple_data_from_raw_data(data_from_path, article_sha256)
                print("success?")
                result = "success"
            else:
                ## Datahunt_aggregate.py call here
                result='success'
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
