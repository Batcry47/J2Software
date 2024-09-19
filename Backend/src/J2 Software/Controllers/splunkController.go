package Controllers

import (
	"crypto/tls"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// SplunkResult represents the structure of event logs fetched from Splunk
type SplunkResult struct {
	Category       string `json:"Category"`
	Method         string `json:"Method"`
	Username       string `json:"Username"`
	IPAddress      string `json:"IPAddress"`
	EventTimeStamp string `json:"EventTimeStamp"` // Changed to string to directly map from Splunk's JSON
	Severity       string `json:"Severity"`
}

// SplunkResponse represents the data structure returned by the Splunk API
type SplunkResponse struct {
	Results []SplunkResult `json:"results"`
}

// FetchAndInsertFromSplunk is the function that fetches data from Splunk and stores it into MySQL periodically
func FetchAndInsertFromSplunk() {
	for {
		// Fetch data from Splunk
		data, err := getDataFromSplunk()
		if err != nil {
			log.Printf("Error fetching data from Splunk: %v", err)
			continue // Log the error and continue the loop
		}

		// Insert the data into MySQL
		err = insertIntoMySQL(data)
		if err != nil {
			log.Printf("Error inserting data into MySQL: %v", err)
			continue // Log the error and continue the loop
		}

		log.Println("Data successfully fetched from Splunk and inserted into MySQL.")

		// Sleep for a defined interval before fetching the next batch of data
		time.Sleep(5 * time.Minute) // Fetch every 5 minutes (adjust this interval as needed)
	}
}

func getHttpClient() *http.Client {
	// Create a custom HTTP client that ignores SSL certificate validation
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true}, // Skip certificate validation
	}
	client := &http.Client{Transport: tr}
	return client
}

// getDataFromSplunk fetches event data from Splunk via the Splunk REST API using basic authentication
func getDataFromSplunk() ([]SplunkResult, error) {
	url := "https://192.168.226.128:8089/services/search/jobs/export"
	method := "POST"
	username := "Admin"
	password := "Password123"

	payload := strings.NewReader(`search=search index=* earliest=-6mon | table Category, Method, Username, IPAddress, EventTimeStamp, Severity&output_mode=json`)

	client := getHttpClient()

	req, err := http.NewRequest(method, url, payload)
	if err != nil {
		return nil, err
	}

	auth := base64.StdEncoding.EncodeToString([]byte(username + ":" + password))
	req.Header.Add("Authorization", "Basic "+auth)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	// Make the request
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var results []SplunkResult
	decoder := json.NewDecoder(res.Body)

	for decoder.More() {
		var response map[string]interface{}

		err := decoder.Decode(&response)
		if err != nil {
			return nil, fmt.Errorf("error decoding JSON: %v", err)
		}

		// Check if there is a "result" field
		if resultData, ok := response["result"].(map[string]interface{}); ok {
			// Safely extract each field, providing a default if missing
			result := SplunkResult{
				Category:       getString(resultData, "Category"),
				Method:         getString(resultData, "Method"),
				Username:       getString(resultData, "Username"),
				IPAddress:      getString(resultData, "IPAddress"),
				EventTimeStamp: getString(resultData, "EventTimeStamp"),
				Severity:       getString(resultData, "Severity"),
			}
			results = append(results, result)
		}
	}

	return results, nil
}

// getString safely extracts a string from a map, providing a default value if the field is missing or not a string
func getString(data map[string]interface{}, key string) string {
	if value, exists := data[key]; exists {
		if str, ok := value.(string); ok {
			return str
		}
	}
	return "" // Default value if the field is missing
}

// insertIntoMySQL inserts the fetched Splunk event logs into the MySQL database
func insertIntoMySQL(data []SplunkResult) error {
	// Set up the connection to MySQL
	dsn := "admin:GameOver#74@tcp(127.0.0.1:3306)/AthenaDB?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return err
	}
	defer db.Close()

	// Insert each event log into the MySQL database
	for _, event := range data {
		query := `INSERT INTO EventLogs (Category, Method, Username, IPAddress, EventTimeStamp, Severity) 
		          VALUES (?, ?, ?, ?, ?, ?)`
		_, err := db.Exec(query, event.Category, event.Method, event.Username, event.IPAddress, event.EventTimeStamp, event.Severity)
		log.Printf("Inserted record into MySQL: %+v", event)

		if err != nil {
			log.Printf("Error inserting record into MySQL: %v", err)
			continue // Log the error and continue to the next record
		}
	}

	fmt.Println("All data inserted successfully into MySQL.")
	return nil
}
