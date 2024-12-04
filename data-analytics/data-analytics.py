import requests
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
import numpy as np
import random

# Define your API call parameters
API_KEY = 'd0a55a115ee3c5e6d4f5c9386183a31c'
LAT = '13.54'
LON = '44.39'
API_URL = f"https://api.openweathermap.org/data/2.5/weather?lat={LAT}&lon={LON}&appid={API_KEY}&units=metric"

# Initialize a DataFrame to store the data
weather_data = pd.DataFrame(
    columns=['Timestamp', 'Temperature', 'Humidity', 'Pressure', 'Wind Speed', 'Rain'])

# Function to fetch weather data


def fetch_weather_data():
    response = requests.get(API_URL)
    if response.status_code == 200:
        data = response.json()
        timestamp = pd.to_datetime(data['dt'], unit='s')
        temperature = data['main']['temp'] + \
            random.uniform(-0.5, 0.5)  # Add noise to temperature
        humidity = data['main']['humidity']
        pressure = data['main']['pressure']
        wind_speed = data['wind']['speed']
        rain = data.get('rain', {}).get('1h', 0)  # Handle missing rain data
        return {
            'Timestamp': timestamp,
            'Temperature': temperature,
            'Humidity': humidity,
            'Pressure': pressure,
            'Wind Speed': wind_speed,
            'Rain': rain,
        }
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        return None

# Function to perform analytics and predictions


def perform_analytics(loss_factor=0.01):
    global weather_data
    if len(weather_data) > 2:  # Ensure enough data points for analysis
        # Prepare polynomial regression for temperature prediction
        weather_data['Time'] = (
            weather_data['Timestamp'] - weather_data['Timestamp'].min()).dt.total_seconds()
        X = weather_data[['Time']].values
        y = weather_data['Temperature'].values

        poly = PolynomialFeatures(degree=3)
        X_poly = poly.fit_transform(X)

        model = LinearRegression()
        model.fit(X_poly, y)

        # Predict temperatures for the next 10, 20, 30, and 40 seconds
        future_times = np.array([[weather_data['Time'].max() + i]
                                for i in [10, 20, 30, 40]])
        future_times_poly = poly.transform(future_times)
        future_temps = model.predict(future_times_poly)

        # Adjust predictions using a loss factor
        future_temps = future_temps + \
            np.random.uniform(-loss_factor, loss_factor,
                              size=future_temps.shape)

        # Return future timestamps and predicted temperatures
        future_timestamps = [
            weather_data['Timestamp'].max() + pd.Timedelta(seconds=i) for i in [10, 20, 30, 40]
        ]
        return future_timestamps, future_temps

    return [], []

# Function to update the plot


def update_plot(frame):
    global weather_data
    weather = fetch_weather_data()
    if weather:
        weather_data = pd.concat(
            [weather_data, pd.DataFrame([weather])], ignore_index=True)

        # Save to CSV for persistence
        weather_data.to_csv('weather_data.csv', index=False)

    plt.cla()  # Clear the current axes
    plt.title("Live Weather Analytics: Predictions vs Actual Data", fontsize=16)
    plt.xlabel("Timestamp", fontsize=12)
    plt.ylabel("Temperature (°C)", fontsize=12)
    plt.xticks(rotation=45, fontsize=10)
    plt.yticks(fontsize=10)
    plt.grid(visible=True, which="major",
             linestyle="--", linewidth=0.5, alpha=0.7)
    plt.tight_layout()

    # Plot historical temperature data
    if not weather_data.empty:
        # Scatter plot for actual temperature
        plt.scatter(weather_data['Timestamp'], weather_data['Temperature'],
                    label='Actual Data', color='blue', alpha=0.7)

        # Line plot for historical temperature
        plt.plot(weather_data['Timestamp'], weather_data['Temperature'],
                 label='Temperature (°C)', color='blue', linewidth=2)

        # Predictions
        future_timestamps, future_temps = perform_analytics()
        if future_timestamps:
            # Scatter plot for predictions
            plt.scatter(future_timestamps, future_temps,
                        label="Predicted Temperatures", color='orange', alpha=0.7)
            # Line plot for predictions
            plt.plot(future_timestamps, future_temps, label="Prediction Line",
                     color='orange', linestyle='--', linewidth=2)

        # Adjust x-axis to show historical + future data
        plt.xlim(weather_data['Timestamp'].min(
        ), weather_data['Timestamp'].max() + pd.Timedelta(seconds=50))
        plt.legend(fontsize=12)


# Initialize the plot
fig, ax = plt.subplots(figsize=(15, 8))  # Increased width for a detailed plot
ani = FuncAnimation(fig, update_plot, interval=1000)  # Update every second

# Run the live plot
plt.show()
