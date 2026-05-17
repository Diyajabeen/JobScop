from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

# ML Imports
from sklearn.linear_model import LinearRegression
import numpy as np

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset
df = pd.read_csv("jobs.csv")

# Home API
@app.get("/")
def home():
    return {
        "message": "JobScope AI Backend Running"
    }

# Dataset Preview API
@app.get("/data")
def get_data():
    return df.head(10).to_dict(orient="records")

# Total Count API
@app.get("/count")
def count():
    return {
        "total_rows": len(df)
    }

# Top States Analytics API
@app.get("/top-states")
def top_states():

    state_counts = (
        df.groupby("state")["total exports"]
        .sum()
        .sort_values(ascending=False)
        .head(5)
    )

    result = []

    for state, exports in state_counts.items():

        result.append({
            "name": state,
            "jobs": round(exports)
        })

    return result

# Export Distribution API
@app.get("/export-distribution")
def export_distribution():

    total_low = (
        df[df["total exports"] < 10000]
        ["total exports"]
        .sum()
    )

    total_high = (
        df[df["total exports"] >= 10000]
        ["total exports"]
        .sum()
    )

    return [
        {
            "name": "Low Export",
            "value": round(total_low)
        },
        {
            "name": "High Export",
            "value": round(total_high)
        }
    ]

# AI Insights API
@app.get("/ai-insights")
def ai_insights():

    # Highest export state
    top_state = (
        df.groupby("state")["total exports"]
        .sum()
        .sort_values(ascending=False)
        .idxmax()
    )

    # Total exports
    total_exports = df["total exports"].sum()

    # High export calculation
    high_export = (
        df[df["total exports"] >= 10000]
        ["total exports"]
        .sum()
    )

    percentage = round(
        (high_export / total_exports) * 100,
        2
    )

    insights = [
        f"{top_state} has the highest export contribution.",
        f"{percentage}% of exports come from high-export states.",
        "Analytics trends show strong market concentration.",
        "AI-powered insights help identify top-performing regions.",
        "Data visualization improves business decision-making."
    ]

    return insights

# ML Prediction API
@app.get("/prediction")
def prediction():

    # Training data
    X = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)

    y = np.array([2000, 4000, 6000, 8000, 10000])

    # Train model
    model = LinearRegression()
    model.fit(X, y)

    # Future prediction
    future = np.array([[6]])

    prediction = model.predict(future)[0]

    return {
        "future_prediction": round(prediction, 2)
    }