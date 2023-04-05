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
   data.columns = cols
   data['population'] = data['population'].str.strip()
   data['population_density'] = data['population_density'].str.strip()
   data['population_growth_rate'] = data['population_growth_rate'].str.strip()
   # data['year'] = data['year'].astype('int')
   # data['population'] = data['population'].astype('int')
   # data['population_density'] = data['population_density'].astype('float')
   # data['population_growth_rate'] = data['population_growth_rate'].astype('float')
   url_args = MultiDict(request.args)
   # if(len(url_args.getlist('year')) != 0):
   #    data = data[data['year'].isin([int(s) for s in url_args.getlist('year')])]
   return data.to_json(orient="records")

@app.route('/years',methods=['GET'])
def years():
   cols = ['country','year','population','population_density','population_growth_rate']
   data = pd.read_csv('./static/data/population.csv',skipinitialspace=True)
   data.columns = cols
   return data['year'].unique().tolist()

if __name__ == '__main__':
   app.run()