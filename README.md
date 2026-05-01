# 🎓 Student Performance Prediction using Machine Learning

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-orange.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-Web%20App-ff4b4b.svg)
![Flask](https://img.shields.io/badge/Flask-API-000000.svg)
![XGBoost](https://img.shields.io/badge/XGBoost-Regression-7B68EE.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📌 Project Overview

This project predicts **student academic performance** using advanced machine learning techniques. By analyzing demographic, academic, and behavioral features, the system identifies key factors influencing student success and provides actionable insights through interactive web interfaces.

The project features **dual web interfaces**:
- **FactuScan AI** (Streamlit) - A modern SaaS-style dashboard with real-time analytics
- **Flask Web App** - A traditional web application with HTML templates

---

## ✨ Key Features

- 🤖 **Multi-Model Comparison** - Trains and evaluates 5 regression models automatically
- 📊 **Interactive Dashboard** - Real-time visualizations with Plotly charts
- 🔮 **AI Predictor** - Interactive form for generating student grade predictions
- 📈 **Analytics Explorer** - Distribution analysis and correlation matrices
- 🎯 **Auto Model Selection** - Automatically selects the best-performing model
- 🌐 **Dual Interface** - Both Streamlit and Flask applications included
- ⚡ **Cached Inference** - Model caching for fast predictions

---

## 📊 Dataset Description

The project uses the [UCI Student Performance Dataset](https://archive.ics.uci.edu/ml/datasets/Student+Performance), combining data from **Mathematics** (`student-mat.csv`) and **Portuguese Language** (`student-por.csv`) courses.

### Dataset Attributes (32 Features)

| # | Attribute | Description | Type |
|---|-----------|-------------|------|
| 1 | `school` | Student's school (GP - Gabriel Pereira / MS - Mousinho da Silveira) | Binary |
| 2 | `sex` | Student's sex (F - female / M - male) | Binary |
| 3 | `age` | Student's age (15 to 22) | Numeric |
| 4 | `address` | Home address type (U - urban / R - rural) | Binary |
| 5 | `famsize` | Family size (LE3 - ≤3 / GT3 - >3) | Binary |
| 6 | `Pstatus` | Parent's cohabitation status (T - together / A - apart) | Binary |
| 7 | `Medu` | Mother's education (0-none, 1-primary, 2-5th-9th, 3-secondary, 4-higher) | Numeric |
| 8 | `Fedu` | Father's education (0-none, 1-primary, 2-5th-9th, 3-secondary, 4-higher) | Numeric |
| 9 | `Mjob` | Mother's job (teacher, health, services, at_home, other) | Nominal |
| 10 | `Fjob` | Father's job (teacher, health, services, at_home, other) | Nominal |
| 11 | `reason` | Reason to choose school (home, reputation, course, other) | Nominal |
| 12 | `guardian` | Student's guardian (mother, father, other) | Nominal |
| 13 | `traveltime` | Home to school travel time (1-<15min, 2-15-30min, 3-30min-1hr, 4->1hr) | Numeric |
| 14 | `studytime` | Weekly study time (1-<2hrs, 2-2-5hrs, 3-5-10hrs, 4->10hrs) | Numeric |
| 15 | `failures` | Number of past class failures (n if 1≤n<3, else 4) | Numeric |
| 16 | `schoolsup` | Extra educational support (yes/no) | Binary |
| 17 | `famsup` | Family educational support (yes/no) | Binary |
| 18 | `paid` | Extra paid classes (yes/no) | Binary |
| 19 | `activities` | Extra-curricular activities (yes/no) | Binary |
| 20 | `nursery` | Attended nursery school (yes/no) | Binary |
| 21 | `higher` | Wants higher education (yes/no) | Binary |
| 22 | `internet` | Internet access at home (yes/no) | Binary |
| 23 | `romantic` | In a romantic relationship (yes/no) | Binary |
| 24 | `famrel` | Quality of family relationships (1-very bad to 5-excellent) | Numeric |
| 25 | `freetime` | Free time after school (1-very low to 5-very high) | Numeric |
| 26 | `goout` | Going out with friends (1-very low to 5-very high) | Numeric |
| 27 | `Dalc` | Workday alcohol consumption (1-very low to 5-very high) | Numeric |
| 28 | `Walc` | Weekend alcohol consumption (1-very low to 5-very high) | Numeric |
| 29 | `health` | Current health status (1-very bad to 5-very good) | Numeric |
| 30 | `absences` | Number of school absences (0 to 93) | Numeric |
| 31 | `G1` | First period grade (0 to 20) | Numeric |
| 32 | `G2` | Second period grade (0 to 20) | Numeric |
| **Target** | `G3` | **Final grade (0 to 20)** | **Numeric** |

**Dataset Size:** ~1,044 student records (382 students appear in both datasets)

---

## 🧠 Machine Learning Workflow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Loading  │───▶│  Data Validation │───▶│  Preprocessing  │
│  (Mat + Por)    │    │  (Quality Check) │    │ (Encode + Scale)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
┌─────────────────┐    ┌─────────────────┐            │
│  Model Selection│◀───│  Model Training  │◀───────────┘
│  (Best R²)      │    │  (5 Regressors)  │
└─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐
│  Web Deployment │───▶│  Prediction API  │
│ Streamlit/Flask │    │  (Real-time)     │
└─────────────────┘    └─────────────────┘
```

### Data Preprocessing Pipeline
1. **Data Loading** - Merges Math and Portuguese datasets
2. **Validation** - Checks data quality and integrity
3. **Encoding** - Label encoding for categorical variables
4. **Scaling** - StandardScaler for numeric features
5. **Split** - 80/20 train-test split

---

## 🤖 Models & Performance

The system automatically trains and compares multiple regression models:

| Model | Description |
|-------|-------------|
| **Linear Regression** | Baseline linear model |
| **Random Forest** | Ensemble of decision trees |
| **Gradient Boosting** | Sequential error-correcting ensemble |
| **MLP Regressor** | Neural network with 2 hidden layers (64, 32) |
| **XGBoost Regressor** | Extreme Gradient Boosting (optional) |

### Evaluation Metrics
- **MAE** (Mean Absolute Error) - Average prediction error
- **RMSE** (Root Mean Squared Error) - Standard deviation of residuals
- **R² Score** - Coefficient of determination (proportion of variance explained)

The best-performing model is automatically selected based on the highest R² score.

---

## 🚀 Web Applications

### 1. FactuScan AI (Streamlit) - `app.py`

A modern SaaS-style dashboard with four interactive workspaces:

| Page | Description |
|------|-------------|
| **Dashboard** | Strategic overview with KPI cards, model benchmark chart, and operational notes |
| **Analytics Explorer** | Raw data viewer, distribution analysis, and correlation matrix |
| **Predictor AI** | Interactive form for generating student grade predictions with performance classification |
| **Training & Support** | Model training documentation and support toolkit |

**Features:**
- Real-time model benchmark visualization
- Animated confidence score display
- Interactive prediction with performance classification (Excellent/Pass/High Risk)
- Support modal with best practices

```bash
streamlit run app.py
```

### 2. Flask Web App - `app_flask.py`

A traditional web application with server-rendered HTML templates:

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Model benchmark and KPI overview |
| `/analytics` | Distribution charts and correlation matrix |
| `/predictor` | Interactive prediction form (GET/POST) |
| `/support` | Support and documentation page |

```bash
python app_flask.py
```

---

## 📁 Project Structure

```
student-performance-ml/
├── 📄 README.md                 # Project documentation
├── 📄 requirements.txt          # Python dependencies
├── 🐍 app.py                    # Streamlit application (FactuScan AI)
├── 🐍 app_flask.py              # Flask web application
├── 🐍 main.py                   # CLI entry point for pipeline
│
├── 📂 data/                     # Data layer
│   ├── __init__.py
│   ├── load_data.py             # Data loading interface
│   ├── preprocessing.py         # Preprocessing interface
│   ├── validate_data.py         # Data validation
│   ├── raw/                     # Raw data implementations
│   │   ├── __init__.py
│   │   ├── load_data.py         # Dataset loading (Mat + Por)
│   │   ├── preprocessing.py     # Encoding & scaling
│   │   └── validate_data.py     # Quality checks
│   └── student+performance/     # Dataset files
│       └── student/
│           ├── student-mat.csv  # Math course data
│           ├── student-por.csv  # Portuguese course data
│           └── student.txt      # Attribute descriptions
│
├── 📂 src/                      # Source code
│   ├── __init__.py
│   ├── pipeline.py              # Main pipeline orchestrator
│   ├── templates/               # HTML templates (Flask)
│   │   ├── analytics.html
│   │   ├── dashboard.html
│   │   ├── index.html
│   │   ├── predictor.html
│   │   └── support.html
│   ├── data/                    # Data pipeline components
│   │   ├── __init__.py
│   │   ├── pipeline.py
│   │   ├── regression.py
│   │   ├── data/                # Nested data modules
│   │   │   ├── __init__.py
│   │   │   └── models/
│   │   │       ├── __init__.py
│   │   │       └── regression.py  # Model training logic
│   │   └── visualization/
│   │       ├── __init__.py
│   │       └── reporting.py
│   ├── models/                  # Model definitions
│   │   ├── __init__.py
│   │   └── regression.py
│   └── visualization/           # Visualization utilities
│       ├── __init__.py
│       └── reporting.py
│
└── 📂 static/                   # Static assets (Flask)
    ├── script.js
    └── styles.css
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip package manager

### 1. Clone the Repository

```bash
git clone https://github.com/rayen-feb/student-performance-ml.git
cd student-performance-ml
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies:**
- `numpy` - Numerical computing
- `pandas` - Data manipulation
- `scikit-learn` - Machine learning models
- `matplotlib` - Data visualization
- `seaborn` - Statistical visualization
- `xgboost` - Gradient boosting framework
- `streamlit` - Web application framework
- `plotly` - Interactive charts
- `flask` - Web framework

---

## 🎮 Usage

### Option 1: Run Streamlit Dashboard (Recommended)

```bash
streamlit run app.py
```
Access at: `http://localhost:8501`

### Option 2: Run Flask Web App

```bash
python app_flask.py
```
Access at: `http://localhost:5000`

### Option 3: Run CLI Pipeline

```bash
python main.py
```

### Option 4: Run Model Training Directly

```bash
python src/data/models/regression.py
```

---

## 🌐 GitHub Pages Deployment

This project includes a **static site version** that can be deployed directly to GitHub Pages.

### Static Site Features
- ✅ Pure static HTML/CSS/JavaScript (no Python backend required)
- ✅ Interactive dashboard with model metrics
- ✅ Analytics explorer with visualizations
- ✅ AI Predictor with real-time grade predictions
- ✅ Support and documentation pages
- ✅ Works directly in the browser

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add static site for GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to Repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" as the branch
   - Select "/ (root)" as the folder
   - Click Save

3. **Access Your Site**
   - Your site will be available at: `https://yourusername.github.io/student-performance-ml/`

### Static Site Files
```
student-performance-ml/
├── index.html          # Main dashboard
├── analytics.html    # Analytics page
├── predictor.html   # Prediction form
├── support.html    # Support page
├── 404.html       # Custom 404 page
├── .nojekyll      # GitHub Pages config
├── css/
│   └── styles.css # Main styles
├── js/
│   └── app.js     # ML prediction engine
└── json/
    ├── model.json      # Model coefficients
    ├── encoders.json  # Label encoders
    ├── scaler.json   # Feature scaler
    └── metrics.json # Model metrics
```

### Local Development
To test locally, simply open `index.html` in a web browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

---

## 📈 Results & Insights

### Key Findings
- **Attendance is the strongest predictor** of student performance
- **Study time** shows significant correlation with final grades
- **Past failures** are strong negative indicators
- **Parental education** (especially mother's) positively influences outcomes
- **Alcohol consumption** (workday and weekend) negatively impacts grades

### Performance Classification
The predictor classifies results into three categories:
- 🟢 **Excellent** (≥15/20) - Strong expected achievement
- 🟡 **Pass** (10-14/20) - Meeting minimum requirements
- 🔴 **High Risk** (<10/20) - At risk of failure

---

## 🔮 Future Improvements

- [ ] **Hyperparameter Tuning** - Grid/random search for optimal model parameters
- [ ] **Feature Engineering** - Polynomial features and interaction terms
- [ ] **Advanced Models** - Deep learning with TensorFlow/PyTorch
- [ ] **Model Interpretability** - SHAP values for feature importance
- [ ] **A/B Testing** - Compare model versions in production
- [ ] **MLflow Integration** - Experiment tracking and model registry
- [ ] **Docker Deployment** - Containerize for easy deployment
- [ ] **Cloud Hosting** - Deploy on AWS/GCP/Azure
- [ ] **REST API** - Standalone prediction API service
- [ ] **Real-time Monitoring** - Model drift detection

---

## 👨‍💻 Author

**Rayen Bouazizi**
- 🎓 Data Science Engineering Student
- 🏫 Esprit University – Tunisia
- 🐙 GitHub: [@rayen-feb](https://github.com/rayen-feb)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets/Student+Performance) for the dataset
- [Scikit-learn](https://scikit-learn.org/) for the machine learning framework
- [Streamlit](https://streamlit.io/) for the interactive web framework

---

<p align="center">
  Made with ❤️ and ☕ by <a href="https://github.com/rayen-feb">Rayen Bouazizi</a>
</p>
