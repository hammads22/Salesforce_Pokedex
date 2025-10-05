public with sharing class PokedexController {
    static string baseurl = 'callout:PokeApi2';
    @AuraEnabled(cacheable=true)
    public static String getPokemonList(Integer size, Integer offset) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        String url = baseurl +'/' + getEndPoint('Pokemon')+'?limit=' + size + '&offset=' + offset;
        request.setEndpoint(url);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        return response.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static String getPokemonDetails(String name) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(baseurl +'/' + getEndPoint('Pokemon')+'/' + name);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        return response.getBody();
    }

    private static string getEndPoint(String devname){
        return [Select Endpoint__c from Pokedex__mdt where DeveloperName = :devname limit 1].Endpoint__c;
    }
}