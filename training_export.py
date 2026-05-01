"""
Training script that exports model artifacts for static site deployment.
Run this script to generate JSON files needed for the GitHub Pages site.
"""
import json
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import os

# Paths
DATA_PATH = "data/student+performance/student"
OUTPUT_DIR = "json"

def load_data():
    """Load and merge student datasets."""
    df_mat = pd.read_csv(os.path.join(DATA_PATH, "student-mat.csv"), sep=';')
    df_por = pd.read_csv(os.path.join(DATA_PATH, "student-por.csv"), sep=';')
    return pd.concat([df_mat, df_por], ignore_index=True)

def train_and_export():
    """Train models and export all artifacts for static site."""
    
    print("Loading data...")
    df = load_data()
    print(f"Loaded {len(df)} student records")
    
    # Preprocessing
    df = df.copy()
    encoders = {}
    categorical_cols = df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le
    
    X = df.drop(columns=['G3'])
    y = df['G3']
    feature_names = X.columns.tolist()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train models
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(random_state=42),
        "MLP Regressor": MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=1000, random_state=42)
    }
    
    results = {}
    best_model = None
    best_r2 = -float('inf')
    best_name = ""
    
    print("\nTraining models...")
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_test_scaled)
        
        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)
        
        results[name] = {
            "MAE": round(mae, 4),
            "RMSE": round(rmse, 4),
            "R2": round(r2, 4)
        }
        
        print(f"  {name}: R² = {r2:.4f}")
        
        if r2 > best_r2:
            best_r2 = r2
            best_model = model
            best_name = name
    
    print(f"\nBest model: {best_name} with R² = {best_r2:.4f}")
    
    # Export encoders
    encoders_json = {}
    for col, le in encoders.items():
        encoders_json[col] = {
            "classes": le.classes_.tolist(),
            "classes_transformed": le.transform(le.classes_).tolist()
        }
    
    # Export scaler parameters
    scaler_json = {
        "mean": scaler.mean_.tolist(),
        "scale": scaler.scale_.tolist(),
        "var": scaler.var_.tolist(),
        "n_features_in": scaler.n_features_in_
    }
    
    # Export model coefficients (Linear Regression)
    # For simplicity, we use Linear Regression coefficients
    model_json = {
        "model_name": best_name,
        "coefficients": best_model.coef_.tolist(),
        "intercept": float(best_model.intercept_),
        "feature_names": feature_names
    }
    
    # Save JSON files
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    with open(os.path.join(OUTPUT_DIR, "encoders.json"), "w") as f:
        json.dump(encoders_json, f, indent=2)
    print(f"Saved encoders.json")
    
    with open(os.path.join(OUTPUT_DIR, "scaler.json"), "w") as f:
        json.dump(scaler_json, f, indent=2)
    print(f"Saved scaler.json")
    
    with open(os.path.join(OUTPUT_DIR, "model.json"), "w") as f:
        json.dump(model_json, f, indent=2)
    print(f"Saved model.json")
    
    # Export metrics
    metrics_json = {
        "results": results,
        "best_model": best_name,
        "best_r2": round(best_r2, 4),
        "dataset_size": len(df)
    }
    
    with open(os.path.join(OUTPUT_DIR, "metrics.json"), "w") as f:
        json.dump(metrics_json, f, indent=2)
    print(f"Saved metrics.json")
    
    # Export sample data for analytics
    sample_data = df.head(100).to_dict(orient='records')
    with open(os.path.join(OUTPUT_DIR, "sample_data.json"), "w") as f:
        json.dump(sample_data, f, indent=2)
    print(f"Saved sample_data.json")
    
    print("\n✅ All artifacts exported successfully!")
    print(f"Files saved to: {OUTPUT_DIR}/")

if __name__ == "__main__":
    train_and_export()
