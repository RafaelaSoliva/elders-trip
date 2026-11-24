using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace EldersTrip;

public class GetWeather
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GetWeather> _logger;

    public GetWeather(IHttpClientFactory httpClientFactory, ILogger<GetWeather> logger)
    {
        _httpClient = httpClientFactory.CreateClient();
        _logger = logger;
    }

    [Function("GetWeather")]
    public async Task<IActionResult> Run ([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest request, CancellationToken cancellationToken)
    {
        string? latitudeString = request.Query["latitude"];
        string? longitudeString = request.Query["longitude"];

        if(!double.TryParse(latitudeString, NumberStyles.Float, CultureInfo.InvariantCulture, out var latitude))
        {
            return new BadRequestObjectResult("Parâmetro de latitude inválido!");
        }

        if(!double.TryParse(longitudeString, NumberStyles.Float, CultureInfo.InvariantCulture, out var longitude))
        {
            return new BadRequestObjectResult("Parâmetro de longitude inválido!");
        }

        var url = string.Create(CultureInfo.InvariantCulture, $"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=is_day,rain");

        try
        {
            var response = await _httpClient.GetAsync(url, cancellationToken);

            if(!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("API externa: {Status}", response.StatusCode);
                return new StatusCodeResult(StatusCodes.Status502BadGateway);
            }

            var data = await response.Content.ReadFromJsonAsync<OpenMeteoResponse>(cancellationToken);

            if(data?.Current is null)
            {
                _logger.LogWarning("API Externa: resposta nula");
                return new StatusCodeResult(StatusCodes.Status502BadGateway);
            }

            var result = new WeatherResult(IsDay: data.Current.IsDay == 0, Rain: data.Current.Rain);

            return new OkObjectResult(result);
        } 
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Falha ao chamar Open-Meteo API");
            return new StatusCodeResult(StatusCodes.Status502BadGateway);
        }
    }
}

public record OpenMeteoResponse([property: JsonPropertyName("current")] OpenMeteoCurrent? Current);
public record OpenMeteoCurrent([property: JsonPropertyName("is_day")] int IsDay, [property: JsonPropertyName("rain")] double Rain);
public record WeatherResult(bool IsDay, double Rain);