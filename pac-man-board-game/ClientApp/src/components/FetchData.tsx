import React from "react";

export const FetchData = () => {

  const [forecasts, setForecasts] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);

  async function populateWeatherData() {
    const response = await fetch("api/WeatherForecast");
    const data = await response.json();
    setForecasts(data);
    setLoading(false);
  }

  React.useEffect(() => {
    populateWeatherData().then(null);
  }, []);

  return <>
    {
      loading ?
        <p><em>Loading...</em></p> :
        <table className="table table-striped" aria-labelledby="tableLabel">
          <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
          </thead>
          <tbody>
          {forecasts.map((forecast: any) =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
          </tbody>
        </table>

    }</>;
};
