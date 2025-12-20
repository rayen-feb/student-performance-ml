from data.load_data import load_data
from data.validate_data import validate_data

def run_pipeline():
    df = load_data()
    validate_data(df)

    print(" Pipeline step 1 completed successfully")

if __name__ == "__main__":
    run_pipeline()
