from flask import Flask, render_template, request, jsonify, Response
import pandas as pd
import numpy as np
import matplotlib
from matplotlib import pyplot as plt
from processData import ProcessData
from visualize import Visualize
import io
from warnings import filterwarnings
filterwarnings('ignore')

matplotlib.use('Agg')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_data', methods=['POST'])
def process_data():
    req = request.get_json()
    if req['request'] == 'sendData':
        data = ProcessData().return_data()
        return jsonify(data)
    elif req['request'] == 'sortData':
        about_column = req['about_column']
        sort_by = req['sort_by']
        sorted_data = ProcessData().return_sorted_data(about_column, sort_by)
        return jsonify(sorted_data)
    elif req['request'] == 'sendDataV2':
        req_year = req['year']
        data = ProcessData().return_data_v2(req_year)
        return jsonify(data)
    return 'Invalid request'

@app.route('/visualize')
def visualize():
    fig = Visualize().make_and_save_graph()
    output = io.BytesIO()
    fig.savefig(output, format='png')
    plt.close(fig)
    output.seek(0)
    return Response(output.getvalue(), mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)