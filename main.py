from src.pipeline import run_pipeline
import logging

if __name__ == "__main__":
    # This entry point ensures the project root is in the Python path
    # solving the ModuleNotFoundError for 'data' and 'src'
    run_pipeline()