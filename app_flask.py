from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.io as pio
from data.load_data import load_data
from src.data.models.regression import train_regression

app = Flask(__name__)

# Load assets once
try:
    df = load_data()
    model, scaler, encoders, metrics = train_regression(df)
except Exception as error:
    print(f"Error loading assets: {error}")
    df = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    if df is None:
        return "Error loading data"
    # Generate charts
    metric_df = pd.DataFrame(metrics).T.reset_index().rename(columns={'index': 'Model'})
    fig_benchmark = px.bar(metric_df, x='Model', y='R2', color='R2', color_continuous_scale='Blues', text_auto='.2f')
    benchmark_html = pio.to_html(fig_benchmark, full_html=False)
    
    return render_template('dashboard.html', benchmark_html=benchmark_html, len_df=len(df), best_r2=max([m["R2"] for m in metrics.values()]))

@app.route('/analytics')
def analytics():
    if df is None:
        return "Error loading data"
    # Distribution chart
    fig_dist = px.histogram(df, x="G3", nbins=18, marginal="box", color_discrete_sequence=['#2563EB'])
    dist_html = pio.to_html(fig_dist, full_html=False)
    
    # Scatter plot
    fig_scatter = px.box(df, x="studytime", y="G3", points="all", color="studytime")
    scatter_html = pio.to_html(fig_scatter, full_html=False)
    
    # Correlation
    numeric_df = df.select_dtypes(include=[np.number])
    corr = numeric_df.corr()
    fig_corr = px.imshow(corr, text_auto=True, aspect='auto', color_continuous_scale='RdBu_r')
    corr_html = pio.to_html(fig_corr, full_html=False)
    
    return render_template('analytics.html', dist_html=dist_html, scatter_html=scatter_html, corr_html=corr_html)

@app.route('/predictor', methods=['GET', 'POST'])
def predictor():
    columns = df.drop(columns=['G3']).columns.tolist()
    best_r2 = max([m["R2"] for m in metrics.values()])
    len_df = len(df)
    if request.method == 'POST':
        user_input = {}
        for column in columns:
            if column in encoders:
                user_input[column] = request.form[column]
            else:
                user_input[column] = float(request.form[column])
        
        input_df = pd.DataFrame([user_input])
        for column, le in encoders.items():
            input_df[column] = le.transform(input_df[column])
        input_scaled = scaler.transform(input_df)
        prediction = model.predict(input_scaled)[0]
        
        return render_template('predictor.html', prediction=prediction, columns=columns, encoders=encoders, best_r2=best_r2, len_df=len_df)
    return render_template('predictor.html', columns=columns, encoders=encoders, best_r2=best_r2, len_df=len_df)

@app.route('/support')
def support():
    return render_template('support.html')

if __name__ == '__main__':
    app.run(debug=True)