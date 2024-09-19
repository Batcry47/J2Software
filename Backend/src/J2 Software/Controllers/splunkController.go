package Controllers

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// EventLog represents the structure of event logs fetched from Splunk
type EventLog struct {
	Category       string    `json:"Category"`
	Method         string    `json:"Method"`
	Username       string    `json:"Username"`
	IPAddress      string    `json:"IPAddress"`
	EventTimeStamp time.Time `json:"EventTimeStamp"`
	Severity       string    `json:"Severity"`
}

// SplunkResponse represents the data structure returned by the Splunk API
type SplunkResponse struct {
	Results []EventLog `json:"results"`
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

// getDataFromSplunk fetches event data from Splunk via the Splunk REST API using basic authentication
func getDataFromSplunk() (*SplunkResponse, error) {
	// Set up Splunk API endpoint and your credentials
	url := "https://192.168.226.128/services/search/jobs/export"
	method := "POST"
	username := "<Admin>"
	password := "<Password123>"

	payload := strings.NewReader(`search=search index=<index_name> earliest=-15m | table Category, Method, Username, IPAddress, EventTimeStamp, Severity`)

	// Create the HTTP client and request
	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)
	if err != nil {
		return nil, err
	}

	// Set the Basic Authentication header
	auth := base64.StdEncoding.EncodeToString([]byte(username + ":" + password))
	req.Header.Add("Authorization", "Basic "+auth)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	// Execute the request
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	// Read the response body
	body, err := io.ReadAll(res.Body) // Use io.ReadAll instead of ioutil.ReadAll
	if err != nil {
		return nil, err
	}

	// Parse the JSON response
	var response SplunkResponse
	err = json.Unmarshal(body, &response)
	if err != nil {
		return nil, err
	}

	return &response, nil
}

// insertIntoMySQL inserts the fetched Splunk event logs into the MySQL database
func insertIntoMySQL(data *SplunkResponse) error {
	// Set up the connection to MySQL
	dsn := "admin:GameOver#74@tcp(127.0.0.1:3306)/AthenaDB?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return err
	}
	defer db.Close()

	// Insert each event log into the MySQL database
	for _, event := range data.Results {
		query := `INSERT INTO EventLogs (Category, Method, Username, IPAddress, EventTimeStamp, Severity) 
		          VALUES (?, ?, ?, ?, ?, ?)`
		_, err := db.Exec(query, event.Category, event.Method, event.Username, event.IPAddress, event.EventTimeStamp.Format("2006-01-02 15:04:05"), event.Severity)
		if err != nil {
			log.Printf("Error inserting record into MySQL: %v", err)
			continue // Log the error and continue to the next record
		}
	}

	fmt.Println("All data inserted successfully into MySQL.")
	return nil
}
