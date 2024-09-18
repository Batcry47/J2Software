package main

import (
	"J2Software/initializers"
	"J2Software/models"
)

func init() {
	initializers.ConnectToDB()
	initializers.LoadEnvVariables()
}

func main() {
	initializers.DB.AutoMigrate(&models.EventLogs{})
}