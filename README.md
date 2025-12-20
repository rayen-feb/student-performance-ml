#  Student Performance Prediction using Machine Learning

## 📌 Project Overview
This project aims to predict **student academic performance** using machine learning techniques.  
By analyzing demographic, academic, and behavioral features, the model helps identify key factors that influence student success.

The project follows a **standard data science pipeline** including data preprocessing, exploratory data analysis, model training, and evaluation.

---

## 🎯 Project Objectives
- Analyze student data and understand performance patterns
- Apply machine learning models to predict student performance
- Compare models and evaluate their effectiveness
- Gain insights that could support educational decision-making

---

## 📊 Dataset Description
The dataset contains student-related information such as:
- Demographic attributes
- Academic background
- Study habits and performance indicators

**Target Variable:**  
- Student performance (grade / score / category depending on the dataset)

📁 Dataset directory:

---

## 🧠 Machine Learning Workflow
1. Data loading
2. Data cleaning and preprocessing  
   - Handling missing values  
   - Encoding categorical variables  
   - Feature scaling
3. Exploratory Data Analysis (EDA)
4. Model training
5. Model evaluation and comparison
6. Result interpretation


---

## ⚙️ Technologies Used
- **Python**
- **Pandas, NumPy** – Data manipulation
- **Matplotlib / Seaborn** – Data visualization
- **Scikit-learn** – Machine learning models and evaluation

---

## 🚀 How to Run the Project

### 1️. Clone the repository
```bash
git clone https://github.com/rayen-feb/student-performance-ml.git
cd student-performance-ml
```

### 2.Create and activate a virtual environment (recommended)
````
python -m venv venv
source venv/bin/activate   # Linux / WSL
venv\Scripts\activate      # Windows
````

###3. Install dependencies
````
pip install -r requirements.txt
````

### 4.Run the project
```
python src/main.py
````

### 5. Model Evaluation
The models are evaluated using appropriate metrics such as:
Accuracy / RMSE / R²
Confusion Matrix (for classification)
Cross-validation scores
The best-performing model is selected based on evaluation results.

📌 Results & Insights

Identification of important features affecting student performance

Comparison of multiple machine learning models

Analysis of prediction accuracy and errors

(Graphs and metrics can be added here for better visualization)

 --- 
 
### Future Improvements

Add advanced models (XGBoost, Neural Networks)

Perform hyperparameter tuning

Create a web application (Flask or Streamlit)

Track experiments using MLflow

Deploy the model using Docker or cloud services

--- 

###  Author

Rayen Bouazizi
 Data Science Engineering Student
 Esprit University – Tunisia

GitHub: https://github.com/rayen-feb

### License

This project is intended for educational purposes.
A license can be added if required
