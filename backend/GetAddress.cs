using System.Net;
using System.Text.Json;
using System.Web;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace EldersTrip;

public class GetAddress
{
    private static readonly HttpClient Http = new();

    [Function("GetAddress")]
    public async Task<HttpResponseData> Run ([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request)
    {
        var text = HttpUtility.ParseQueryString(request.Url.Query)["q"];
        var response = request.CreateResponse(HttpStatusCode.OK);

        if(string.IsNullOrWhiteSpace(text) || text.Length < 5)
        {
            await response.WriteAsJsonAsync(Array.Empty<object>());
            return response;
        }

        var key = Environment.GetEnvironmentVariable("AZURE_MAPS_KEY");
        var url = "https://atlas.microsoft.com/search/fuzzy/json"
                    + "?api-version=1.0"
                    + $"&subscription-key={key}"
                    + $"&query={Uri.EscapeDataString(text)}"
                    + "&typeahead=true&countrySet=BR&language=pt-BR&limit=5";
        
        using var doc = JsonDocument.Parse(await Http.GetStringAsync(url));

        var suggestions = doc.RootElement.GetProperty("results").EnumerateArray()
        .Select(r => new
        {
            endereco = r.GetProperty("address").GetProperty("freeformAddress").GetString(),
            latitude = r.GetProperty("position").GetProperty("lat").GetDouble(),
            longitude = r.GetProperty("position").GetProperty("lon").GetDouble()
        }).ToList();

        await response.WriteAsJsonAsync(suggestions);
        return response;
    }
}
