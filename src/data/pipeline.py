from data.load_data import load_data
from data.validate_data import validate_data
from src.models.regression import train_regression
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

def run_pipeline():
    logging.info("--- Starting Student Performance Pipeline ---")
    
    logging.info("Step 1: Loading and Validating Data")
    df = load_data()
    validate_data(df)
    logging.info("Data Validation successful.")
    
    logging.info("Step 2: Training and Evaluating Models")
    train_regression(df)
    
    logging.info("Pipeline completed successfully.")

if __name__ == "__main__":
    run_pipeline()
