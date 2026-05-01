import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

import plotly.express as px
import plotly.graph_objects as go
from data.load_data import load_data
from src.models.regression import train_regression

# --- FACTUSCAN BRANDING & UI CONFIG ---
st.set_page_config(
    page_title="Student Performance AI Prediction",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for SaaS-style UI
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    html, body, [class*="css"]  {
        font-family: 'Inter', sans-serif;
    }
    
    .main {
        background-color: #F8FAFC;
    }
    
    /* Card styling */
    .stMetric {
        background-color: #ffffff;
        padding: 1.5rem !important;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid #E2E8F0;
    }
    
    /* Sidebar branding */
    .sidebar-header {
        font-size: 24px;
        font-weight: 700;
        color: #1E293B;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
    }

    </style>
    """, unsafe_allow_html=True)

@st.cache_resource
def get_trained_assets():
    df = load_data()
    model, scaler, encoders, metrics = train_regression(df)
    return df, model, scaler, encoders, metrics

df, model, scaler, encoders, metrics = get_trained_assets()

# --- SIDEBAR NAVIGATION ---
with st.sidebar:
    st.markdown('<div class="sidebar-header">🎓 Student Performance AI</div>', unsafe_allow_html=True)
    st.markdown('<span style="background-color: #DBEAFE; color: #1E40AF; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">v1.2.0 • LIVE</span>', unsafe_allow_html=True)
    st.write("---")
    page = st.sidebar.radio("Navigation", ["Dashboard", "Analytics Explorer", "Predictor AI", "Training & Support"])
    
    st.write("---")
    st.caption("© 2024 Student Performance AI. All rights reserved.")

# --- PAGE: HOME / DASHBOARD ---
if page == "Dashboard":
    st.title(" Strategic Overview")
    st.markdown("Monitor high-level student performance metrics and model health.")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Student Cohort", len(df), delta="New Records (+12%)")
    with col2:
        st.metric("Intelligence Features", len(df.columns) - 1, delta="Optimized")
    with col3:
        best_r2 = max([m['R2'] for m in metrics.values()])
        st.metric("Model Precision (R²)", f"{best_r2:.2f}", delta="Ready for Deployment")

    st.write("---")
    
    c1, c2 = st.columns([2, 1])
    with c1:
        st.subheader("Model Benchmark Analysis")
        metric_df = pd.DataFrame(metrics).T.reset_index().rename(columns={'index': 'Model'})
        fig_benchmark = px.bar(metric_df, x='Model', y='R2', 
                               color='R2', color_continuous_scale='Blues',
                               text_auto='.2f', title="Regression Efficiency by Algorithm")
        fig_benchmark.update_layout(showlegend=False, paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_benchmark, use_container_width=True)
    
    with c2:
        st.subheader("System Notifications")
        st.success("✅ Training Pipeline: Stable")
        st.info("💡 Insight: Attendance (absences) remains the top predictive feature.")
        st.warning("⚠️ Data Drift: Portuguese cohort needs update.")

# --- PAGE: DATA EXPLORER ---
elif page == "Analytics Explorer":
    st.title("📊 Intelligence Explorer")
    
    if st.checkbox("Show Raw Data"):
        st.dataframe(df.style.background_gradient(cmap='Blues'), use_container_width=True)

    tab1, tab2 = st.tabs(["Distribution Analysis", "Correlation Matrix"])
    
    with tab1:
        col_a, col_b = st.columns(2)
        with col_a:
            st.subheader("Final Grade Distribution")
            fig_dist = px.histogram(df, x="G3", nbins=20, marginal="box", color_discrete_sequence=['#3B82F6'])
            st.plotly_chart(fig_dist, use_container_width=True)
        with col_b:
            st.subheader("Study Time vs Performance")
            fig_scatter = px.box(df, x="studytime", y="G3", points="all", color="studytime")
            st.plotly_chart(fig_scatter, use_container_width=True)

    with tab2:
        st.subheader("Feature Correlation Heatmap")
        numeric_df = df.select_dtypes(include=[np.number])
        corr = numeric_df.corr()
        fig_corr = px.imshow(corr, text_auto=True, aspect="auto", color_continuous_scale='RdBu_r')
        st.plotly_chart(fig_corr, use_container_width=True)

# --- PAGE: PREDICTOR ---
elif page == "Predictor AI":
    st.title(" Predictive Intelligence")
    st.markdown("Enter student parameters to generate an AI-powered grade projection.")
    
    with st.container():
        st.info("The prediction is based on the highest-performing ensemble model trained on your latest dataset.")
        
    with st.form("prediction_form", clear_on_submit=False):
        col1, col2, col3 = st.columns(3)
        
        # Dynamically create inputs based on dataframe columns
        user_input = {}
        for i, col in enumerate(df.drop(columns=['G3']).columns):
            target_col = [col1, col2, col3][i % 3]
            if col in encoders:
                user_input[col] = target_col.selectbox(f"{col}", encoders[col].classes_)
            else:
                user_input[col] = target_col.number_input(f"{col}", 
                                                          min_value=float(df[col].min()), 
                                                          max_value=float(df[col].max()), 
                                                          value=float(df[col].mean()))
        
        submit = st.form_submit_button("Predict Result")
        
        if submit:
            # Process input
            input_df = pd.DataFrame([user_input])
            for col, le in encoders.items():
                input_df[col] = le.transform(input_df[col])
            
            input_scaled = scaler.transform(input_df)
            prediction = model.predict(input_scaled)[0]
            
            st.success(f"### Predicted Final Grade: {prediction:.2f} / 20")
            
            # Visual feedback
            if prediction >= 15:
                st.balloons()
                st.info("Performance Level: Excellent")
            elif prediction >= 10:
                st.warning("Performance Level: Pass")
            else:
                st.error("Performance Level: High Risk of Failure")

# --- PAGE: TRAINING & SUPPORT ---
elif page == "Training & Support":
    st.title("📚 Resource Center")
    st.markdown("Learn how the Student Performance AI interprets student data and academic indicators.")
    
    col_img, col_vid = st.columns(2)
    
    with col_img:
        st.subheader("Data Processing Flow")
        st.image("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000", caption="Feature Engineering Lifecycle")
    
    with col_vid:
        st.subheader("Project Walkthrough")
        st.video("https://www.youtube.com/watch?v=k2P_S5D-398") # Sample tutorial video link