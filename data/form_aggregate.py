# # Semantics Aggregation Notebook
# This notebook will search through relevant tagworks output files, specifically form files, and aggregate them based on article. In essence, this notebook maps all tagworks form files for a specific article to a single csv that contains the following columns:
# 
# * article id
# * article sha256
# * Credibility Indicator Category 
# * Start 
# * End 
# * Case Number 
# * Indices of Label in Article
# 
# Each row in the csv is represents a line in the article, which is either a quoted source, an assertion, an argument, or needs fact-checking

import json
import csv
import os
import glob
import pandas as pd
import numpy as np

def read_csv_from_path(path):
    return pd.read_csv(path)

raw_data = read_csv_from_path('Covid_Form1.0.adjudicated-2020-10-04T2314-Tags.csv')


def simple_data_from_raw_data(raw_data, article_id):
    """
    Take article_number, start_pos, end_pos, and add Indices of Label in Article. Rename them if necesssary.
    Assumption: raw_data contains columns named article_number, start_pos, end_pos
    """
    
    default_file_name = "eta_forms/";
    file_name = default_file_name + str(article_id) + ".csv"
    
    simple_data = raw_data[['article_number', 'article_sha256', 'topic_name', 'start_pos', 'end_pos', 'case_number']]
    simple_data = simple_data.rename(columns = {'article_number': 'Article ID', 'article_sha256': 'Article sha256', 'topic_name': 'Credibility Indicator Category', 'start_pos': 'Start', 'end_pos': 'End', 'case_number': 'Case Number'})
     
    if simple_data[simple_data['Article ID'] == article_id].empty:
        new_df = pd.DataFrame([["no_article", 0, 0, 0, 0, 0, 0]], columns=['Credibility Indicator Category', 'Question Number', 'Answer Number','Point Recommendation', 'Credibility Indicator Name', 'Start', 'End'])            
        print("This article_id is not in the csv")
        new_df.to_csv(file_name)
        return new_df
        
    else:
        sub_simple_data = simple_data[simple_data['Article ID'] == article_id].copy()
        sub_simple_data['Indices of Label in Article'] = sub_simple_data.apply(lambda x: list(range(x['Start'], x['End'] + 1)), axis=1)
        sub_simple_data.to_csv(file_name)
        return sub_simple_data    


simple_data = simple_data_from_raw_data(raw_data, 100059)
