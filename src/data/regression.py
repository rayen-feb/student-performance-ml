from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from data.preprocessing import preprocess_data
from data.load_data import load_data
import numpy as np

def train_regression():
    df = load_data()
    X_train, X_test, y_train, y_test, _, _ = preprocess_data(df)

    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(random_state=42)
    }

    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)

        print(f"\n {name} Regression Results")
        print("MAE:", round(mean_absolute_error(y_test, preds), 2))
        print("RMSE:", round(np.sqrt(mean_squared_error(y_test, preds)), 2))
        print("R2 Score:", round(r2_score(y_test, preds), 2))

        # Optional: feature importance for tree-based model
        if hasattr(model, "feature_importances_"):
            print("Feature Importances:", model.feature_importances_)

if __name__ == "__main__":
    train_regression()
