#include <SoftwareSerial.h>//incluimos SoftwareSerial
#include <TinyGPS.h>//incluimos TinyGPS
#include <ESP8266WiFi.h>

const char* ssid     = "dlink - palestra";
const char* password = "445926156";

const char* host = "31.220.52.41";

TinyGPS gps;//Declaramos el objeto gps
//SoftwareSerial serialgps(8, 7); //Declaramos el pin 8 Tx y 7 Rx
SoftwareSerial serialgps(13, 15); //Declaramos el pin 8 Tx y 7 Rx

//Declaramos la variables para la obtención de datos
int year;
byte month, day, hour, minute, second, hundredths;
unsigned long chars;
unsigned short sentences, failed_checksum;

void setup()
{
  Serial.begin(115200);//Iniciamos el puerto serie

  delay(10);

  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  serialgps.begin(9600);//Iniciamos el puerto serie del gps
  
  //Imprimimos:
  Serial.println("");
  Serial.println(" ---Buscando sinal--- ");
  Serial.println("");
}

void loop()
{
  while (serialgps.available())
  {
    int c = serialgps.read();
    char lat[25];
    char log[25];

    if (gps.encode(c))
    {
      float latitude, longitude;
      
      gps.f_get_position(&latitude, &longitude);

      delay(5000);
      ++value;

      Serial.print("connecting to ");
      Serial.println(host);

      // Use WiFiClient class to create TCP connections
      WiFiClient client;
      const int httpPort = 8000;
      Serial.println(client.connect(host, httpPort));
      if (!client.connect(host, httpPort)) {
        Serial.println("connection failed");
        return;
      }

      dtostrf(latitude, 6, 2, lat);
      dtostrf(longitude, 6, 2, log);
      // We now create a URI for the request
      String url = "/lat/" + latitude + "/log/" + longitude + "/user/1";

      Serial.print("Requesting URL: ");
      Serial.println(url);

      // This will send the request to the server
      client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                   "Host: " + host + "\r\n" + 
                   "Connection: close\r\n\r\n");
      
      delay(10);

      // Read all the lines of the reply from server and print them to Serial
      Serial.println("Respond:");
      while(client.available()){
        String line = client.readStringUntil('\r');
        Serial.print(line);
      }

      Serial.println();
      Serial.println("closing connection");

      Serial.print("Latitud/Longitud: ");
      Serial.print(latitude, 5);
      Serial.print(", ");
      Serial.println(longitude, 5);
    }
  }
}
