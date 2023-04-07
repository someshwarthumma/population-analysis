from flask import Flask, render_template, request, url_for
from werkzeug.datastructures import MultiDict
import pandas as pd
app = Flask(__name__)

@app.route('/')
def home():
   return render_template('index.html')

@app.route('/data',methods=['GET'])
def data():
   cols = ['country','year','population','population_density','population_growth_rate']
   data = pd.read_csv('./static/data/population.csv',skipinitialspace=True)
   # mapping = pd.read_csv('./static/data/country-continent-mapping.csv',skipinitialspace=True)
   mapping = pd.read_csv('./static/data/mapping.csv',skipinitialspace=True)
   data.columns = cols
   data['population'] = data['population'].str.strip()
   data['population_density'] = data['population_density'].str.strip()
   data['population_growth_rate'] = data['population_growth_rate'].str.strip()
   data = pd.merge(data, mapping,  how='left', on=['country'])
   return data.to_json(orient="records")

@app.route('/years',methods=['GET'])
def years():
   cols = ['country','year','population','population_density','population_growth_rate']
   data = pd.read_csv('./static/data/population.csv',skipinitialspace=True)
   data.columns = cols
   return data['year'].unique().tolist()

if __name__ == '__main__':
   app.run()