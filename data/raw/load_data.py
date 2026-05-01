import pandas as pd
import os
import logging

logger = logging.getLogger(__name__)

def load_data():
    """
    Loads the student-mat.csv and student-por.csv datasets,
    merges them, and returns a single DataFrame.
    """
    current_dir = os.path.dirname(__file__)
    candidate_paths = [
        os.path.join(current_dir, 'student+performance', 'student'),
        os.path.join(os.path.dirname(current_dir), 'student+performance', 'student'),
        current_dir,
    ]

    data_path = None
    for candidate in candidate_paths:
        mat_path = os.path.join(candidate, 'student-mat.csv')
        por_path = os.path.join(candidate, 'student-por.csv')
        if os.path.exists(mat_path) and os.path.exists(por_path):
            data_path = candidate
            break

    if data_path is None:
        tried = '\n'.join(candidate_paths)
        raise FileNotFoundError(
            f"Unable to locate student-mat.csv and student-por.csv. Tried the following paths:\n{tried}"
        )

    try:
        df_mat = pd.read_csv(os.path.join(data_path, 'student-mat.csv'), sep=';')
        df_por = pd.read_csv(os.path.join(data_path, 'student-por.csv'), sep=';')
        logger.info("Successfully loaded student-mat.csv and student-por.csv.")
    except FileNotFoundError as e:
        logger.error(f"Error loading data files: {e}. Make sure 'student-mat.csv' and 'student-por.csv' are in '{data_path}'.")
        raise

    # Combine the two datasets
    return pd.concat([df_mat, df_por], ignore_index=True)