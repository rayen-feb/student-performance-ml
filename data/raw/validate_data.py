import logging

logger = logging.getLogger(__name__)

def validate_data(df):
    if df is None or df.empty:
        raise ValueError("Loaded DataFrame is empty or None.")
    
    # Basic check for required columns defined in student.txt
    required = ['school', 'sex', 'age', 'G1', 'G2', 'G3']
    missing = [col for col in required if col not in df.columns]
    
    if missing:
        raise ValueError(f"Dataset is missing required columns: {missing}")
    
    logger.info(f"Validation successful: {len(df)} rows and {len(df.columns)} columns found.")