from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from data.preprocessing import preprocess_data
from data.load_data import load_data
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Optional: XGBoost
try:
    from xgboost import XGBRegressor
    xgboost_available = True
except ImportError:
    xgboost_available = False

def train_regression(df=None):
    if df is None:
        df = load_data()
        
    X_train, X_test, y_train, y_test, scaler, encoders = preprocess_data(df)

    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(random_state=42),
        "MLP Regressor": MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=1000, random_state=42)
    }

    if xgboost_available:
        models["XGBoost Regressor"] = XGBRegressor(random_state=42, eval_metric='rmse')

    best_model = None
    best_r2 = -float('inf')
    results = {}

    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)

        logger.info(f"--- {name} Results ---")
        logger.info(f"MAE: {round(mean_absolute_error(y_test, preds), 2)}")
        logger.info(f"RMSE: {round(np.sqrt(mean_squared_error(y_test, preds)), 2)}")
        logger.info(f"R2 Score: {round(r2_score(y_test, preds), 2)}")

        # Feature importance (if available)
        if hasattr(model, "feature_importances_"):
            logger.debug(f"{name} Feature Importances: {model.feature_importances_}")

        r2 = r2_score(y_test, preds)
        results[name] = {"MAE": mean_absolute_error(y_test, preds), "R2": r2}
        
        if r2 > best_r2:
            best_r2 = r2
            best_model = model

    return best_model, scaler, encoders, results

if __name__ == "__main__":
    train_regression()
