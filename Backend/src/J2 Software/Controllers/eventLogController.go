package Controllers

import (
	"J2Software/initializers"
	"J2Software/models"
	"time"

	"github.com/gin-gonic/gin"
)

// used to create an event log using the go api
// not used right now but may be neccessary in the future since this is a fully functional crud API
func CreateEventLog(c *gin.Context) {

	//get data off event (request) body
	var event struct {
		EventID        uint
		Category       string
		Method         string
		Username       string
		IPAddress      string
		EventTimeStamp time.Time
		Severity       string
	}
	c.Bind(&event)

	//create an alert:
	eventlog := models.EventLogs{EventID: event.EventID, Category: event.Category, Method: event.Method,
		Username: event.Username, IPAddress: event.IPAddress, EventTimeStamp: event.EventTimeStamp, Severity: event.Severity}

	result := initializers.DB.Create(&eventlog)

	if result.Error != nil {
		c.Status(400)
		return
	}

	//return it
	c.JSON(200, gin.H{
		"Eventlog": eventlog,
	})
}

// used to get all event logs in the database
func GetEventLogs(c *gin.Context) {

	//get the alerts and store them in a slice of type models.EventLogs
	var eventlogs []models.EventLogs

	//respond with those alerts
	//initializers.DB.First(&user) //Getting a log
	initializers.DB.Find(&eventlogs)

	c.JSON(200, gin.H{
		"Eventlogs": eventlogs,
	})

}

// used to get a single event log accroding to it's event id
func GetEventLog(c *gin.Context) {
	//get id off url
	EventID := c.Param("id")

	//get the alerts and store them in a slice of type models.EventLogs
	var eventlog models.EventLogs

	//respond with those alerts
	initializers.DB.First(&eventlog, EventID)

	c.JSON(200, gin.H{
		"Eventlog": eventlog,
	})
}

func UpdateEventLog(c *gin.Context) {
	//get the id off of the url
	EventID := c.Param("id")

	//get the data off the eventlog body
	var event struct {
		EventID        uint
		Category       string
		Method         string
		Username       string
		IPAddress      string
		EventTimeStamp time.Time
		Severity       string
	}
	c.Bind(&event)

	//find the eventlog we're updating
	var eventlog models.EventLogs
	initializers.DB.First(&eventlog, EventID)

	//update the eventlog
	initializers.DB.Model(&eventlog).Updates(models.EventLogs{
		EventID:        event.EventID,
		Category:       event.Category,
		Method:         event.Method,
		Username:       event.Username,
		IPAddress:      event.IPAddress,
		EventTimeStamp: event.EventTimeStamp,
		Severity:       event.Severity,
	})

	//respond with the eventlog
	c.JSON(200, gin.H{
		"Eventlog": eventlog,
	})
}

func DeleteEventLog(c *gin.Context) {
	//get the id off the url
	EventID := c.Param("id")

	//delete the eventlog
	initializers.DB.Delete(&models.EventLogs{}, EventID)

	//respond
	c.Status(200)
}

func GetEventLogsSeverityNum(c *gin.Context) {
	//get event severity
	Severity := c.Param("Severity")

	//get eventlog records
	var eventlogs []models.EventLogs

	//respond with severity number
	initializers.DB.Where("Severity = ?", Severity).Find(&eventlogs)
	severityNum := len(eventlogs)

	c.JSON(200, gin.H{
		"SeverityCount": severityNum,
	})
}

func GetCategoryCount(c *gin.Context) {
	//get event category
	Category := c.Param("Category")

	//get eventlog records
	var eventlogs []models.EventLogs

	//respond with category number
	initializers.DB.Where("Category <> ?", Category).Find(&eventlogs)
	categoryCount := len(eventlogs)

	c.JSON(200, gin.H{
		"CategoryCount": categoryCount,
	})
}

func GetImpactAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of Impact alerts
	initializers.DB.Where("Category = ?", "Impact").Find(&eventlogs)
	impactCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Impact": impactCount,
	})
}

func GetDefenseEvasionAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of Defense Evasion alerts
	initializers.DB.Where("Category = ?", "Defense_Evasion").Find(&eventlogs)
	defenseEvasionCount := len(eventlogs)

	c.JSON(200, gin.H{
		"DefenseEvasion": defenseEvasionCount,
	})
}

func GetPersistenceAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Persistence").Find(&eventlogs)
	persistenceCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Persistence": persistenceCount,
	})
}



func GetExfiltrationAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Exfiltration").Find(&eventlogs)
	exfiltrationCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Exfiltration": exfiltrationCount,
	})
}

func GetInitialAccessAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Initial_Access").Find(&eventlogs)
	initialAccessCount := len(eventlogs)

	c.JSON(200, gin.H{
		"InitialAccess": initialAccessCount,
	})
}

func GetEscalationAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Privilege Escalation").Find(&eventlogs)
	escalationCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Escalation": escalationCount,
	})
}

func GetCollectionAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Collection").Find(&eventlogs)
	collectionCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Collection": collectionCount,
	})
}

func GetReconnaissanceAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Reconnaissance").Find(&eventlogs)
	reconnaissanceCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Reconnaissance": reconnaissanceCount,
	})
}

func GetResourceDevelopmentAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Resource_Development").Find(&eventlogs)
	resourceDevelopmentCount := len(eventlogs)

	c.JSON(200, gin.H{
		"ResourceDevelopment": resourceDevelopmentCount,
	})
}

func GetExecutionAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Execution").Find(&eventlogs)
	executionCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Execution": executionCount,
	})
}

func GetEventTimeStamp(c *gin.Context) {
	// Parse the start_date and end_date query parameters
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	// Define the expected date format, e.g., "2023-08-13"
	const layout = "2006-01-02"

	// Parse the date strings into time.Time objects
	startDate, err := time.Parse(layout, startDateStr)
	if err != nil {
		c.Status(400)
		return
	}

	endDate, err := time.Parse(layout, endDateStr)
	if err != nil {
		c.Status(400)
		return
	}

	// Ensure endDate includes the entire day by setting the time to the end of the day
	endDate = endDate.AddDate(0, 0, 1).Add(-time.Nanosecond)

	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	result := initializers.DB.Where("EventTimeStamp >= ? AND EventTimeStamp <= ?", startDate, endDate).Find(&eventlogs)
	if result.Error != nil {
		c.Status(400)
		return
	}

	// Respond with the filtered event logs
	c.JSON(200, gin.H{
		"EventLogsBetween": eventlogs,
	})
}

func CountAllLogs(c *gin.Context) {
	//get the alerts and store them in a slice of type models.EventLogs
	var eventlogs []models.EventLogs

	//respond with those alerts
	//initializers.DB.First(&user)

	//Getting a log
	initializers.DB.Find(&eventlogs)

	//respond with those events
	totalLogsCount := len(eventlogs)
	c.JSON(200, gin.H{
		"AllLogs": totalLogsCount,
	})
}
